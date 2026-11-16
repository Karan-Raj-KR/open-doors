// OpenMotion, Copyright (c) 2026 Yuan-Man. MIT. See LICENSE.
                                                          
import { easingToCss } from "./easing.js";
import { buildTransformString, formatValue, isTransformProperty } from "./units.js";

                               
                        
                         
                    
 

function percent(offset        )         {
  return `${(offset * 100).toFixed(2).replace(/\.?0+$/, "")}%`;
}

const UNITLESS_NUMERIC = new Set([
  "fontWeight",
  "opacity",
  "zIndex",
  "flexGrow",
  "flexShrink",
  "order",
  "lineHeight",
]);

function styleToCss(style                                 )         {
  return Object.entries(style)
    .filter(([k]) => !k.startsWith("_"))
    .map(([k, v]) => {
      const kebab = camelToKebab(k);
      if (typeof v === "number") {
        return `${kebab}: ${UNITLESS_NUMERIC.has(k) ? v : `${v}px`};`;
      }
      return `${kebab}: ${v};`;
    })
    .join(" ");
}

export function camelToKebab(s        )         {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/** Generate @keyframes + the element rule for a single component. */
export function generateComponentCss(component                 )               {
  const animationName = `om-anim-${component.id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const selector = component.selector || `.om-c-${component.id}`;

  // ---- @keyframes ----
  const frames = [...component.keyframes].sort((a, b) => a.offset - b.offset);
  const kfLines           = [];
  for (const frame of frames) {
    const decls           = [];
    const transform = buildTransformString(frame.properties);
    if (transform) decls.push(`transform: ${transform};`);
    let filter                = null;
    for (const [prop, value] of Object.entries(frame.properties)) {
      if (prop === "blur") {
        filter = `blur(${formatValue("blur", value)})`;
        continue;
      }
      if (isTransformProperty(prop)) continue;
      decls.push(`${camelToKebab(prop)}: ${formatValue(prop         , value)};`);
    }
    if (filter) decls.push(`filter: ${filter};`);
    if (frame.easing && frame.easing.type !== "preset") {
      // per-keyframe easing (animation-timing-function inside keyframes)
      decls.push(`animation-timing-function: ${easingToCss(frame.easing)};`);
    }
    kfLines.push(`  ${percent(frame.offset)} { ${decls.join(" ")} }`);
  }
  const keyframesBlock = frames.length
    ? `@keyframes ${animationName} {\n${kfLines.join("\n")}\n}`
    : "";

  // ---- element rule ----
  const iteration =
    component.iterationCount === "infinite" ? "infinite" : String(component.iterationCount);
  const staticCss = styleToCss(component.style);
  const ruleDecls = [
    staticCss,
    `animation-name: ${frames.length ? animationName : "none"};`,
    `animation-duration: ${component.durationMs}ms;`,
    `animation-timing-function: ${easingToCss(component.easing)};`,
    `animation-delay: ${component.delayMs}ms;`,
    `animation-iteration-count: ${iteration};`,
    `animation-direction: ${component.direction};`,
    `animation-fill-mode: ${component.fillMode};`,
    `animation-play-state: ${component.playState};`,
  ].filter(Boolean);
  const ruleBlock = `${selector} { ${ruleDecls.join(" ")} }`;

  return { animationName, keyframesBlock, ruleBlock };
}

/** Generate the full stylesheet for a spec (all components). */
export function generateSpecCss(components                   )         {
  const blocks = components
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((c) => {
      const g = generateComponentCss(c);
      return [g.keyframesBlock, g.ruleBlock].filter(Boolean).join("\n");
    })
    .filter(Boolean);
  const main = blocks.join("\n\n");

  // Accessibility: respect the user's OS-level motion preference by disabling
  // all animations when prefers-reduced-motion is set.
  const selectors = components
    .map((c) => c.selector || `.om-c-${c.id}`)
    .filter(Boolean);
  if (selectors.length === 0) return main;

  const reducedMotion = `@media (prefers-reduced-motion: reduce) {\n  ${selectors.join(",\n  ")} {\n    animation: none !important;\n    transition: none !important;\n  }\n}`;

  return `${main}\n\n${reducedMotion}`;
}
