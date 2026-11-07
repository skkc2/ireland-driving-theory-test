# RoadReady Ireland — project to-do list

Last updated: 7 November 2026

This file tracks what has been completed and what remains for the Irish truck and bus theory revision website. It is the working checklist for the project.

## Project goal

Build a free, reliable study website for Irish professional-driver theory preparation, covering the relevant truck and bus categories (C and D, with clear guidance for C1/CE/C1E). The site should provide topic learning material, substantial quizzes and five genuinely useful full-length mock exams.

**Quality rule:** never describe a question as validated unless its answer and explanation have been checked against a current authoritative source and the evidence is recorded. Do not copy RSA copyrighted questions.

## Completed so far

- [x] Created the static website structure using HTML, CSS and JavaScript.
- [x] Added a JSON question bank at `data/questions.json`.
- [x] Added 12 draft learning topics.
- [x] Added a structural audit of the existing question bank.
- [x] Identified that the 600 existing rows are not 600 independent questions: the audit found 264 underlying scenario stems and 336 repeated scenario rows.
- [x] Marked the existing questions as unverified rather than claiming they are legally correct.
- [x] Paused mock exams and topic quizzes in the website so unverified content is not presented as exam-quality practice.
- [x] Added an honest content warning and official study links to the home page.
- [x] Corrected the README and content audit to explain the current status and validation requirements.
- [x] Checked the published exam format against RSA and Driver Theory Test Service information:
  - Category C or D: 100 questions, 120 minutes, pass mark 74.
  - Combined C+D: 140 questions, 180 minutes, pass mark 104.
  - CPC case-study assessment is separate from the multiple-choice theory test.
- [x] Added source references for RSA professional-driver test information, the test provider FAQs, RSA Rules of the Road, EU drivers’ hours rules and HSA ADR guidance.
- [x] Confirmed that the GitHub Pages Actions deployment for commit `9b36ba46ef8c9434de43fb636370d11b0cd35cf0` completed successfully.

## This update

- [x] Confirmed the C and D licence category mappings with the official test provider.
- [x] Separated CPC case-study guidance from the multiple-choice exam formats.
- [x] Added 12 source-linked lessons. The site distinguishes core road-safety study, professional-driver guidance and supplementary ADR study. These labels do not represent an official test blueprint.
- [x] Built the starter quiz interface with immediate feedback and a review of incorrect and unanswered questions.
- [x] Prepared 100 topic questions and 50 mock candidates with an AI source check.
- [x] Added the independent review page with answer-first review, change requests and versioned export.
- [x] Added a shared content gate and a timed mock interface with instructions, question navigation, flagging, submission review and raw-mark scoring.
- [x] Added automated checks and a Pages publishing step that excludes the archived draft bank.

## Remaining work

### 1. Agree the exam coverage

- [ ] Confirm the proposed first release of three C and two D papers. Keep the combined CD format as a reference until there is a separate 140-question bank and a reviewed coverage plan.
- [ ] Identify which topics are confirmed core syllabus and which are supplementary (for example, specialist ADR content).

### 2. Rebuild the question bank properly

- [ ] Review the existing 600 draft rows; do not simply reword them or reuse them as new questions.
- [ ] Remove semantic duplicates and unsupported, ambiguous or out-of-scope questions.
- [ ] Write original questions in a clear Irish heavy-vehicle context.
- [ ] Build a target bank of 600 distinct, individually checked questions:
  - [ ] Write and check 450 more mock candidates, then allocate 500 reviewed questions across five 100-question papers.
  - [x] Write and AI source-check 100 topic questions. Independent review remains open.
- [ ] Ensure there is no question overlap between the five mock papers.
- [ ] Give every question 3–4 plausible options, one defensible correct answer and a concise explanation.
- [ ] Vary correct-answer positions; avoid patterns that reveal the answer.
- [ ] Include realistic truck and bus scenarios where appropriate, without forcing irrelevant category content into every paper.

### 3. Validate every question

For every question, record:

- [ ] Exact authoritative source URL.
- [ ] Specific article, regulation, section, page or RSA guidance heading.
- [ ] Date the source was checked.
- [ ] Correct-answer rationale.
- [ ] Relevant scope limits, exceptions or qualifications.
- [ ] Review status and reviewer.

Additional checks:

- [ ] Check Irish road rules against the latest RSA Rules of the Road and applicable legislation.
- [ ] Check vehicle weights, dimensions, defects, loads and coupling material against applicable Irish/EU requirements.
- [ ] Check drivers’ hours and tachograph material against current EU rules, including scope and exemptions.
- [ ] Check bus passenger safety and accessibility material against applicable guidance and law.
- [ ] Keep ADR questions supplementary unless their relevance to the target test syllabus is confirmed; have specialist content reviewed by a qualified person.
- [ ] Record the repository owner’s independent review after the AI pass. Record relevant qualifications for specialist questions and lesson sign-off.
- [ ] Never mark a question validated solely because its wording sounds plausible or an automated check passes.

### 4. Build and verify the five mock exams

- [ ] Each individual C or D mock has exactly 100 questions.
- [ ] Each individual mock uses the correct 120-minute time limit and 74/100 pass mark.
- [ ] If a combined CD mock is included, it has exactly 140 questions, 180 minutes and a 104/140 pass mark.
- [ ] Confirm the five papers have balanced and appropriate topic coverage.
- [ ] Confirm no repeated underlying scenario across papers.
- [x] Include clear instructions, a timer, answer navigation and a review screen.
- [ ] Ensure results and explanations are accurate and do not imply official RSA endorsement.

### 5. Complete the learning and quiz sections

- [x] Expand the 12 draft topic notes into source-linked lessons.
- [ ] Have a qualified reviewer check the professional-driver and supplementary lessons before releasing quizzes for them.
- [ ] Add substantial topic quizzes using only validated questions.
- [x] Provide explanations after answers and a review of incorrect answers.
- [x] Label supplementary ADR study.

### 6. Automated checks and site testing

- [x] Check JSON structure, unique IDs, option counts, answer indices, source/evidence fields and paper size, category and overlap.
- [x] Reject repeated scenario IDs and exact question wording.
- [ ] Review semantic duplicates that have different scenario IDs.
- [ ] Test timers, navigation, flagging, scoring, pass marks and answer review.
- [ ] Test the website on mobile and desktop.
- [ ] Check accessibility, keyboard navigation, contrast and readable text.
- [ ] Check browser console and network loading for errors.
- [ ] Confirm GitHub Actions deployment succeeds after each release.

### 7. Release

- [x] Keep the archived questions out of quizzes and mocks. Require independent review for every released question.
- [x] Record the starter bank and editorial review in the audit, README and on-site content status.
- [ ] Add independent reviewer details as reviews are completed.
- [ ] Re-enable only the sections that have passed review.
- [ ] Check the deployed GitHub Pages site after release.
- [x] Add a visible source-check date to lessons and link to the current RSA materials.

## Current status snapshot

| Area | Status |
|---|---|
| Static website | Built |
| Learning material | 12 source-linked lessons |
| Existing question rows | 600 draft rows; not validated |
| Distinct scenario stems in current bank | 264 found by structural audit |
| AI source-check queue | 100 topic questions and 50 mock candidates |
| Independent instructor review | Not completed |
| Mock exams | Paused |
| Topic quizzes | Paused until independent review |
| Official test-format facts | Checked against public RSA/provider sources |
| GitHub Pages deployment | Verify deployment after the update merges |

## Key project files

- `index.html` — site structure
- `app.js` — site behaviour and quiz interface
- `styles.css` — styling
- `data/questions.json` — current draft question bank
- `CONTENT_AUDIT.md` — audit findings and validation standard
- `README.md` — project overview and setup
- `TODO.md` — this project checklist

## Official reference links

- [RSA professional-driver theory test](https://www.rsa.ie/services/professional-drivers/cpc/become-a-professional-cpc-driver/2.-theory-test)
- [Driver Theory Test Service FAQs](https://theorytest.ie/general-information/faqs/)
- [RSA Rules of the Road](https://www.rsa.ie/services/learner-drivers/resources/rules-of-the-road)
- [RSA CPC case-study test](https://www.rsa.ie/services/professional-drivers/cpc/become-a-professional-cpc-driver/3.-case-study-test)
- [EU Regulation 561/2006 — drivers’ hours](https://eur-lex.europa.eu/eli/reg/2006/561/2024-12-31/eng/)
- [HSA ADR driver training](https://www.hsa.ie/your_industry/adr_-_carriage_of_dangerous_goods_by_road/adr_general_information/adr_driver_training/)
