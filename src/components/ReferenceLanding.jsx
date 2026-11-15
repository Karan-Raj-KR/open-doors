import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  Accessibility,
  VolumeX,
  Armchair,
  TramFront,
  DoorOpen,
} from "lucide-react";
const covers = [
  ["music", "FEEL THE\nRHYTHM.", "#f3472e"],
  ["pottery", "MAKE\nSOMETHING.", "#ffcc30"],
  ["books", "GOOD\nSTORIES.", "#c8b9e9"],
  ["sketch", "A LITTLE\nWONDER.", "#177bdf"],
  ["food", "COME\nTOGETHER.", "#ee7899"],
  ["garden", "TAKE IT\nSLOW.", "#3d9167"],
];
function Poster({ item, index, onClick }) {
  return (
    <button
      className={"art-poster poster-" + index}
      onClick={onClick}
      style={{ "--poster-color": item[2], "--i": index }}
      aria-label={
        "Explore " + item[1].replace("\n", " ").toLowerCase() + " events"
      }
    >
      <img src={"/images/" + item[0] + ".jpg"} alt="" />
      <span className="poster-edition">OPEN DOORS / BENGALURU</span>
      <strong>{item[1]}</strong>
      <span className="poster-bottom">
        A GOOD DAY IS WAITING <ArrowUpRight size={17} />
      </span>
    </button>
  );
}
export default function ReferenceLanding({ events, onSelect, onProfile }) {
  const stage = useRef(null);
  useEffect(() => {
    let frame;
    const el = stage.current;
    const update = () => {
      frame = undefined;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / (el.offsetHeight - innerHeight)),
      );
      el.style.setProperty("--journey", progress);
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", scroll, { passive: true });
    return () => {
      removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  const explore = (i) => {
    const e = events.find((e) => e.image === covers[i][0]);
    if (e) onSelect(e._id);
    else
      document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <section className="reference-hero">
        <h1>
          A place to find
          <br />
          your kind of day.
        </h1>
        <div className="card-fan">
          {covers.map((item, i) => (
            <Poster
              key={item[0]}
              item={item}
              index={i}
              onClick={() => explore(i)}
            />
          ))}
        </div>
        <p>
          Good people. Shared moments.
          <br />A city with room for you.
        </p>
        <a href="#events" className="reference-link">
          Explore your city <ArrowDown size={15} />
        </a>
      </section>
      <section className="stack-journey" ref={stage}>
        <div className="journey-sticky">
          <div className="journey-heading">
            <span>COMMUNITY, WITHOUT THE GUESSWORK</span>
            <h2>
              Discover, connect
              <br />
              <em>& feel at home.</em>
            </h2>
          </div>
          <div className="journey-stack">
            {covers.map((item, i) => (
              <Poster
                key={item[0]}
                item={item}
                index={i}
                onClick={() => explore(i)}
              />
            ))}
          </div>
          <p className="journey-caption">
            Your next favourite memory
            <br />
            starts with an open door.
          </p>
        </div>
      </section>
      <section className="orange-showcase">
        <div className="showcase-top">
          <h2>
            Your gateway
            <br />
            to good company.
          </h2>
          <p>
            Know the space.
            <br />
            Find your people.
            <br />
            Go on your terms.
          </p>
        </div>
        <button className="showcase-image" onClick={() => explore(0)}>
          <img
            src="/images/hero.jpg"
            alt="Friends enjoying a day outdoors together"
          />
          <span className="showcase-word">
            COME AS
            <br />
            YOU ARE.
          </span>
          <span className="showcase-action">
            Find your next gathering <ArrowUpRight size={22} />
          </span>
        </button>
      </section>
      <section className="diagonal-section">
        <div className="diagonal-copy">
          <span>A DIFFERENT KIND OF INVITATION</span>
          <h2>
            Every good day
            <br />
            has a story.
          </h2>
          <p>
            From clay-covered hands to an unhurried walk. Make space for
            something that makes you feel more like you.
          </p>
          <button onClick={onProfile}>
            Make it your kind of day <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="diagonal-cards">
          {covers.slice(0, 5).map((item, i) => (
            <Poster
              key={item[0]}
              item={item}
              index={i}
              onClick={() => explore(i)}
            />
          ))}
        </div>
      </section>
      <section className="access-statement">
        <h2>
          A little clarity.
          <br />A lot more possibility.
        </h2>
        <div>
          <p>
            The entrance. The sound. The journey there. Choose what matters to
            you, then find events that fit.
          </p>
          <button className="reference-link" onClick={onProfile}>
            Build your access profile <ArrowUpRight size={16} />
          </button>
          <div className="statement-icons">
            <Accessibility />
            <VolumeX />
            <Armchair />
            <TramFront />
          </div>
        </div>
      </section>
    </>
  );
}
export function ReferenceCommunity({ onProfile, onExplore }) {
  return (
    <>
      <section className="reference-community">
        <div className="community-tiles top">
          {[...covers, ...covers].map((item, i) => (
            <img
              key={i}
              src={"/images/" + item[0] + ".jpg"}
              alt=""
              style={{ "--i": i }}
              loading="lazy"
            />
          ))}
        </div>
        <div className="community-center">
          <DoorOpen size={27} />
          <h2>
            You will find yourself
            <br />
            among us.
          </h2>
          <p>
            A shared table. A familiar face. A place to belong.
            <br />
            There is a little something here for everyone.
          </p>
          <button onClick={onExplore}>
            Find your community <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="community-tiles bottom">
          {[...covers.slice().reverse(), ...covers].map((item, i) => (
            <img
              key={i}
              src={"/images/" + item[0] + ".jpg"}
              alt=""
              style={{ "--i": i }}
              loading="lazy"
            />
          ))}
        </div>
      </section>
      <section className="lime-invitation">
        <div className="lime-line">
          Inspired by people. <span>Made for belonging.</span>
        </div>
        <div className="lime-main">
          <h2>
            Your city.
            <br />
            Wide open.
          </h2>
          <button onClick={onProfile}>
            Find your fit <ArrowUpRight size={23} />
          </button>
        </div>
        <div className="lime-symbols" aria-hidden="true">
          <Accessibility />
          <Armchair />
          <TramFront />
          <DoorOpen />
        </div>
      </section>
    </>
  );
}
