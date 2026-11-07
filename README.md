# RoadReady Ireland — Irish truck & bus theory revision

A free static revision hub for Irish professional-driver theory study. No account or backend is required.

## Study content

The site includes 12 source-linked lessons and 25 original starter questions across five general road-safety topics. Each answer includes an explanation and a dated source reference. These questions received an editorial source check on 7 November 2026. Independent instructor review is pending.

The original 600 rows are archived in `data/questions.json`. The structural audit found 264 distinct scenario stems and 336 repeated rows. The app loads only `data/study.json`. Full-length mock exams remain paused while the replacement bank is written and independently reviewed.

See [CONTENT_AUDIT.md](CONTENT_AUDIT.md) and [TODO.md](TODO.md) for the evidence standard and remaining work.

## Official test formats checked 7 November 2026

| Theory route | Licence categories | Questions | Minutes | Pass mark |
|---|---|---:|---:|---:|
| Truck C | C, CE, C1, C1E | 100 | 120 | 74 |
| Bus D | D, DE, D1, D1E | 100 | 120 | 74 |
| Combined CD | Truck and bus | 140 | 180 | 104 |

The separate CPC case-study assessment has three scenarios with 15 questions each. It requires at least 5/15 in each scenario and 28/45 overall.

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

The Pages workflow validates content on pull requests and before deploying from `main`. It publishes the site files and the study bank. The quarantined archive and test fixtures are excluded. In Settings → Pages choose **GitHub Actions** as the source if required.

## Checks

Use Node.js 24 and run:

```sh
node --check app.js
node scripts/validate-content.mjs
node --test scripts/content.test.mjs
```

## Adding release content

Add questions to `data/study.json`. Use a stable unique ID and a distinct scenario ID. Set the supported categories (`C` and/or `D`) and choose `use: "topic"` or `use: "mock"`. Each question needs an exact source URL, section, check date, reviewer, rationale and scope. Add questions to this file only after checking the complete question and explanation against the source.

Specialist quizzes require an independent review record on the lesson and the question. Every mock question also requires an independent review record. Record the reviewer, their qualification and review date. The paper entry lists its ordered question IDs, category and a documented coverage review. Mocks draw only from their explicit question lists and may never share questions.

The validator checks the evidence structure, IDs, options, answer indices, independent review records and paper composition. Editorial and qualified reviewers must still check the sources, wording, topic balance and semantic originality.
