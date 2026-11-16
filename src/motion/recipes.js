import { generateSpecCss } from "../vendor/openmotion/generator.js";
import { easingToCss } from "../vendor/openmotion/easing.js";
import { scrollRevealTemplate } from "../vendor/openmotion/scrollReveal.js";
import { bentoGridRevealTemplate } from "../vendor/openmotion/bentoGridReveal.js";
import { depthCardTemplate } from "../vendor/openmotion/depthCard.js";
import { kineticTextTemplate } from "../vendor/openmotion/kineticText.js";
import { microInteractionTemplate } from "../vendor/openmotion/microInteraction.js";
const reveal = scrollRevealTemplate.build()[0];
const grid = bentoGridRevealTemplate.build()[0];
const depthLayers = depthCardTemplate.build();
const depth = depthLayers[0];
const kinetic = kineticTextTemplate.build()[0];
export const feedbackRecipe = microInteractionTemplate.build()[0];
const recipes = [
  {
    ...depthLayers[2],
    id: "image",
    durationMs: 650,
    keyframes: [
      { offset: 0, properties: { opacity: 0, scale: 1.04 } },
      { offset: 1, properties: { opacity: 1, scale: 1 } },
    ],
  },
  {
    ...reveal,
    id: "reveal",
    durationMs: 620,
    keyframes: [
      { offset: 0, properties: { opacity: 0, translateY: 24 } },
      { offset: 1, properties: { opacity: 1, translateY: 0 } },
    ],
  },
  {
    ...grid,
    id: "tile",
    durationMs: 660,
    keyframes: [
      { offset: 0, properties: { opacity: 0, scale: 0.96, translateY: 20 } },
      { offset: 1, properties: { opacity: 1, scale: 1, translateY: 0 } },
    ],
  },
  {
    ...kinetic,
    id: "kinetic",
    durationMs: 700,
    keyframes: [
      { offset: 0, properties: { opacity: 0, translateY: "105%" } },
      { offset: 1, properties: { opacity: 1, translateY: 0 } },
    ],
  },
  {
    ...depth,
    id: "dialog",
    durationMs: 240,
    keyframes: [
      { offset: 0, properties: { opacity: 0, scale: 0.98, translateY: 12 } },
      { offset: 1, properties: { opacity: 1, scale: 1, translateY: 0 } },
    ],
  },
].map((recipe, orderIndex) => ({
  ...recipe,
  orderIndex,
  selector: `[data-om-recipe="${recipe.id}"].om-visible`,
  style: {},
  delayMs: 0,
  iterationCount: 1,
  fillMode: "both",
}));
export const motionCss =
  generateSpecCss(recipes) +
  `\n[data-om-recipe].om-visible {animation-delay:var(--om-delay,0ms);}\n`;
export const motionEase = easingToCss(reveal.easing);
export const feedbackEase = easingToCss(feedbackRecipe.easing);
