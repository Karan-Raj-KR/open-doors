import { useEffect, Children, isValidElement, cloneElement } from "react";
import { motionCss, motionEase, feedbackEase } from "./recipes.js";

/** Connect OpenMotion's generated recipes to real React components as they mount. */
export default function OpenMotion({ children }) {
  useEffect(() => {
    const style = document.createElement("style");
    style.dataset.openmotion = "generated";
    style.textContent = motionCss;
    document.head.append(style);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet();
    const running = new Set();
    const disabled = () =>
      media.matches || document.documentElement.classList.contains("comfort");
    const reveal = (el) => {
      el.classList.remove("om-pending");
      el.classList.add("om-visible");
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            reveal(target);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -24px 0px" },
    );
    const selectors = [
      [".om-kinetic", "kinetic"],
      [".showcase-image > img", "image"],
      [
        ".event-card, .mission-grid > button, .profile-option, .access-check, .organiser-list > article, .paired-invitations > article, .access-edit > label, .comparison-table tbody tr",
        "tile",
      ],
      [
        ".reference-hero > p, .hero-actions, .journey-heading > *, .showcase-top > *, .connecting-statement > *, .access-statement > h2, .access-statement > div > p, .community-center > *, .section-heading, .browse-controls, .results-bar, .form > label, .form-two > label, .form-four > label, .venue-guide, .updates-list > article, .confirmation-ticket, .lime-main > *, .site-header, footer > *",
        "reveal",
      ],
    ];
    function discover() {
      for (const [selector, recipe] of selectors)
        document.querySelectorAll(selector).forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          el.dataset.omRecipe = recipe;
          if (!el.style.getPropertyValue("--om-delay")) {
            const peers = Array.from(el.parentElement?.children || []);
            el.style.setProperty(
              "--om-delay",
              Math.min(peers.indexOf(el), 5) * 55 + "ms",
            );
          }
          if (disabled()) {
            reveal(el);
            return;
          }
          el.classList.add("om-pending");
          observer.observe(el);
        });
    }
    discover();
    const mutations = new MutationObserver(discover);
    mutations.observe(document.getElementById("root"), {
      childList: true,
      subtree: true,
    });
    function cancelMotion() {
      if (disabled()) {
        document.querySelectorAll(".om-pending").forEach(reveal);
        running.forEach((a) => a.cancel());
        running.clear();
      }
    }
    media.addEventListener("change", cancelMotion);
    function press(event) {
      if (disabled() || event.button !== 0) return;
      const button = event.target.closest("button,.primary,.outline");
      if (!button || button.disabled) return;
      // Independent scale leaves carousel/card/fixed-position transforms intact.
      const animation = button.animate(
        [{ scale: 1 }, { scale: 0.97 }, { scale: 1 }],
        { duration: 220, easing: motionEase },
      );
      running.add(animation);
      animation.finished
        .catch(() => {})
        .finally(() => running.delete(animation));
    }
    function feedback(event) {
      if (disabled() || event.detail === 0) return;
      const button = event.target.closest(
        ".save-event,.need-chip,.category,.view-switch button",
      );
      const icon = button?.querySelector("svg");
      if (!icon) return;
      const animation = icon.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.08)", offset: 0.3 },
          { transform: "scale(.98)", offset: 0.65 },
          { transform: "scale(1)" },
        ],
        { duration: 300, easing: feedbackEase },
      );
      running.add(animation);
      animation.finished
        .catch(() => {})
        .finally(() => running.delete(animation));
    }
    document.addEventListener("pointerdown", press);
    document.addEventListener("click", feedback);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      style.remove();
      media.removeEventListener("change", cancelMotion);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("click", feedback);
      running.forEach((a) => a.cancel());
      document
        .querySelectorAll(".om-pending")
        .forEach((el) => el.classList.remove("om-pending"));
    };
  }, []);
  return children;
}

/** Word clipping keeps OpenMotion's kinetic entrances inside each heading line. */
export function MotionText({ as: Tag = "h2", children, ...props }) {
  let index = 0;
  const words = (nodes) =>
    Children.map(nodes, (child) => {
      if (typeof child === "string")
        return child.split(/(\s+)/).map((word, i) =>
          /^\s+$/.test(word) ? (
            word
          ) : (
            <span className="om-word-window" key={i}>
              <span
                className="om-kinetic"
                style={{ "--om-delay": Math.min(index++, 8) * 60 + "ms" }}
              >
                {word}
              </span>
            </span>
          ),
        );
      if (isValidElement(child) && child.props.children)
        return cloneElement(child, {}, words(child.props.children));
      return child;
    });
  return <Tag {...props}>{words(children)}</Tag>;
}
