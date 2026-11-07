import { formats, loadContent, scoreSession, secondsRemaining } from './content.mjs';

const app = document.querySelector('#app');
const navigation = document.querySelector('nav');
const rsa = 'https://www.rsa.ie/services/professional-drivers/cpc/become-a-professional-cpc-driver';
const theoryFaq = 'https://theorytest.ie/general-information/faqs/';
const rules = 'https://www.rsa.ie/services/learner-drivers/resources/rules-of-the-road';
const historyKey = 'rr_history';
const scopes = {
  core: 'Core theory study',
  professional: 'Professional-driver guidance',
  supplementary: 'Supplementary study',
};
let content;
let session;

const esc = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const link = (url, label) => `<a href="${esc(url)}">${esc(label)}</a>`;
const button = (label, action, value = '', className = '') =>
  `<button type="button" class="${className}" data-action="${action}" data-value="${esc(value)}">${esc(label)}</button>`;
const head = (label, title, intro) => `
  <div class="pagehead">
    <small>${esc(label)}</small><h1 tabindex="-1">${esc(title)}</h1><p>${esc(intro)}</p>
  </div>`;

function render(markup, focus = 'h1') {
  app.innerHTML = markup;
  app.querySelector(focus)?.focus();
}

function formatTable() {
  return `
    <table>
      <caption>Official multiple-choice test formats</caption>
      <thead><tr><th scope="col">Category</th><th scope="col">Questions</th><th scope="col">Minutes</th><th scope="col">Pass mark</th></tr></thead>
      <tbody>${Object.values(formats).map(f => `
        <tr><th scope="row">${f.name}</th><td>${f.count}</td><td>${f.minutes}</td><td>${f.pass}/${f.count}</td></tr>
      `).join('')}</tbody>
    </table>`;
}

function home(focus) {
  render(`
    <section class="hero">
      <small>IRISH HEAVY VEHICLE THEORY REVISION</small>
      <h1 tabindex="-1">Prepare for truck and bus theory</h1>
      <p>Study Irish road rules and professional-driver topics, then practise with short quizzes that explain each answer.</p>
      ${button('Learn by topic', 'view', 'learn', 'primary')}
    </section>
    <section class="card">
      <h2>Study content status</h2>
      <p>${content.topics.length} source-linked lessons and ${content.practice.length} source-checked starter questions. Full-length mock papers require independent review before release.</p>
      <p>Use the latest ${link(rules, 'RSA Rules of the Road')} alongside your revision.</p>
    </section>
    <section class="card">
      <h2>Choose your theory route</h2>
      ${formatTable()}
      <p>The C theory route covers C, CE, C1 and C1E. The D route covers D, DE, D1 and D1E. Check the provider’s booking guidance for your circumstances.</p>
      <p>${link(rsa + '/2.-theory-test', 'RSA professional-driver theory test')} · ${link(theoryFaq, 'Driver Theory Test Service FAQs')}</p>
    </section>
    <section class="card">
      <h2>Driver CPC case studies</h2>
      <p>Prepare for this assessment separately. The RSA sets three scenarios with 15 questions each. You need at least 5/15 in every scenario and 28/45 overall.</p>
      <p>${link(rsa + '/3.-case-study-test', 'RSA case-study test guidance')}</p>
    </section>`, focus ? 'h1' : 'main');
}

function mocks() {
  const papers = content.papers.map(({ id, name, format }) => `
    <article class="card">
      <h2>${esc(name)}</h2>
      <p>${format.name} · ${format.count} questions · ${format.minutes} minutes · ${format.pass} correct to pass</p>
      ${button('View mock instructions', 'paper', id)}
    </article>`).join('');
  render(head('TIMED PRACTICE', 'Mock exams', 'Independent practice papers for the Irish truck and bus theory tests.') +
    (papers || '<div class="notice">Full-length mock exams are paused while the question bank is rebuilt and independently reviewed.</div>') +
    formatTable() + `<p>${link(theoryFaq, 'Check the official test format')}</p>`);
}

function topicList() {
  render(head('LEARN AND REVISE', 'Study by topic', 'Read a lesson, open its sources and try a starter quiz where available.') +
    `<div class="cards">${content.topics.map(topic => {
      const count = content.practice.filter(q => q.topic === topic.id).length;
      return `<article class="card">
        <div class="meta">${scopes[topic.scope]}</div>
        <h2>${esc(topic.name)}</h2><p>${esc(topic.summary)}</p>
        <p>${count ? `${count} practice questions` : 'Lesson and reference links'}</p>
        ${button('Open lesson', 'topic', topic.id)}
      </article>`;
    }).join('')}</div>`);
}

function topicPage(id) {
  const topic = content.topicMap.get(id);
  if (!topic) return;
  const count = content.practice.filter(q => q.topic === id).length;
  render(head(scopes[topic.scope], topic.name, topic.summary) + `
    <article class="card">
      <h2>Study notes</h2>
      ${topic.lesson.map(text => `<p>${esc(text)}</p>`).join('')}
      <h2>Sources</h2>
      <ul>${topic.sources.map(s => `<li>${link(s.url, s.section)}</li>`).join('')}</ul>
      <p>Last source check <time datetime="${topic.checkedOn}">${topic.checkedOn}</time>.</p>
      ${topic.scope === 'core' ? '' : '<p>Use the linked guidance and your operator’s current procedures. Quiz questions for this topic require specialist review.</p>'}
    </article>
    <p class="controls">
      ${count ? button(`Start practice (${count} questions)`, 'practice', id, 'primary') : ''}
      ${button('Back to topics', 'view', 'learn')}
    </p>`);
}

function paperPage(id) {
  const paper = content.papers.find(p => p.id === id);
  if (!paper) return;
  const { count, minutes, pass } = paper.format;
  render(head('MOCK EXAM INSTRUCTIONS', paper.name, `${count} questions · ${minutes} minutes · ${pass} correct to pass`) + `
    <div class="card">
      <p>Choose one answer per question. Use the question grid to skip or revisit questions and flag anything you want to check. You can change your choices until you submit.</p>
      <p>The timer starts when you select Start mock. If time runs out, your answers are submitted automatically.</p>
      ${button('Start mock', 'start-paper', id, 'primary')}
      ${button('Back to mocks', 'view', 'mock')}
    </div>`);
}

function readHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(historyKey));
    return Array.isArray(history) ? history.filter(item => item && typeof item.name === 'string' &&
      [item.score, item.total, item.pct].every(Number.isFinite) && Number.isFinite(Date.parse(item.date))) : [];
  } catch {
    return [];
  }
}

function progress() {
  const history = readHistory();
  render(head('YOUR ACTIVITY', 'My progress', 'Results are stored in this browser when local storage is available.') + `
    <div class="card">
      <h2>${history.length} completed practices</h2>
      ${history.length ? history.slice(-20).reverse().map(item =>
        `<p class="review">${esc(item.name)} · <strong>${item.score}/${item.total} (${item.pct}%)</strong> · ${new Date(item.date).toLocaleDateString('en-IE')}</p>`
      ).join('') : '<p>Completed practice will appear here.</p>'}
    </div>`);
}

function page(view, focus = true) {
  for (const tab of navigation.querySelectorAll('button')) {
    if (tab.dataset.value === view) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
  if (view === 'home') home(focus);
  if (view === 'learn') topicList();
  if (view === 'mock') mocks();
  if (view === 'progress') progress();
}

function start({ name, questions, format, returnAction, returnId }) {
  if (session || !questions.length) return;
  session = {
    name, questions, format, returnAction, returnId, index: 0,
    answers: new Map(), flags: new Set(),
    deadline: format ? Date.now() + format.minutes * 60_000 : null,
  };
  drawQuestion();
  if (format) session.timer = setInterval(checkClock, 250);
}

function stop() {
  clearInterval(session?.timer);
  session = null;
}

function timeLabel(seconds) {
  return [Math.floor(seconds / 60), seconds % 60].map(value => String(value).padStart(2, '0')).join(':');
}

function checkClock() {
  if (!session?.format) return false;
  const left = secondsRemaining(session.deadline);
  if (!left) {
    finish(true);
    return true;
  }
  const timer = app.querySelector('#timer');
  timer.textContent = timeLabel(left);
  timer.closest('.timer').classList.toggle('warn', left < 300);
  return false;
}

function evidence(q) {
  return `${link(q.evidence.url, q.evidence.section)} · checked ${q.evidence.checkedOn}`;
}

function drawQuestion(focus = 'h1') {
  const { name, questions, format, deadline, answers, flags, index } = session;
  const q = questions[index];
  const selected = answers.get(q.id);
  const locked = !format && selected !== undefined;
  const remaining = deadline ? secondsRemaining(deadline) : 0;
  render(`
    <div class="bar">
      <p><strong>${esc(name)}</strong> · ${format ? 'Timed mock' : 'Untimed practice'}</p>
      ${format ? `<div class="timer${remaining < 300 ? ' warn' : ''}">Time left <span id="timer" role="timer">${timeLabel(remaining)}</span></div>` : ''}
    </div>
    <p class="meta">Question ${index + 1} of ${questions.length} · ${esc(content.topicMap.get(q.topic).name)}</p>
    <section class="question">
      <h1 tabindex="-1">${esc(q.question)}</h1>
      <div class="answers">${q.options.map((option, i) => `
        <button type="button" class="answer${selected === i ? ' sel' : ''}" data-action="answer" data-value="${i}"
          aria-pressed="${selected === i}" ${locked ? 'aria-disabled="true"' : ''}>${'ABCD'[i]}. ${esc(option)}</button>`).join('')}
      </div>
      ${locked ? `<div class="feedback" tabindex="-1">
        <strong>${selected === q.answer ? 'Correct.' : 'Correct answer: ' + esc(q.options[q.answer])}</strong>
        <p>${esc(q.explanation)}</p><p>${evidence(q)}</p>
      </div>` : ''}
      <div class="bar">
        <button type="button" data-action="flag" aria-pressed="${flags.has(q.id)}">Flag for review</button>
        <div class="controls">
          <button type="button" data-action="previous" ${index ? '' : 'disabled'}>Previous</button>
          ${index + 1 < questions.length ? button('Next', 'next', '', 'primary') : ''}
          ${button('Review and submit', 'review', '', index + 1 === questions.length ? 'primary' : '')}
        </div>
      </div>
    </section>
    <div class="dots" role="group" aria-label="Question navigation">${questions.map((item, i) => `
      <button type="button" class="dot${i === index ? ' sel' : ''}${answers.has(item.id) ? ' done' : ''}${flags.has(item.id) ? ' flag' : ''}"
        data-action="jump" data-value="${i}" ${i === index ? 'aria-current="step"' : ''}
        aria-label="Question ${i + 1}, ${answers.has(item.id) ? 'answered' : 'unanswered'}${flags.has(item.id) ? ', flagged' : ''}">${i + 1}</button>`).join('')}</div>
    <p class="muted">${answers.size} answered · ${questions.length - answers.size} unanswered · ${flags.size} flagged</p>`, focus);
}

function reviewSession() {
  const { questions, format, deadline, answers, flags } = session;
  const remaining = deadline ? secondsRemaining(deadline) : 0;
  render(head('BEFORE SUBMISSION', 'Review your answers',
    `${answers.size} answered · ${questions.length - answers.size} unanswered · ${flags.size} flagged`) +
    `${format ? `<p class="timer${remaining < 300 ? ' warn' : ''}">Time left <span id="timer" role="timer">${timeLabel(remaining)}</span></p>` : ''}
    <ol class="review-list">${questions.map((q, index) => `
      <li>${button(`Question ${index + 1} · ${answers.has(q.id) ? 'Answered' : 'Unanswered'}${flags.has(q.id) ? ' · Flagged' : ''}`, 'jump', index)}</li>
    `).join('')}</ol>
    <p class="controls">${button('Return to question', 'return-question')} ${button('Submit answers', 'submit', '', 'primary')}</p>`);
}

function finish(timeout = false) {
  const { name, questions, format, answers, returnAction, returnId } = session;
  stop();
  const result = scoreSession(questions, answers, format?.pass);
  const { score, pct, passed, incorrect } = result;
  const history = readHistory();
  let saved = true;
  try {
    localStorage.setItem(historyKey, JSON.stringify([...history, { name, score, total: questions.length, pct, date: new Date().toISOString() }]));
  } catch {
    saved = false;
  }
  render(head('RESULTS', name, timeout ? 'Time expired. Your answers were submitted automatically.' : 'Your answers have been submitted.') + `
    <div class="card">
      <div class="score">${score} / ${questions.length}</div>
      <p>${pct}%${format ? ` · ${passed ? 'Mock pass standard reached' : 'Below mock pass standard'} · Pass mark ${format.pass}/${questions.length}` : ''}</p>
      ${saved ? '' : '<p>Browser storage is unavailable. This result could not be saved.</p>'}
      ${button(format ? 'More mock exams' : 'Back to lesson', returnAction, returnId)}
      ${button('My progress', 'view', 'progress')}
    </div>
    <h2>Incorrect and unanswered questions (${incorrect.length})</h2>
    ${incorrect.length ? incorrect.map(q => `<article class="review">
      <h3>${esc(q.question)}</h3>
      <p>Your answer: ${answers.has(q.id) ? esc(q.options[answers.get(q.id)]) : 'Unanswered'}</p>
      <p>Correct answer: <strong>${esc(q.options[q.answer])}</strong></p>
      <p>${esc(q.explanation)}</p><p>${evidence(q)}</p>
    </article>`).join('') : '<p>You answered every question correctly.</p>'}`);
}

document.addEventListener('click', event => {
  const control = event.target.closest('button[data-action]');
  if (!control || !content) return;
  const { action, value } = control.dataset;
  if (session && checkClock()) return;

  if (action === 'view') {
    if (session && !window.confirm('Leave this practice? Your current answers will be discarded.')) return;
    stop();
    page(value);
    return;
  }
  if (!session) {
    if (action === 'topic') topicPage(value);
    if (action === 'paper') paperPage(value);
    if (action === 'practice' && content.topicMap.has(value)) {
      start({ name: content.topicMap.get(value).name, questions: content.practice.filter(q => q.topic === value),
        returnAction: 'topic', returnId: value });
    }
    if (action === 'start-paper') {
      const paper = content.papers.find(p => p.id === value);
      if (paper) start({ ...paper, returnAction: 'view', returnId: 'mock' });
    }
    return;
  }

  const { answers, flags, questions, index, format } = session;
  const q = questions[index];
  switch (action) {
    case 'answer': {
      if (!format && answers.has(q.id)) return;
      const answer = Number(value);
      if (!Number.isInteger(answer) || answer < 0 || answer >= q.options.length) return;
      answers.set(q.id, answer);
      drawQuestion(format ? `[data-action="answer"][data-value="${answer}"]` : '.feedback');
      break;
    }
    case 'flag':
      if (flags.has(q.id)) flags.delete(q.id);
      else flags.add(q.id);
      drawQuestion('[data-action="flag"]');
      break;
    case 'previous':
      session.index = Math.max(0, index - 1);
      drawQuestion();
      break;
    case 'next':
      session.index = Math.min(questions.length - 1, index + 1);
      drawQuestion();
      break;
    case 'jump': {
      const target = Number(value);
      if (!Number.isInteger(target) || target < 0 || target >= questions.length) return;
      session.index = target;
      drawQuestion();
      break;
    }
    case 'return-question':
      drawQuestion();
      break;
    case 'review':
      reviewSession();
      break;
    case 'submit':
      finish();
      break;
  }
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) checkClock();
});

fetch('data/study.json')
  .then(response => {
    if (!response.ok) throw new Error('Study data could not be loaded');
    return response.json();
  })
  .then(data => {
    content = loadContent(data);
    page('home', false);
  })
  .catch(() => {
    render(head('ROADREADY IRELAND', 'Study content unavailable',
      'Reload the page to try again. You can use the RSA study materials in the meantime.') +
      `<p>${link(rules, 'Open the RSA Rules of the Road')}</p>`);
  });
