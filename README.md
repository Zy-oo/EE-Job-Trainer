# EE II Prep Trainer

A self-contained, offline-first study app built specifically to prepare for the
**Electrical Engineer II** role (RF & Electrical Engineering, Neuromodulation)
at LivaNova. Every module, quiz question, and flashcard is written directly
from a line in that job description — this isn't a generic EE curriculum.

## Why this exists

The role names several hard qualifications explicitly: Cadence simulation,
Altium schematic capture/layout, 2+ years of C/C++/C# for test automation,
and independent dFMEA analysis. For someone with strong hands-on EE
Technician experience and an incoming Computer Engineering degree, those are
the highest-leverage gaps to close — everything in this app is organized
around closing them as efficiently as possible.

## What's inside

- **Dashboard** — overall readiness score, countdown to your target date, and a "focus this week" list driven by your actual quiz results.
- **Role Overview** — the JD broken into purpose / responsibilities / qualifications.
- **13 Learning Modules** — PCBA bring-up, Cadence, Altium, low-power design, debug instrumentation, embedded interfacing, test system architecture, C# test automation, statistics (Cpk/Gage R&R/hypothesis testing), dFMEA/risk management, medical device design controls, technical writing, and Agile/mentoring. Each has key concepts, flashcards, a quiz, and a concrete hands-on practice exercise.
- **Flashcards** — flip cards per module or across all modules, self-mark known/unsure.
- **Quiz** — multiple choice per module or a mixed exam; best score is saved and drives the dashboard/planner.
- **Study Planner** — set a target date and weekly hours; generates a week-by-week plan prioritizing your weakest modules.
- **Interview Prep** — a STAR-format behavioral question bank tied to specific responsibilities in the JD, with a text box per question that autosaves your draft answers.
- **Resume Gap Bridge** — how to frame existing EE Technician experience against this JD, the specific gaps to close before applying, and notes on positioning for an internal move.
- **Glossary** — quick reference for acronyms/terms used throughout (dFMEA, Cpk, SCPI, IEC 60601, etc.).

## Running it

No build step, no dependencies, no backend. Either:

```bash
# Open directly
open index.html        # macOS
xdg-open index.html     # Linux

# Or serve it locally (recommended, avoids any file:// quirks)
python3 -m http.server 8080
# then visit http://localhost:8080
```

All progress (quiz scores, flashcard familiarity, planner settings, STAR
answer drafts) is stored in your browser's `localStorage` only — nothing is
uploaded anywhere, and clearing your browser data will reset progress.

## Project structure

```
index.html        entry point / shell
css/styles.css     styling (light + dark mode via prefers-color-scheme)
js/data.js         all content: modules, quiz questions, flashcards, STAR bank, glossary
js/app.js          app logic: routing, rendering, localStorage persistence
```
