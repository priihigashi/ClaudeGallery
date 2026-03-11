# Claude Code Rules for ClaudeGallery

## CRITICAL: Never Drop Images When Editing Gallery Items

This is the most important rule for this project. **Every single time** you touch a gallery item
(`{i:..., g:..., n:..., ...}`) you MUST:

1. **Copy the entire item object verbatim** — do not reconstruct or retype it from scratch.
   Always read the current `index.html` first and copy/paste the exact existing object.

2. **Preserve the `img:` field** — if an item already has `img:'...'`, that field MUST appear
   in the output. Never omit it, even if the value is a long URL.

3. **Preserve ALL fields** — when moving an item between categories (changing its `g:` value),
   only change the `g:` field. Every other field (`n:`, `p:`, `s:`, `nt:`, `d:`, `u:`, `b:`,
   `bl:`, `bc:`, `img:`, etc.) must remain exactly as it was.

4. **DO NOT reorder or omit items** — if 94 items exist before your edit, 94 must exist after.

### Why this matters

- `img:'https://...'` fields store CDN/product images the user manually found and added.
- User-uploaded photos (base64) are stored in browser `localStorage` keyed by item `i:` index.
  Changing an `i:` value or removing an item destroys the link to that stored photo permanently.
- The user spends significant time finding and attaching images to each card. Losing them is
  irreversible and extremely frustrating.

### Required workflow for any reorganization task

1. Read `index.html` fully before touching anything.
2. Identify the exact item objects that need to move/change.
3. Copy those objects word-for-word; only change the specific field(s) requested (e.g. `g:`).
4. Verify the `img:` field is present in your output if it was present in the original.
5. When in doubt, diff your changes against the original and confirm no `img:` fields were lost.

### Required workflow for any new item

When adding a brand-new item, always try to find and include an `img:'...'` field with a real
product image URL from the retailer or a reliable CDN. Do not add items without images unless
it is truly impossible to find one.
