# Laser Lab instructions

Laser Lab is a small, top-down geometric-optics simulator. It is the first
exercise in this repository.

Set up and verify the repository using the [root README](../../README.md)
before starting. This file contains the exercise tasks. `AGENTS.md` contains
the agent contract, and `DESIGN.md` contains your architecture record.

## Run it

Open `index.html` directly in a browser. No install or server is required.

Open `tests/index.html` to run the browser-native checks.

The `main` branch is the student starting point. It contains lasers, mirrors,
a target, reflection, interaction, rendering, and browser tests. Lenses and
point-source ray bundles are deliberately left for the exercise.

## Working rules

Work through the three tasks in order. For every task:

- read only the files needed for that task;
- state the change or question before asking an agent to act;
- ask the agent to compare options before an architecture-affecting change;
- run the required browser tests and inspect the simulator before completing the task;
- record the decision and evidence in `DESIGN.md`; and
- make the milestone commit before moving on.

The agent can implement and review changes. The student owns the architecture,
scope, acceptance decision, and final Git history.

## Task 1 — explain the existing code

Start with no production-code changes. Ask Codex to explain the current
codebase in plain technical language:

- what state is stored in the scene;
- how pointer and keyboard input become scene updates;
- how rays are represented and traced;
- where SVG rendering is separated from tracing; and
- where the current tests observe behavior.

Then ask for two ways the state/update flow could be organized. Choose one,
record the choice and its non-goals in `DESIGN.md`, and make the first
milestone commit.

Deliverable:

- a source-grounded architecture explanation;
- two options with trade-offs;
- one selected option, the reasoning for the choice, and explicit non-goals;
- unchanged browser tests showing the baseline checks still pass; and
- commit message: `laser-lab: record architecture decision`.

Do not add a lens, point source, generalized ray system, or new dependency in
this task.

## Task 2 — implement an ideal thin lens

Choose and document a minimal model for an ideal thin lens. State the
optical-axis convention, focal-length sign convention, input ray quantities,
and output direction. Compare at least two implementation locations before
editing, such as:

- a lens as a scene element with focal length handled by the trace pipeline; or
- a separate optical-element rule applied after the existing ray intersection.

Implement only the chosen model. Add a focused browser test for a simple lens
case, such as a parallel ray changing toward the focal point, while keeping the
existing mirror and target tests green. Add the lens to the visible table only
to the extent needed to inspect the result.

Deliverable:

- one bounded lens behavior;
- a focused test and full browser-test result;
- a visible browser observation;
- the model decision and one rejected alternative in `DESIGN.md`; and
- commit message: `laser-lab: add ideal thin lens`.

Do not implement a generalized optics engine or point-source fan-out in this
task.

## Task 3 — implement a point source with multiple rays

Choose how a point source produces a small deterministic ray bundle. Compare
at least two representations, such as:

- expanding the bundle at the source boundary before the existing tracer; or
- allowing the tracer to fan out from a source element.

Select one representation and record the invariants that must remain true:
stable ray ordering, bounded ray count, reuse of the existing segment/hit
pipeline, and separation between measured rays and decorative aura. Implement a
point source that emits at least three visible rays. Add focused tests for
deterministic emission and for preserving existing mirror, target, and lens
behavior.

Deliverable:

- one bounded point-source model with multiple rays;
- focused and full browser-test results;
- a visible browser observation;
- the representation decision, rejected alternative, and remaining non-goals
  in `DESIGN.md`; and
- commit message: `laser-lab: add point source rays`.

Do not turn this task into a general-purpose optics library or a full physical
renderer.

## Final check

Submit the fork or branch specified in Canvas with:

- the completed `DESIGN.md`;
- the three milestone commits;
- passing browser-test evidence;
- browser observations for the implemented behavior; and
- a short note describing what remains out of scope.

The instructor reviews the design record and evidence. The student remains the
author of the architecture decisions; the agent remains an implementation and
review partner.
