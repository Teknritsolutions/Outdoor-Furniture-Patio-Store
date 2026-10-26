# Original hero images

All 11 pages now have newly generated, exclusive hero artwork in `assets/images/heroes/`. Each image is used only in its own page's first section. The selected product photos remain accurate on product detail pages.

Images were created with the built-in `image_gen` tool. Page scenes and generation instructions are recorded in `hero-image-prompts.json`. Full-size assets are 1600 × 900 WebP with 600 × 338 mobile variants. Original generated PNGs remain in the recorded Codex generated-images locations.

Run `node tests/unique-heroes.cjs` to verify page assignment, single-use references, distinct image hashes, and mobile variants. Build refinement automatically reapplies these assets.
