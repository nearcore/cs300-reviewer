# CS300 Midterm Reviewer

A study site for CS300 (Mobile App Development) Midterm 1: notes, flashcards, a practice quiz, and an outline checklist. It's plain HTML, CSS, and JavaScript with no build step.

## Study modes

- **Notes**: all 13 topics, plus the recovered Q&A and references. Includes code examples and search.
- **Flashcards**: 60 cards. Flip them, shuffle them, mark each one *know it* or *still learning*, and filter by topic.
- **Quiz**: 82 multiple-choice questions with instant explanations. Questions labeled **From class** (22) come from recovered class quizzes and discussions. Questions labeled **Practice** (60) were written from the notes for extra practice. You can retry the questions you missed.
- **Outline**: the 17 study-guide items, grouped as in the midterm outline, with checkboxes and links to the notes, cards, and quiz for each.

Progress (card marks, outline checks, quiz history) is saved in your browser's `localStorage` only.

## Run it

Open `index.html` in a browser. No server is needed.

## Project layout

```
index.html              page shell and markup
css/styles.css          styles, with light and dark themes
js/data/notes.js        topic notes, topic names, and the midterm outline
js/data/flashcards.js   the 60 flashcards
js/data/questions.js    the quiz bank (first option is always the correct one)
js/app.js               tabs, search, flashcards, quiz, outline, saved progress
source/                 the original CS300 Reviewer.md the content came from
scripts/build-artifact.mjs  builds dist/artifact.html for publishing as a Claude Artifact
```

## Editing content

- **Add a quiz question:** append to `CS300.questions` in `js/data/questions.js`. Use `src: "practice"` unless the question came from class, and give it a `topic` id (`t1`–`t12`).
- **Add a flashcard:** append `[id, topic, front, back]` in `js/data/flashcards.js`.
- Backticks in question, option, and card text render as inline code.

## Sources

The content comes from the CS300 Midterm 1 outline, class discussions, and *Head First Design Patterns, 2nd Edition* (Freeman & Robson), with API details checked against the Android and Oracle Java documentation. See `source/CS300 Reviewer.md`.
