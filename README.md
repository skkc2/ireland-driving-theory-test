# RoadReady Ireland — Irish truck & bus theory revision

A free static revision hub for Irish professional-driver theory study. No account or backend is required.

## Study content

The site includes 12 source-linked lessons. The candidate bank in `review/questions.json` contains 100 topic questions and 112 mock candidates. Each has an AI editorial source check dated 7 November 2026. Independent review is pending for all 212. The first Category C mock has 100 allocated candidates covering ten topics. Practice and mocks stay paused until the relevant questions are independently approved.

The original 600 rows are archived in `data/questions.json`. The structural audit found 264 distinct scenario stems and 336 repeated rows. The public app loads only `data/study.json`. The review queue is separate from both files.

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

The Pages workflow validates content on pull requests and before deploying from `main`. It publishes the site files and the study bank. The quarantined archive, review page, candidate bank and test fixtures are excluded. In Settings → Pages choose **GitHub Actions** as the source if required.

## Checks

Use Node.js 24 and run:

```sh
node --check app.js
node scripts/validate-content.mjs
node --test scripts/content.test.mjs
```

## Independent review

1. Start `python3 -m http.server 8000` in the repository root and open [the local review page](http://localhost:8000/review/). To review after signing into GitHub, open the PR branch in a Codespace, run the same command there, open forwarded port 8000 with **Private** visibility and add `/review/` to that preview URL. See [GitHub’s port forwarding guide](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace).
2. Choose your own answer before revealing the AI answer, then check the linked source, explanation, scope and other options. Approve the question or leave a specific change request. The page saves progress in this browser.
3. Export your decisions with your reviewer name and any relevant qualification. Each decision includes the question’s SHA-256 revision. Match the revision to the exact candidate before accepting a review. Edited questions require another independent check.

The review page records decisions. The release bank is updated separately after review.

## Adding release content

Add source-checked candidates to `review/questions.json` with a stable unique ID, a distinct scenario ID, supported categories (`C` and/or `D`), and an intended use (`topic` or `mock`). Candidate papers list their question IDs, category and coverage review in the same file. Evidence includes an exact source URL, section, check date, AI reviewer, rationale and scope.

Move approved candidates to `data/study.json` only after checking the review export against their exact revision. Record the independent reviewer and review date on every released question. Specialist questions require a relevant qualification and independent sign-off on the associated lesson. Give each mock an explicit list of question IDs, category and documented coverage review. Mock papers may never share questions.

The validator checks the evidence structure, IDs, options, answer indices, independent review records and paper composition. Editorial and independent reviewers still need to check the sources, wording, topic balance and semantic originality.
