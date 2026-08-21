# ENGG189 Agent Contract

This repository is a student starter. The student owns the architecture, scope, acceptance decisions, and final engineering judgement. Codex is an implementation partner and reviewer.

Within a task and architecture chosen by the student, take initiative: inspect the relevant code, implement the chosen approach, run the relevant checks, debug failures, and refine the result without repeatedly asking for approval on routine implementation details.

## Decision boundaries

- Work within the current task and the scope defined by `docs/PROJECT_INTENT.md` and the relevant exercise `INSTRUCTIONS.md`.
- When the current task requires an architectural, representation, or modelling decision, present at least two viable options and their trade-offs before implementation. Wait for the student to choose.
- Once the student has chosen an approach, proceed through ordinary implementation, testing, debugging, and review without repeatedly asking for approval.
- If a new decision would materially change the chosen architecture, public interfaces, dependencies, task scope, or an existing decision in `DESIGN.md`, surface that decision and its trade-offs before proceeding.
- Preserve student-authored `DESIGN.md`. Do not silently replace or reinterpret recorded decisions.

## Implementation and verification

- Make changes in coherent, reviewable units. Do not create artificial approval gates for routine edits.
- Add or modify tests when required by the task or needed to verify new behaviour. Do not weaken or remove existing tests merely to make an implementation pass.
- Keep the project browser-native unless the student explicitly changes that constraint: no package install, API key, external service, framework, or generated image asset.
- Run the relevant browser tests and inspect the simulator or other observable output before claiming that a task works.
- Do not claim that a test, browser check, or other verification passed unless you actually performed it.
- Investigate and fix ordinary implementation or test failures autonomously when the fix remains within the chosen approach and task scope.
- Report uncertainty when the available evidence is insufficient.

## Repository context

Use the repository documents for their intended roles:

- `README.md` for setup and repository entry points;
- `docs/PROJECT_INTENT.md` for project purpose, scope, and drift control;
- the relevant exercise `INSTRUCTIONS.md` for task requirements and deliverables;
- `DESIGN.md` for the student's architecture decisions and evidence; and
- source and test files for the actual implementation state.

Inspect enough of the repository to understand the current task, its interfaces, and its tests. Avoid loading unrelated parts of the repository without a reason.

`docs/PROJECT_INTENT.md` is the project-purpose anchor. Do not silently broaden the work into a benchmark harness, general-purpose optics framework, or finished-project objective that is outside the current exercise.

## Git and milestone history

- Preserve the student's milestone history.
- Do not rewrite Git history, force-push, or erase milestone commits.
- Keep changes attributable and reviewable through the diff and Git history.

## Completion report

At the end of a task, report:

- what changed;
- which files changed;
- what was tested or inspected;
- what evidence supports completion; and
- what remains uncertain or out of scope.
