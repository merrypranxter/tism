# MY AUTISM — Merry's Field Guide to Her Own Nervous System

An artistic, interactive self-assessment atlas about Merry's suspected late-recognized autism: masking, pattern hunger, intense interests, executive friction, sensory and interoceptive weirdness, burnout, ADHD overlap, and the role of creative system-building.

This is personal documentation, not a diagnosis and not a claim that every autistic person works like Merry.

## The central mechanism

The page has two visual/cognitive states:

- **Unmasked:** acidic color, kinetic neural field, blunt first-person language, and visible system complexity.
- **Masked:** compressed grayscale presentation, restrained motion, and clinical labels moved to the surface.

The switch changes the information hierarchy—not just the palette—so masking is expressed as an interface behavior rather than a decorative theme.

The site also includes:

- a filterable pattern lattice of recurring traits
- an interactive "spectrum mixing board" for fluctuating states
- a cautious DSM-5 evidence map with explicit unknowns
- an autism / ADHD / body-variable overlap model
- a burnout and unmasking timeline
- prompts for the ongoing self-assessment
- a research shelf linking the clinical framework and primary studies

## Run it

Requires Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

Validation:

```bash
npm run lint
npm test
```

## Main files

- `app/page.tsx` — content, state controls, filtering, and the animated neural field
- `app/globals.css` — complete visual system and responsive behavior
- `app/layout.tsx` — metadata and document shell
- `.openai/hosting.json` — OpenAI Sites project identity

## Evidence shelf

- [CDC: DSM-5 diagnostic criteria for autism](https://www.cdc.gov/autism/hcp/diagnosis/index.html)
- [NICE: autism in adults—diagnosis and management](https://www.nice.org.uk/guidance/cg142)
- [Raymaker et al. (2020): Defining Autistic Burnout](https://pmc.ncbi.nlm.nih.gov/articles/PMC7313636/)
- [Hull et al. (2019): Development and Validation of the CAT-Q](https://pmc.ncbi.nlm.nih.gov/articles/PMC6394586/)

## Design rules

- keep the content specific to Merry rather than turning it into generic autism education
- preserve uncertainty and overlap instead of diagnosing from vibes
- keep reduced-motion support and readable semantic HTML
- maximalism must be structured; no generic template cards, random glitch garnish, or beige pamphlet energy
