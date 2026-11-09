# CS300 Midterm Reviewer

A study site for CS300 (Mobile App Development) Midterm 1 and Midterm 2: notes, plain-language terms, flashcards, a code quiz, write-it drills, and outline checklists. It's plain HTML, CSS, and JavaScript with no build step.

**Live site:** https://nearcore.github.io/cs300-reviewer/

## Study modes

Use the switch at the top to study Midterm 1, Midterm 2, or both.

- **Notes**: every topic on the study guides, with code examples and search.
- **Terms**: the vocabulary, in plain language, with a short example.
- **Flashcards**: flip them, shuffle them, mark each one *know it* or *still learning*, and filter by topic.
- **Quiz**: multiple-choice questions, including *What prints?*, *Does it compile?*, *Find the bug*, and *Which pattern?*. After each answer you get the reason and an example. Questions labeled **From class** come from recovered class quizzes and discussions. Questions labeled **Practice** were written for extra practice.
- **Drills**: type the code yourself, then compare.
- **Outline**: the study-guide items, with checkboxes and links to the notes, cards, and quiz for each.

Progress (card marks, outline checks, quiz history) is saved in your browser's `localStorage` only.

## Run it

Open `index.html` in a browser. No server is needed.

## Project layout

```
index.html              page shell and markup
css/styles.css          styles, with light and dark themes
js/data/notes.js        Midterm 1 notes, topic names, and outline
js/data/flashcards.js   Midterm 1 flashcards
js/data/questions.js    Midterm 1 quiz bank (first option is always the correct one)
js/data/midterm2-notes.js     Midterm 2 notes, terms for both exams, Midterm 2 outline
js/data/midterm2-practice.js  Midterm 2 cards, drills, and code questions for both exams
js/data/quiz-examples.js      the example shown after each quiz answer
scripts/verify-questions.mjs  runs the code questions and stated example output through Java
js/app.js               tabs, search, flashcards, quiz, outline, saved progress
source/                 the original CS300 Reviewer.md the content came from
scripts/build-artifact.mjs  builds dist/artifact.html for publishing as a Claude Artifact
```

## Checking answers

`JAVA_BIN=/path/to/jdk/bin node scripts/verify-questions.mjs` compiles and runs every *What prints?* and *Does it compile?* question, and every example with a `// prints X` comment.

## Editing content

- **Add a quiz question:** append to `CS300.questions` in `js/data/questions.js`. Use `src: "practice"` unless the question came from class, and give it a `topic` id (`t1`–`t12` for Midterm 1, `m1`–`m17` for Midterm 2), and add an example in `js/data/quiz-examples.js`.
- **Add a flashcard:** append `[id, topic, front, back]` in `js/data/flashcards.js`.
- Backticks in question, option, and card text render as inline code.

## Sources

The content comes from the CS300 Midterm 1 outline, class discussions, and *Head First Design Patterns, 2nd Edition* (Freeman & Robson), with API details checked against the Android and Oracle Java documentation. See `source/CS300 Reviewer.md`.
