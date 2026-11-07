# RoadReady Ireland — Irish truck & bus theory revision

A free static revision hub for Irish professional-driver theory study. No account or backend is required.

## Honest content status — 7 November 2026

**The practice-question bank is quarantined and must not be used as exam-quality preparation.** The JSON contains 600 draft rows, but the prior structural audit found only 264 distinct underlying scenario stems (22 per topic) and 336 repeated scenario rows. None of the questions has completed an individual legal/source check or independent instructor review.

The website therefore keeps mock exams and topic quizzes disabled. The 600-row count is a count of draft records, not a claim of 600 original or validated questions. Topic summaries are also draft learning prompts, not authoritative legal advice.

See [CONTENT_AUDIT.md](CONTENT_AUDIT.md) for the findings and validation standard.

## Official test format checked 7 November 2026

- **Category C or D:** 100 multiple-choice questions, 120 minutes, pass mark 74.
- **Combined C+D:** 140 questions, 180 minutes, pass mark 104.
- The CPC case-study assessment is separate: three scenarios with 15 questions each, at least 5/15 in each scenario and 28/45 overall.

C1, C1E and CE are licence categories; do not treat them as separate theory-test formats without checking the current RSA booking guidance. The truck theory route is category C; bus is D.

## Official study links

- [RSA professional-driver theory test](https://www.rsa.ie/services/professional-drivers/cpc/become-a-professional-cpc-driver/2.-theory-test)
- [Driver Theory Test Service FAQs](https://theorytest.ie/general-information/faqs/)
- [RSA Rules of the Road](https://www.rsa.ie/services/learner-drivers/resources/rules-of-the-road)
- [RSA CPC case-study test](https://www.rsa.ie/services/professional-drivers/cpc/become-a-professional-cpc-driver/3.-case-study-test)
- [EU Regulation 561/2006 — drivers’ hours](https://eur-lex.europa.eu/eli/reg/2006/561/2024-12-31/eng/)
- [HSA ADR driver training](https://www.hsa.ie/your_industry/adr_-_carriage_of_dangerous_goods_by_road/adr_general_information/adr_driver_training/)

Use the latest official RSA study material as the authority. This independent site is not affiliated with RSA or Prometric and does not reproduce official copyrighted questions.

## Run locally

Run `python3 -m http.server 8000` from the repository root and open http://localhost:8000.

## GitHub Pages

The workflow `.github/workflows/pages.yml` deploys the repository root on pushes to `main`. In Settings → Pages choose **GitHub Actions** as the source if required.

## Release gate for question content

A question must not be marked validated or exposed in a quiz until its exact proposition, answer and explanation have been checked against a current authoritative source. Store, at minimum:

- a precise source URL and article/section/page;
- date checked and reviewer;
- rationale for the correct answer and any relevant exceptions;
- a distinct scenario identifier to detect semantic duplicates.

Remove ambiguous, out-of-syllabus and unsupported questions. Specialist tachograph, vehicle, bus and ADR material requires appropriately qualified review. Do not copy RSA copyrighted practice questions.

## Current data

`data/questions.json` currently contains 600 draft question records. Every record remains `validationStatus: "unverified"`; do not use this bank for mock exam scoring.
