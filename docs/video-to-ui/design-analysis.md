# Video-to-UI reference analysis

Source: supplied 43-second Pallet Ross recording. Extracted 43 PNG frames at 1 fps with the installed `mmohajer9/video-to-ui` skill. Five delegated batches cover every frame. Full frames remain at `/private/tmp/open-doors-video-to-ui/frames`; curated frames and batch reports accompany this file.

The video includes an outer charcoal presentation stage and watermark. Those are not website elements and are excluded from the app.

## Observed design system

- Background `~#FAFAFA`; surface `#FFFFFF`; ink `~#171A18`; muted `~#747874`.
- Mint logo/highlights `~#8BCBBE`; red phrase `~#9D2C31`; photographic orange `~#F76B43`; lime `~#E9FF5D`; violet control `~#C342EE`.
- Neutral geometric sans. At a 1440px website viewport: hero ~75px, section headings ~64px, mission headings ~44px, body ~13–15px, utility labels ~11px. Values estimated from the website region within the video.
- Content insets ~7–8%; centered hero text measure ~52% viewport width.
- Rounded art cards ~16–24px at full desktop scale. Black pill primary actions, text secondary actions, white circular carousel arrows.
- Varied artwork, saturated flat covers and distinct compositions. Not one repeated dark photo/heading template.
- Fan expands then converges; card stack rotates into a diagonal cascade; text reveals; tile rows drift horizontally; lime marquee translates.

## Screen inventory

1. Hero, frames 001–004: centered heading, expanding art fan and CTA pair.
2. Introduction, 005–007: left copy, red phrase and card cascade.
3. Showcase, 008–013: wide orange photography and functional carousel controls; no giant display copy overlay.
4. Connecting statement, 014–015: centered statement with card pile above it.
5. Diagonal cascade, 016–017: seven cards descend across almost the whole width; second card is white information.
6. Mission, 018–021: left copy, right grid under stacked folder tabs.
7. Community, 022–024: heading between two horizontally moving image rows.
8. Stories, 025–028: centered title and staggered editorial grid.
9. Marketplace, 029–031: left title and horizontal square cards.
10. Mosaic, 032–035: enlarged central portrait above smaller staggered tiles.
11. Membership, 036–037: three floating price cards. Pricing is outside Open Doors' current product scope and is not fabricated.
12. Lime, 038–040: horizontal marquee and lower icon field.
13. Paired CTAs, 041–042: two tall image-led panels with inverse pills.
14. Footer, 043: shallow gray surface, compact columns and round action links.

## Concrete changes against existing code

- `src/reference.css`: keep `--paper` and `--ink`; change `--sage`/mint highlight and add role tokens for observed red, lime and orange. Increase hero fan from 38% to ~69% viewport width and add black pill + text CTA pair (001–004).
- `src/components/ReferenceLanding.jsx`: add introduction copy to the first card sequence; replace the oversized showcase overlay with a minimal event carousel and working previous/next controls (005–013).
- `src/components/ReferenceLanding.jsx`: replace left-column diagonal copy with a white information card second in the cascade (016–017).
- `src/components/ReferenceLanding.jsx`: add the missing right folder-tab grid to the mission and make its tabs switch real event/access content (018–021).
- `src/reference.css`: animate image rows horizontally with a pause control and reduced-motion alternative (022–024).
- `src/App.jsx`: place community before the functioning directory, which serves the event storytelling/discovery role, and keep the lime/paired closing CTAs at the end (022–031, 038–043).
- `src/components/ReferenceLanding.jsx`: add the closing attendee/organiser CTAs using existing app actions (041–042).

Existing authorization: the owner instructed autonomous implementation without questions, so the skill's optional onboarding/export questions and its edit-approval pause are superseded for this task.

## Applied outcome and verification

Implemented the frame-cited corrections in ReferenceLanding.jsx, reference.css and App.jsx. The hero now has the wider independently animated card fan and CTA pair; the showcase is a functioning six-event carousel; the diagonal sequence includes the white information card; the mission has working event/access folder tabs; community rows move with pause/play and reduced-motion handling; paired attendee/organiser CTAs use the actual app actions. The header remains visible during scroll.

Production build succeeds. Browser access was previously declined and that restriction is respected: no rendered screenshot comparison was performed, and pixel-perfect equivalence is not claimed. All color and dimension observations are approximate measurements from the recorded website area, not original source design values.
