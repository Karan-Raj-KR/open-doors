# OpenMotion integration

The app uses the CSS generator, property-unit converter, easing presets, template helper and five templates from the locally cloned OpenMotion repository. This is executable upstream source, not a reference-only mention. The MIT license and upstream revision are retained under `src/vendor/openmotion/`.

## Source and authoring

- Upstream: https://github.com/Yuan-ManX/open-motion
- Vendored revision and modifications: `src/vendor/openmotion/SOURCE.md`
- Refresh command: `node scripts/sync-openmotion.mjs` with the local `open-motion/` clone available.
- The clone itself stays local and is excluded from Git and deployment. The production app needs only the committed runtime subset.
- No OpenMotion server, AI service, database or separate account is needed for the generated animation CSS.

## Runtime

`src/motion/recipes.js` builds Scroll Reveal, Bento Grid Reveal, Kinetic Text and Depth Card recipes using the upstream template builders. The actual upstream `generateSpecCss` converts those specs into stylesheet rules, including reduced-motion rules. The Micro Interaction template supplies the spring easing for control feedback.

`src/motion/OpenMotion.jsx` attaches those recipes to components as React mounts them. IntersectionObserver triggers each entrance once, MutationObserver discovers new cards and dialog content, and pointer events apply brief control feedback. The integration cleans up observers, listeners, styles and active Web Animations on unmount.

## Coverage

- Hero and section titles: clipped word entrances with staggered timing.
- Event cards, access choices, venue features, organiser entries and comparison rows: tile/reveal recipes.
- Carousel images: depth-layer fade and scale transition.
- Native dialogs: brief opacity, scale and position entrance.
- Buttons and chips: independent press scale; icon feedback on pointer activation.
- Photos and poster covers: restrained hover depth; existing reference card fan and scroll stack are retained.
- Community rows: existing pause/play control; reduced motion and comfort display disable movement.

Durations and displacement are adapted to a working directory interface. Upstream's larger bounces are reduced, and animations use transform/opacity rather than moving page layout. Essential controls remain native buttons and form elements. Keyboard activation skips pointer feedback.

## Design refinements

Distinct coral, yellow, lavender, blue, pink and green poster compositions; clearer event price labels; softer venue and booking surfaces; more consistent corners; visible filter selection and focus feedback; roomier form controls and readable mobile event metadata.

## Verification

Production build succeeds. The actual upstream scroll template was passed through the vendored generator, and the application's five generated recipes were checked for valid names, finite values and reduced-motion output. Browser rendering remains unverified because preview access was declined earlier in this chat; no alternative browser path was used.
