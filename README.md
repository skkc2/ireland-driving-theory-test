# RoadReady Ireland — Irish truck & bus theory practice

A static HTML/CSS/JavaScript revision site. No backend, build step or account required.

## Run locally
Run `python3 -m http.server 8000` from the repository root and open http://localhost:8000.

## GitHub Pages
The workflow `.github/workflows/pages.yml` deploys the repository root on pushes to `main`. In Settings → Pages choose **GitHub Actions** as the source if required.

## What's included
- 500 original questions across 12 topics (50 per topic).
- Five disjoint mock exams, each 100 questions, with a 120-minute timer and 74/100 practice pass mark.
- Question navigation, answer selection, review flags and results with explanations for wrong or unanswered questions.
- Topic notes and 50-question quizzes with immediate feedback.
- Browser-only score history in localStorage.

## Editing the question bank
Edit `data/questions.json`. Each question has a unique `id`, topic ID, question text, 3 options, zero-based correct `answer` index, and explanation. Keep IDs unique. Every mock exam uses a non-overlapping 100-question slice of the bank; maintain at least 500 questions if you want to retain five full, non-repeating mocks. Topic IDs must match an entry in `topics`.

## Accuracy and exam format
The single-category professional theory test information is summarised by the RSA as 100 questions and 74 correct to pass for C and D; the combined CD test is 140 questions and 104 correct. Time limits shown in this practice site are 120 minutes for single category and 180 minutes for combined CD; verify the current details on the official booking/provider information before your exam:
- [RSA — Professional driver theory test](https://www.rsa.ie/services/professional-drivers/cpc/become-a-professional-cpc-driver/2.-theory-test)
- [Prometric — Theory test FAQs](https://theorytest.ie/general-information/faqs/)
- [Citizens Information — Driver theory test](https://www.citizensinformation.ie/en/travel-and-recreation/motoring/driving-tests/driver-theory-test/)

EU drivers' hours rules have exceptions and special cases; dangerous goods content is introductory and must be checked against current ADR and Irish requirements. A number of scenarios are broad safety principles rather than definitive legal advice. Have a qualified instructor verify the bank before treating it as authoritative. This is an independent study aid, not affiliated with RSA or Prometric.
