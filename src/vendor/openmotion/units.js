// OpenMotion, Copyright (c) 2026 Yuan-Man. MIT. See LICENSE.
                                                            
import { isTransformProperty } from "./transform.js";
                                                   

/** Default unit per property (numbers get this appended; strings pass through). */
const UNITS                                             = {
  translateX: "px",
  translateY: "px",
  translateZ: "px",
  scale: "",
  scaleX: "",
  scaleY: "",
  rotate: "deg",
  rotateX: "deg",
  rotateY: "deg",
  rotateZ: "deg",
  skewX: "deg",
  skewY: "deg",
  opacity: "",
  borderRadius: "px",
  width: "px",
  height: "px",
  fontSize: "px",
  letterSpacing: "px",
  blur: "px",
  color: "",
  backgroundColor: "",
  boxShadow: "",
};

export function formatValue(prop                   , value          )         {
  if (typeof value === "string") return value;
  const unit = UNITS[prop] ?? "";
  return `${value}${unit}`;
}

/** Build a CSS `transform` string from transform-family properties present in a frame. */
export function buildTransformString(
  props                                              ,
)                {
  const order                      = [
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skewX",
    "skewY",
  ];
  const parts           = [];
  for (const p of order) {
    const v = props[p];
    if (v === undefined) continue;
    parts.push(`${p}(${formatValue(p, v)})`);
  }
  return parts.length ? parts.join(" ") : null;
}

export function isFilterProperty(p        )          {
  return p === "blur";
}

export { isTransformProperty };
