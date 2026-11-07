export const formats = {
  C: { name: 'Truck (C)', count: 100, minutes: 120, pass: 74 },
  D: { name: 'Bus (D)', count: 100, minutes: 120, pass: 74 },
  CD: { name: 'Combined truck and bus (CD)', count: 140, minutes: 180, pass: 104 },
};

const present = value => typeof value === 'string' && value.trim().length > 0;
const id = value => present(value) && /^[a-z0-9-]+$/.test(value);
const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const authority = /^(www\.)?(rsa\.ie|theorytest\.ie|transportforireland\.ie|cvrt\.ie|hsa\.ie|tii\.ie|irishstatutebook\.ie|eur-lex\.europa\.eu)$/;
const normal = value => value.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');

function source(value) {
  try {
    const url = new URL(value?.url);
    return url.protocol === 'https:' && authority.test(url.hostname) &&
      !url.username && !url.password && present(value.section);
  } catch {
    return false;
  }
}

function approval(value, sourceDate, specialist = false) {
  return present(value?.reviewer) && (!specialist || present(value.qualification)) &&
    date(value.date) && value.date >= sourceDate;
}

function unique(items, key, name) {
  const values = items.map(key);
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${name}`);
}

function checkTopics(topics) {
  if (!Array.isArray(topics)) throw new Error('Missing topics list');
  for (const topic of topics) {
    if (!id(topic.id) || !present(topic.name) || !present(topic.summary) ||
      !['core', 'professional', 'supplementary'].includes(topic.scope) ||
      !Array.isArray(topic.lesson) || !topic.lesson.length || !topic.lesson.every(present) ||
      !Array.isArray(topic.sources) || !topic.sources.length || !topic.sources.every(source) ||
      !date(topic.checkedOn) || !present(topic.reviewer)) {
      throw new Error(`Invalid lesson: ${topic.id}`);
    }
  }
  unique(topics, t => t.id, 'topic ID');
  return new Map(topics.map(t => [t.id, t]));
}

function checkQuestions(questions, topicMap, pending) {
  if (!Array.isArray(questions)) throw new Error('Missing questions list');
  for (const q of questions) {
    const topic = topicMap.get(q.topic);
    const e = q.evidence;
    if (!id(q.id) || !id(q.scenarioId) || !topic ||
      !Array.isArray(q.categories) || !q.categories.length || new Set(q.categories).size !== q.categories.length ||
      !q.categories.every(category => category === 'C' || category === 'D') ||
      !['topic', 'mock'].includes(q.use) || !present(q.question) ||
      !Array.isArray(q.options) || q.options.length < 3 || q.options.length > 4 ||
      !q.options.every(present) || new Set(q.options.map(normal)).size !== q.options.length ||
      !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length ||
      !present(q.explanation) || q.validationStatus !== 'source-checked' ||
      !source(e) || !date(e.checkedOn) || ![e.reviewer, e.rationale, e.scope].every(present)) {
      throw new Error(`Invalid question or evidence: ${q.id}`);
    }
    const specialist = topic.scope !== 'core';
    if (pending && e.independent) throw new Error(`Unexpected independent review in queue: ${q.id}`);
    if (!pending &&
      (!approval(e.independent, e.checkedOn, specialist) || normal(e.independent.reviewer) === normal(e.reviewer) ||
        (specialist && (!approval(topic.independent, topic.checkedOn, true) ||
          normal(topic.independent.reviewer) === normal(topic.reviewer))))) {
      throw new Error(`Independent review required: ${q.id}`);
    }
  }
  unique(questions, q => q.id, 'question ID');
  unique(questions, q => q.scenarioId, 'scenario ID');
  unique(questions, q => normal(q.question), 'question wording');
}

function checkPapers(papers, questionMap, topicMap, pending) {
  if (!Array.isArray(papers)) throw new Error('Missing papers list');
  const used = new Set();
  for (const paper of papers) {
    const format = Object.hasOwn(formats, paper.category) && formats[paper.category];
    if (!id(paper.id) || !present(paper.name) || !format ||
      !Array.isArray(paper.questionIds) || paper.questionIds.length !== format.count ||
      !date(paper.checkedOn) || !present(paper.reviewer) || !present(paper.coverage)) {
      throw new Error(`Invalid paper format or coverage review: ${paper.id}`);
    }
    const covered = new Set();
    for (const questionId of paper.questionIds) {
      const q = questionMap.get(questionId);
      if (!q || q.use !== 'mock' || topicMap.get(q.topic).scope === 'supplementary' ||
        (paper.category !== 'CD' && !q.categories.includes(paper.category)) ||
        paper.checkedOn < (pending ? q.evidence.checkedOn : q.evidence.independent.date) || used.has(questionId)) {
        throw new Error(`Unavailable, unreviewed, or repeated question in ${paper.id}: ${questionId}`);
      }
      q.categories.forEach(category => covered.add(category));
      used.add(questionId);
    }
    if (paper.category === 'CD' && covered.size !== 2) {
      throw new Error(`Combined paper must cover both categories: ${paper.id}`);
    }
  }
  unique(papers, paper => paper.id, 'paper ID');

  return papers.map(paper => ({
    ...paper,
    format: formats[paper.category],
    questions: paper.questionIds.map(questionId => questionMap.get(questionId)),
  }));
}

export function loadReviewQueue(topics, questions, papers = []) {
  const topicMap = checkTopics(topics);
  checkQuestions(questions, topicMap, true);
  const questionMap = new Map(questions.map(q => [q.id, q]));
  checkPapers(papers, questionMap, topicMap, true);
  return topicMap;
}

export function loadContent({ topics, questions, papers }) {
  if (![topics, questions, papers].every(Array.isArray)) throw new Error('Missing content lists');
  const topicMap = checkTopics(topics);
  checkQuestions(questions, topicMap, false);
  const questionMap = new Map(questions.map(q => [q.id, q]));
  return {
    topics,
    topicMap,
    practice: questions.filter(q => q.use === 'topic'),
    papers: checkPapers(papers, questionMap, topicMap, false),
  };
}

export function scoreSession(questions, answers, passMark = null) {
  const incorrect = questions.filter(q => answers.get(q.id) !== q.answer);
  const score = questions.length - incorrect.length;
  return {
    score,
    incorrect,
    pct: Math.round(score * 100 / questions.length),
    passed: passMark === null ? null : score >= passMark,
  };
}

export function secondsRemaining(deadline, now = Date.now()) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
