import { loadReviewQueue } from '../content.mjs';

const get = selector => document.querySelector(selector);
const questionPanel = get('#question');
const topicFilter = get('#topic');
const statusFilter = get('#status');
const storageKey = 'rr_independent_review';
let questions = [];
let topics;
let revisions;
let decisions = {};
let position = 0;

const esc = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const fetchJson = async url => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return response.json();
};

function decisionFor(q) {
  const decision = Object.hasOwn(decisions, q.id) && decisions[q.id];
  return decision?.revision === revisions.get(q.id) &&
    ['approved', 'changes'].includes(decision.status) ? decision : undefined;
}

function visible() {
  return questions.filter(q =>
    (!topicFilter.value || q.topic === topicFilter.value) &&
    (!statusFilter.value || (decisionFor(q)?.status ?? 'pending') === statusFilter.value));
}

function draw(focus = false) {
  const resolved = questions.filter(decisionFor);
  const approved = resolved.filter(q => decisionFor(q).status === 'approved').length;
  get('#count').textContent = `${approved} approved · ${resolved.length - approved} need changes · ${questions.length - resolved.length} pending`;

  const queue = visible();
  position = Math.min(position, Math.max(0, queue.length - 1));
  const q = queue[position];
  if (!q) {
    questionPanel.innerHTML = '<h2 tabindex="-1">No questions match these filters</h2>';
  } else {
    const decision = decisionFor(q);
    questionPanel.innerHTML = `
      <p class="meta">${position + 1} of ${queue.length} · ${esc(topics.get(q.topic).name)} · ${esc(q.categories.join(' / '))} · ${q.use === 'mock' ? 'Mock candidate' : 'Topic practice'}</p>
      <h2 tabindex="-1">${esc(q.question)}</h2>
      <form id="answer">
        <fieldset>
          <legend>Your answer</legend>
          ${q.options.map((option, index) => `
            <label><input type="radio" name="answer" value="${index}" required ${decision?.answer === index ? 'checked' : ''}> ${esc(option)}</label>
          `).join('')}
        </fieldset>
        <p><button>Show AI answer and source</button></p>
      </form>
      <div id="evidence"></div>
      <div class="controls">
        <button type="button" data-step="-1" ${position ? '' : 'disabled'}>Previous</button>
        <button type="button" data-step="1" ${position < queue.length - 1 ? '' : 'disabled'}>Next</button>
      </div>
      <p class="meta">Question ID ${esc(q.id)} · ${decision ? (decision.status === 'approved' ? 'Approved' : 'Needs changes') : 'Pending'}</p>`;
    get('#answer').addEventListener('submit', event => {
      event.preventDefault();
      const value = new FormData(event.target).get('answer');
      if (value !== null) reveal(q, Number(value), decision);
    });
  }
  if (focus) questionPanel.querySelector('h2').focus();
}

function reveal(q, answer, existing) {
  const e = q.evidence;
  const panel = get('#evidence');
  panel.innerHTML = `
    <div class="feedback" tabindex="-1">
      <h3>AI source review</h3>
      <p><strong>AI answer</strong> ${esc(q.options[q.answer])}</p>
      <p><strong>Your answer</strong> ${esc(q.options[answer])}</p>
      <p>${esc(q.explanation)}</p>
      ${e.rationale === q.explanation ? '' : `<p><strong>Rationale</strong> ${esc(e.rationale)}</p>`}
      <p><strong>Scope</strong> ${esc(e.scope)}</p>
      <p><a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.section)}</a> · checked ${esc(e.checkedOn)}</p>
      <form id="decision">
        <label for="review-note">Review note</label>
        <textarea id="review-note" name="note" rows="3">${esc(existing?.note ?? '')}</textarea>
        <p class="controls">
          <button class="primary" name="status" value="approved">Approve question</button>
          <button name="status" value="changes">Request changes</button>
        </p>
      </form>
    </div>`;
  panel.firstElementChild.focus();
  get('#decision').addEventListener('submit', event => {
    event.preventDefault();
    const status = event.submitter?.value;
    if (!['approved', 'changes'].includes(status)) return;
    const note = get('#review-note').value.trim();
    if (status === 'changes' && !note) {
      const input = get('#review-note');
      input.setCustomValidity('Describe what needs to change.');
      input.reportValidity();
      return;
    }
    decisions[q.id] = { revision: revisions.get(q.id), status, answer, note, reviewedOn: new Date().toISOString() };
    try {
      localStorage.setItem(storageKey, JSON.stringify(decisions));
    } catch {
      get('#message').textContent = 'Browser storage is unavailable. Download your review before leaving this page.';
    }
    if (!statusFilter.value || statusFilter.value === status) position += 1;
    draw(true);
  });
  get('#review-note').addEventListener('input', event => event.target.setCustomValidity(''));
}

questionPanel.addEventListener('click', event => {
  const step = event.target.closest('[data-step]');
  if (!step) return;
  position += Number(step.dataset.step);
  draw(true);
});

for (const filter of [topicFilter, statusFilter]) {
  filter.addEventListener('change', () => {
    position = 0;
    if (revisions) draw();
  });
}

get('#export').addEventListener('submit', event => {
  event.preventDefault();
  if (!revisions) return;
  const fields = new FormData(event.target);
  const reviewer = fields.get('reviewer').trim();
  const qualification = fields.get('qualification').trim();
  const reviewed = questions.filter(decisionFor).map(q => ({ id: q.id, ...decisionFor(q) }));
  if (!reviewer || !reviewed.length) {
    get('#message').textContent = 'Enter your name and record at least one decision before downloading.';
    return;
  }
  const data = JSON.stringify({ version: 1, reviewer, qualification, decisions: reviewed }, null, 2);
  const url = URL.createObjectURL(new Blob([data + '\n'], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'roadready-review.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  get('#message').textContent = `Downloaded ${reviewed.length} decisions.`;
});

try {
  const [bank, study] = await Promise.all([fetchJson('questions.json'), fetchJson('../data/study.json')]);
  topics = loadReviewQueue(study.topics, bank.questions, bank.papers);
  questions = bank.questions;
  const encoder = new TextEncoder();
  revisions = new Map(await Promise.all(questions.map(async q => {
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(JSON.stringify(q)));
    return [q.id, Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('')];
  })));
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) decisions = saved;
  } catch {
    get('#message').textContent = 'Saved decisions could not be loaded. Download your review before leaving this page.';
  }
  for (const [id, topic] of topics) {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = topic.name;
    topicFilter.append(option);
  }
  draw();
} catch {
  get('#count').textContent = 'The review queue could not be loaded. Open this page using localhost or an HTTPS preview.';
}
