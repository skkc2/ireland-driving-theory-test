# Question bank audit — 7 November 2026

## Finding for the archived question bank

The bank is **not validated**. Do not describe it as 600 validated or 600 independently written questions.

A structural review of `data/questions.json` found 600 records across 12 topics. The question generator cycles a much smaller set of scenario facts and changes the prompt wrapper. Normalising those wrappers gives 22 distinct scenario stems per topic: **264 distinct stems in total and 336 repeated scenario rows**. Different IDs and superficial prompt wording do not make repeated underlying scenarios independent questions.

The JSON contains no per-question evidence record. Every row is marked `validationStatus: "unverified"`. No independent Irish instructor review has been completed.

## Safety action

- Keep all existing question rows quarantined as draft data.
- Require independent review for every released question. Keep the archived rows out of all practice.
- Do not display a question count as a count of original or validated questions.
- Do not award pass/fail results from this bank.
- Use the official resources linked on the site for study until replacement questions are properly reviewed.

## Two-stage review

`review/questions.json` holds 100 original topic questions and 50 mock candidates, including the 25 starter questions from the initial PR. Codex checked their answers and explanations against the cited sources on 7 November 2026. Each question has a specific source, scope and rationale. No independent decisions have been recorded.

The review page supports answer-first checks and exports decisions tied to the exact version reviewed. The public bank in `data/study.json` holds the 12 study lessons and zero released questions or mock papers. GitHub Pages excludes the candidate bank.

The app and CI use the same validator. It can check the format and completeness of evidence and catch repeated IDs or exact question wording. Humans still need to detect semantic duplicates, judge distractors and check legal accuracy and syllabus coverage.

## Official facts checked

1. The RSA professional-driver page states that the individual C and D theory tests contain 100 multiple-choice questions and require 74 correct; the combined C+D test contains 140 and requires 104 correct. It lists Rules of the Road, risk perception, eco-driving, hazard awareness and safe driving behaviour among the subject areas.
2. The official test provider FAQ specifies time limits: C or D = 120 minutes; combined CD = 180 minutes.
3. The RSA CPC case-study test is separate: three real-life situations, 15 questions per situation, at least 5/15 in each and 28/45 overall.
4. EU Regulation 561/2006 supplies the standard driving-time and break framework, subject to scope, exceptions and special provisions.
5. HSA ADR guidance confirms driver training/certification requirements and exemptions are class- and operation-specific. Avoid blanket claims such as “every dangerous-goods load requires an ADR card”.

## Source register

- RSA, [Professional driver theory test](https://www.rsa.ie/services/professional-drivers/cpc/become-a-professional-cpc-driver/2.-theory-test) — C, D and combined CD question counts/pass marks and subject areas.
- Driver Theory Test Service, [Theory Test FAQs](https://theorytest.ie/general-information/faqs/) — test durations and format.
- RSA, [CPC case-study test](https://www.rsa.ie/services/professional-drivers/cpc/become-a-professional-cpc-driver/3.-case-study-test) — separate CPC case-study format.
- RSA, [Rules of the Road](https://www.rsa.ie/services/learner-drivers/resources/rules-of-the-road) — Irish road rules; check the latest edition.
- EUR-Lex, [Regulation (EC) No 561/2006, consolidated text](https://eur-lex.europa.eu/eli/reg/2006/561/2024-12-31/eng/) — drivers’ hours, breaks and rest.
- HSA, [ADR driver training](https://www.hsa.ie/your_industry/adr_-_carriage_of_dangerous_goods_by_road/adr_general_information/adr_driver_training/) — Irish ADR certification, scope and exemptions.

## Scope corrections

The RSA identifies the theory-test formats as C, D and combined C+D. The test provider maps C, CE, C1 and C1E to theory category C and D, DE, D1 and D1E to theory category D. Dangerous goods is specialist ADR content and should be labelled supplementary unless the official test syllabus confirms its inclusion. CPC case-study preparation is a separate module.

## Required validation record

A question can be marked validated only when its exact proposition, answer and explanation have been checked against a current, specific authoritative source. Each record must include a source URL plus section/page/article, date checked, reviewer, rationale and relevant qualifications/exceptions. Remove questions that cannot be grounded or depend on unspecified facts. Semantic duplicates must not be counted as separate questions.

## Next release acceptance criteria

- 500 distinct, source-checked questions for five 100-question C/D mock papers, with no overlap between papers.
- Correct topic and category coverage, three or four plausible options, one defensible answer and a concise explanation per question.
- A source/evidence record for every question and qualified review for specialist material.
- Automated checks for schema, unique IDs, duplicate scenario IDs, answer indices, option counts, and paper size.
- Five timed papers must use the verified official time and pass mark for their actual category. A combined CD paper must use 140 questions, 180 minutes and 104 correct.
