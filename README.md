# ENGG189 LLM Starter

This repository is the ENGG189 student starter. It contains a small,
browser-based codebase for practising work with an LLM coding agent. You make
the architecture and acceptance decisions.

Read [`docs/PROJECT_INTENT.md`](docs/PROJECT_INTENT.md) for the purpose and
boundaries of the starter. The agent contract is in [`AGENTS.md`](AGENTS.md).

This repository does not contain the course benchmark harness or a finished
optics project. Canvas contains the course dates, grading, and submission
instructions.

## Set up your workspace

You need Git, a modern browser, and one Codex interface. The Laser Lab has no
package install, API key, Node/npm requirement, build step, framework, or
generated asset.

### 1. Clone the repository

Use the repository URL supplied by the instructor. Clone it rather than
downloading a ZIP so that the Git history remains available for the exercise.

```text
git clone <repository-url>
cd engg189-codex-setup
```

Create your own branch before making changes:

```text
git switch -c student/laser-lab
```

### 2. Choose a Codex interface

Use either the CLI or the Codex desktop app. Both can work on the same local
checkout, but they are separate clients: their conversations and local
configuration are not interchangeable. Choose one interface for a given run
and make sure it is opened at this repository root.

#### Codex CLI (recommended)

Follow the current installation and sign-in instructions in the [official
Codex CLI documentation](https://learn.chatgpt.com/docs/codex/cli). Then verify
the command and start it from this repository:

```text
codex --version
codex
```

Codex automatically loads the applicable `AGENTS.md` instructions when the run
starts. As a check, ask it to summarise the project instructions it has loaded,
then have it read this README and the relevant exercise documents before it
edits anything.

For repeatable, non-interactive runs, the CLI also provides
[`codex exec`](https://learn.chatgpt.com/docs/non-interactive-mode). The
instructor can use it for checks; students do not need it for this workflow.

#### Codex desktop app (optional)

Open the cloned folder in Codex and confirm that the project tree contains
`AGENTS.md`, `docs/`, and `exercises/`. The app opens the same files as the CLI.
You still need to inspect the diff, run the tests, and make Git commits.

#### Harness (optional instructor path)

The harness is for comparing repeatable agent runs in isolated copies. It is
not a student prerequisite and is deliberately kept outside the starter
exercise. Students should not add benchmark configuration, API keys, or agent
comparison scripts to this repository.

### 3. Verify the untouched starter

Open these files directly in your browser:

```text
exercises/laser-lab/index.html
exercises/laser-lab/tests/index.html
```

The simulator should load, and the browser test page should report the baseline
checks as passing. If the baseline is not clean, stop and resolve that before
asking an agent to implement a task.

Check that Git sees only your branch state:

```text
git status --short --branch
```

### 4. Make the first agent request

Start by asking the agent for an explanation. Do not ask it to edit yet:

```text
Summarise the project instructions you have loaded from AGENTS.md.
Then read README.md, docs/PROJECT_INTENT.md,
exercises/laser-lab/INSTRUCTIONS.md, exercises/laser-lab/DESIGN.md,
and only the source and test files needed to explain the current slice.
Do not edit anything. Explain the state, input/update flow, ray tracing,
SVG rendering boundary, and the tests that observe the behavior. Identify
two possible architecture choices for the first task and their trade-offs.
```

Then continue with the bounded task sequence in
[`exercises/laser-lab/INSTRUCTIONS.md`](exercises/laser-lab/INSTRUCTIONS.md).

## How the exercise works

Each task follows the same loop:

```text
inspect -> ask for an explanation -> compare options -> choose ->
implement one slice -> run tests -> inspect the browser -> review -> commit
```

The agent may write much of the code. The student still chooses the scope and
architecture, states what counts as acceptance, checks the result, and records
the decision in `DESIGN.md`. The conversation, diff, tests, browser result,
and Git history should show those decisions.

## Repository map

```text
AGENTS.md                              agent working contract
docs/PROJECT_INTENT.md                 scope and teaching intent
exercises/laser-lab/INSTRUCTIONS.md    exercise tasks and checks
exercises/laser-lab/DESIGN.md          student architecture record
exercises/laser-lab/index.html         simulator
exercises/laser-lab/tests/index.html   browser-native tests
```

Additional exercises can be added later. Keep each exercise's instructions and
design record beside its source and tests.

## Submission

Follow the Canvas instructions for the submission location and due date.
Submit `DESIGN.md`, focused test results, browser observations, and the
milestone Git history. Include a short note about what remains out of scope.
