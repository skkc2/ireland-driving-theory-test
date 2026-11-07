# RoadReady Ireland

A static HTML/CSS/JavaScript starter site for Irish truck (C/C1/CE/C1E) and bus (D) theory revision. No backend or build process.

## Run locally
From the repository root run `python3 -m http.server 8000` and visit http://localhost:8000.

## GitHub Pages
A GitHub Actions workflow deploys the repository root on every push to `main`. In repository Settings → Pages, select **GitHub Actions** as the deployment source if it is not already selected.

## Update the question bank
Edit `data/questions.json`. Each question needs a unique `id`, a topic ID, question text, 3–4 options, a zero-based `answer` index and a concise explanation. Topic notes live in the same file. Questions must be original and not copied from RSA or Prometric question banks.

## Important scope / accuracy warning
This is an early starter implementation with 23 original questions. It is **not yet five full-length non-repeating mock tests**. Current mock sets divide the available bank into small unique practice sets; the countdown shown is scaled for the small beta sets. Expand the bank to at least 500 distinct, checked questions before publishing as a full exam simulator. Do not treat the current question coverage as sufficient exam preparation.

The RSA states that individual Category C and D tests have 100 multiple-choice questions and require 74 correct; combined CD has 140 questions and requires 104. The RSA page does not specify a time limit in its summary; Prometric/Citizens Information list 120 minutes for C/D and 180 minutes for CD. Sources:
- [RSA — Theory test](https://www.rsa.ie/services/professional-drivers/cpc/become-a-professional-cpc-driver/2.-theory-test)
- [Prometric — FAQs](https://theorytest.ie/general-information/faqs/)
- [Citizens Information — Driver theory test](https://www.citizensinformation.ie/en/travel-and-recreation/motoring/driving-tests/driver-theory-test/)

Standard EU drivers' hours rules have exceptions and special cases. Dangerous goods content requires checking current ADR and Irish rules. This resource is independent, is not legal advice and is not affiliated with RSA or Prometric.
