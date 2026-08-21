# ENGG189 LLM Starter — project intent

This document records why the repository exists and what it is allowed to become. Read it before proposing new exercises, changing the student workflow, or expanding the simulator.

## Purpose

This is the ENGG189 starter repository. Students fork or clone it to establish
a working environment for Codex and practise using a coding agent.

The repository is not the engineering benchmark harness or the finished course
project. Benchmark comparison is a separate workstream. For now, the student
repository assumes Codex and keeps the codebase small enough to inspect.

The course does not assess typing speed or difficult optics. Code generation
makes implementation relatively cheap. The assessable work is deciding what to
build, how to represent it, where behavior belongs, what constraints matter,
and whether generated code should stay.

## What students should learn

Students should become comfortable with a repeatable loop:

1. inspect an unfamiliar codebase;
2. ask the agent to explain what it found;
3. state the desired change and its acceptance condition;
4. compare implementation options and choose one;
5. ask for a bounded implementation;
6. run tests and inspect the browser result;
7. ask for a review or debugging pass;
8. decide what to accept, revise, or reject; and
9. preserve the decision in `DESIGN.md` and Git history.

The student remains responsible for architecture, scope, tests, and engineering
judgment. The agent may generate most of the implementation. A generated result
is insufficient without a design record and evidence.

## Why the optical table

The optical table is a compact, visual setting for this work:

- the browser result is immediately inspectable;
- the implementation can remain plain HTML, CSS, JavaScript, and SVG;
- the geometric-optics mathematics is simple enough to keep the focus on software design;
- new components create real pressure on state, ray representation, interaction, rendering, and testing;
- the exercise can look engaging without generated image assets or a heavy runtime.

Lenses stay in the task sequence because the equations are manageable while the
representation and composition choices require decisions.

## Current baseline

The first exercise is a top-down Laser Lab with:

- laser sources, plane mirrors, and a target;
- geometric ray tracing and reflection;
- selection, dragging, rotation, keyboard movement, reset, and element creation;
- a separate core-ray layer and decorative beam effects;
- browser-native tests;
- student instructions in the repository rather than inside the simulator UI.

The baseline is a starting point. It should not pre-solve the student extensions by adding every optical component in advance.

## First task arc

The first student tasks are three small tasks that establish the agent workflow
before the implementation becomes more architectural:

1. explain the existing modular code and record an architecture decision without changing production code;
2. add an ideal thin lens, which requires a decision about how an optical element interacts with a ray; and
3. add a point source with multiple deterministic rays, which requires a decision about ray-bundle representation and composition.

The lens equations are manageable, while the representation and composition
choices require decisions. The point source then tests the earlier tracing and
rendering boundaries. The tasks should not prescribe the architecture or turn
into a full optics engine.

Each task should use the same agent loop: inspect, compare options, choose,
implement one slice, test, inspect, review, and commit. Assess the student's
decisions and evidence, not the size of the generated feature.

## Roles and boundaries

### Student

The student chooses the architecture, states the scope, writes or approves the acceptance test, inspects generated code, and decides whether review feedback should be accepted.

### Codex or another coding agent

The agent explains the existing code, compares options, implements a bounded approved change, runs or helps write tests, reviews diffs, and reports uncertainty. It must not silently choose the architecture or generate the whole project in one pass.

### Instructor

The instructor reviews the design record, evidence, and Git history. The instructor can ask for clarification or a narrower change without taking the architecture decision away from the student.

## Boundaries to preserve

- Keep the starter browser-native and token-lean.
- Keep the benchmark harness separate.
- Keep student tasks and instructor/agent controls in repository documents, not in the simulator surface.
- Do not make lenses, point sources, or generalized rays a pre-completed solution when they are student tasks.
- Do not reward prompt length, one-shot generation, or unnecessary framework complexity.
- Do not turn the repo into a general-purpose optics library before students have encountered the architectural pressure themselves.

## Drift check

Before changing the project, ask:

- Does this help students make and defend an architecture decision?
- Does it make the agent workflow visible through a small diff, test, browser observation, or commit?
- Is the change small enough for a free or low-budget coding-agent run?
- Does it remain browser-native and visually inspectable?
- Does it belong in the student starter rather than the separate benchmark workstream?

If the answer is unclear, record the uncertainty and discuss the scope before adding code or another task.
