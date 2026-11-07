import { readFile } from 'node:fs/promises';
import { loadContent, loadReviewQueue } from '../content.mjs';

const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [study, draft, queue] = await Promise.all([
  read('../data/study.json'), read('../data/questions.json'), read('../review/questions.json'),
]);
const content = loadContent(study);
loadReviewQueue(study.topics, queue.questions, queue.papers);
const queuedIds = new Set(queue.questions.map(q => q.id));
const queuedScenarios = new Set(queue.questions.map(q => q.scenarioId));
if (study.questions.some(q => queuedIds.has(q.id) || queuedScenarios.has(q.scenarioId))) {
  throw new Error('Released content overlaps with the review queue');
}

const topicIds = new Set(draft.topics.map(topic => topic.id));
const questionIds = new Set();
for (const q of draft.questions) {
  if (!q.id || questionIds.has(q.id) || !topicIds.has(q.topic) ||
    !q.question?.trim() || !q.explanation?.trim() ||
    !Array.isArray(q.options) || q.options.length < 3 || q.options.length > 4 ||
    !q.options.every(option => typeof option === 'string' && option.trim()) ||
    !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length ||
    q.validationStatus !== 'unverified') {
    throw new Error(`Invalid quarantined record: ${q.id}`);
  }
  questionIds.add(q.id);
}
console.log(`${content.topics.length} lessons, ${content.practice.length} practice questions, ${content.papers.length} released mocks, ${questionIds.size} quarantined rows, ${queue.questions.length} AI-checked candidates and ${queue.papers?.length ?? 0} candidate papers awaiting independent review`);
