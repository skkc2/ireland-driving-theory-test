# RoadReady Ireland — Irish truck & bus theory revision

Static HTML/CSS/JavaScript site. No backend or account is required.

## Current content status — IMPORTANT
**The current question bank is unverified and must not be treated as authoritative exam preparation.** On 7 November 2026 an initial structural audit found:
- 600 question records in `data/questions.json`.
- Only 264 distinct underlying scenario stems (22 per topic); 336 rows repeat those scenarios with alternative prompt wording.
- No question-by-question legal/source validation or independent instructor review has been completed.

For safety and transparency, full mock exams and topic quizzes are temporarily paused in the interface. Draft topic notes remain visible. Do not use the draft content as your sole preparation. The official RSA-approved revision materials are the authoritative study resource.

See [CONTENT_AUDIT.md](CONTENT_AUDIT.md) for the audit, verified exam-format facts and source register.

## Official exam format checked 7 November 2026
The current official provider FAQ states:
- Category C or D: 100 questions, 120 minutes, pass mark 74.
- Combined C+D: 140 questions, 180 minutes, pass mark 104.

C1/C1E/CE are truck licensing categories and the relevant truck theory route is the C test; D is the bus test. Check the exact test category when booking. The Driver CPC case-study test is a separate assessment and is not included in this website's current mock functionality.

## Run locally
Run `python3 -m http.server 8000` from the repository root and open http://localhost:8000.

## GitHub Pages
The workflow `.github/workflows/pages.yml` deploys the repository root on pushes to `main`. In Settings → Pages choose **GitHub Actions** as the source if required.

## Editing the question bank
Questions are stored in `data/questions.json`. Each question currently has `id`, `topic`, `question`, `options`, zero-based `answer`, `explanation` and `validationStatus`.

Do not change `validationStatus` to `validated` without a question-specific evidence record containing the exact legal/RSA source, section or page, date checked, rationale for the correct answer, and reviewer. Keep all IDs unique and avoid rephrasing the same underlying scenario as a new question.

## Validation standard before re-enabling quizzes
1. Verify every question and explanation against a current official source (legislation, RSA, HSA, or other competent authority).
2. Record a precise source citation and date for every question; mark ambiguous or out-of-syllabus questions for exclusion.
3. Have an Irish approved driving instructor or qualified subject-matter reviewer check specialist vehicle, bus, tachograph and dangerous-goods questions.
4. Remove semantic duplicates; ensure mock papers contain distinct questions and balanced, relevant coverage.
5. Test answer indices, options, explanations, category mapping, mock timing and pass marks automatically.
6. Recheck sources whenever legislation or RSA materials are updated.

This independent resource is not affiliated with RSA or Prometric and does not reproduce official copyrighted questions.
