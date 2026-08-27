# Laser Lab design record

This file is student-authored. Codex may help compare options, but the student chooses the architecture.

## Gate 0: requirements

- What must the first working slice do?

    The first working slice refers to functional baseline of the optics workbench. Based on the origin repository, it's unit tests and the guided answer from codex, it must have the following functions:
    - **Pass baseline browser tests**
        - The slice must pass the automated tests in *~/test/index.html*
    - **Support interactive bench manipulation**
        - Support pointer dragging and rotation handling of the workbench elements
        - Support keyboard controls with arrow keys to nudge and Q/E to rotate
    - **Render Decoupled SVG Visuals**
        - Draw the bench grid, optical elements, laser core paths, and target hit effects in *render.js* without rendering logic into the tracer.
    - **Manage Scene State**
        - Store immutable element state for three basic element kinds: laser, mirror, and target in *scene.js*

- What is deliberately out of scope?

    The following items were excluded in the first working slice:
    - **Lenses and Refraction**
        - Converging/Diverging lenses
        - Snell's law
        - Refracted index media
    - **Multi-Ray Bundles and Point Sources**
        - No point sources
    - **Wave optics and complex physics**
        - No diffraction, interference, polarization, Gaussian beam waist profiles, or absorbtion attenuation
    - **Curved or abitrary geometry**
        - No parabolic or curved mirrors. 
        - No 3D ray tracing
    - **External Runtime/ Build dependencies**
        - No npm packages. Vanilla HTML, CSS, and JS was used to make the slice browser-native.

## State representation



### Option A

Describe it:

Trade-offs:

### Option B

Describe it:

Trade-offs:

### Decision

I choose:

Reason:

## Rendering and interaction

How will simulation state, SVG rendering, and pointer input remain separate?

## Evidence

- Gate or task:
- Browser test page and result:
- Screenshot or observation:
- Commit:

## Revision log

Record what changed after an unexpected result or failed test.
