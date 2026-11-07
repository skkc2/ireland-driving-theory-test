import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { formats, loadContent, loadReviewQueue, scoreSession, secondsRemaining } from '../content.mjs';

const study = JSON.parse(readFileSync(new URL('../data/study.json', import.meta.url)));
const queue = JSON.parse(readFileSync(new URL('../review/questions.json', import.meta.url)));
const practice = queue.questions[0];
const review = { reviewer: 'Test reviewer', qualification: 'Test qualification', date: practice.evidence.checkedOn };

function mockFixture(category) {
  const questions = Array.from({ length: formats[category].count }, (_, index) => ({
    ...practice,
    id: `test-${index}`,
    scenarioId: `test-scenario-${index}`,
    question: `Synthetic fixture ${index}?`,
    categories: [category === 'CD' ? (index % 2 ? 'C' : 'D') : category],
    use: 'mock',
    evidence: { ...practice.evidence, independent: review },
  }));
  const paper = {
    id: 'test-paper', name: 'Fixture mock', category, questionIds: questions.map(q => q.id),
    reviewer: 'Test reviewer', checkedOn: review.date, coverage: 'Fixture only',
  };
  return { topics: study.topics, questions, papers: [paper] };
}

test('the current study data can be loaded and the draft archive cannot', () => {
  loadContent(study);
  assert.ok(loadReviewQueue(study.topics, queue.questions, queue.papers).size > 0);
  const archive = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url)));
  assert.throws(() => loadContent(archive), /Missing content lists/);
  assert.throws(() => loadContent({ ...study, questions: [archive.questions[0]] }), /Invalid question/);
});

test('release data rejects duplicate scenarios and invalid answer evidence', () => {
  const duplicate = { ...practice, id: 'duplicate-id' };
  assert.throws(() => loadReviewQueue(study.topics, [practice, duplicate]), /Duplicate scenario ID/);
  for (const invalid of [
    { ...practice, answer: practice.options.length },
    { ...practice, evidence: { ...practice.evidence, checkedOn: '2026-02-31' } },
    { ...practice, evidence: { ...practice.evidence, url: 'https://example.com/' } },
    { ...practice, evidence: { ...practice.evidence, scope: '' } },
  ]) {
    assert.throws(() => loadContent({ ...study, questions: [invalid] }), /Invalid question or evidence/);
  }
});

test('AI-checked questions need a different reviewer before release', () => {
  assert.throws(() => loadContent({ ...study, questions: [practice] }), /Independent review required/);
  for (const independent of [{ ...review, reviewer: practice.evidence.reviewer }, { ...review, date: '2025-01-01' }]) {
    const q = { ...practice, evidence: { ...practice.evidence, independent } };
    assert.throws(() => loadContent({ ...study, questions: [q] }), /Independent review required/);
  }
  const q = { ...practice, evidence: { ...practice.evidence, independent: { reviewer: review.reviewer, date: review.date } } };
  assert.equal(loadContent({ ...study, questions: [q] }).practice.length, 1);
  assert.throws(() => loadReviewQueue(study.topics, [q]), /Unexpected independent review/);
});

test('specialist questions and lessons need documented independent review', () => {
  const q = { ...practice, topic: 'hours' };
  assert.throws(() => loadContent({ ...study, questions: [q] }), /Independent review required/);
  q.evidence = { ...q.evidence, independent: review };
  assert.throws(() => loadContent({ ...study, questions: [q] }), /Independent review required/);
});

test('exact paper sizes, category coverage and no overlap are enforced', () => {
  for (const category of ['C', 'D', 'CD']) {
    const data = mockFixture(category);
    const [paper] = loadContent(data).papers;
    assert.equal(paper.questions.length, formats[category].count);
    assert.throws(() => loadContent({ ...data, papers: [...data.papers, { ...data.papers[0], id: 'other-paper' }] }), /repeated question/);
    data.papers[0].questionIds.pop();
    assert.throws(() => loadContent(data), /Invalid paper format/);
  }

  const truck = mockFixture('C');
  truck.questions[0].categories = ['D'];
  assert.throws(() => loadContent(truck), /Unavailable/);

  const combined = mockFixture('CD');
  combined.questions.forEach(q => { q.categories = ['C']; });
  assert.throws(() => loadContent(combined), /cover both categories/);
});

test('the first truck and bus candidates have 100 eligible questions each and no overlap', () => {
  const byId = new Map(queue.questions.map(q => [q.id, q]));
  const firstPapers = [['truck-c-1', 'C'], ['bus-d-1', 'D']];
  const scenarios = new Set();

  for (const [id, category] of firstPapers) {
    const paper = queue.papers.find(p => p.id === id);
    assert.equal(paper.category, category);
    assert.equal(paper.questionIds.length, formats[category].count);
    const questions = paper.questionIds.map(questionId => byId.get(questionId));
    for (const q of questions) {
      assert.equal(q.use, 'mock');
      assert.ok(q.categories.includes(category));
      assert.ok(!scenarios.has(q.scenarioId));
      scenarios.add(q.scenarioId);
    }
    assert.throws(() => loadContent({ ...study, questions, papers: [paper] }), /Independent review required/);

    const pass = formats[category].pass;
    const answers = new Map(questions.slice(0, pass - 1).map(q => [q.id, q.answer]));
    assert.equal(scoreSession(questions, answers, pass).passed, false);
    answers.set(questions[pass - 1].id, questions[pass - 1].answer);
    assert.equal(scoreSession(questions, answers, pass).passed, true);
  }

  const truck = queue.papers.find(p => p.id === 'truck-c-1');
  assert.throws(() => loadReviewQueue(study.topics, queue.questions, [
    truck, { ...truck, id: 'overlap' },
  ]), /repeated question/);
  assert.throws(() => loadReviewQueue(study.topics, queue.questions, [
    { ...truck, questionIds: [queue.questions[0].id, ...truck.questionIds.slice(1)] },
  ]), /Unavailable/);
});

test('raw marks decide passes even when displayed percentages round up', () => {
  for (const category of ['C', 'D', 'CD']) {
    const { questions, format } = loadContent(mockFixture(category)).papers[0];
    const answers = new Map(questions.slice(0, format.pass - 1).map(q => [q.id, q.answer]));
    assert.equal(scoreSession(questions, answers, format.pass).passed, false);
    const next = questions[format.pass - 1];
    answers.set(next.id, next.answer);
    assert.equal(scoreSession(questions, answers, format.pass).passed, true);
    assert.equal(scoreSession(questions, answers).passed, null);
  }
});

test('the clock uses elapsed time and clamps an expired deadline to zero', () => {
  assert.equal(secondsRemaining(7_200_000, 7_198_500), 2);
  assert.equal(secondsRemaining(7_200_000, 7_199_999), 1);
  assert.equal(secondsRemaining(7_200_000, 7_200_000), 0);
  assert.equal(secondsRemaining(7_200_000, 8_000_000), 0);
});
