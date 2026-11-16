import { MotionText } from "../motion/OpenMotion.jsx";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
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
  const [slide, setSlide] = useState(0);
  const [missionTab, setMissionTab] = useState("events");
  const slideEvent = events.find((event) => event.image === covers[slide][0]);
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
        <MotionText as="h1">
          A place to find
          <br />
          your kind of day.
        </MotionText>
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
        <div className="hero-actions">
          <a href="#events" className="primary">
            Explore events <ArrowUpRight size={14} />
          </a>
          <button className="reference-link" onClick={onProfile}>
            Find your fit <ArrowDown size={14} />
          </button>
        </div>
      </section>
      <section className="stack-journey" ref={stage}>
        <div className="journey-sticky">
          <div className="journey-heading">
            <span>COMMUNITY, WITHOUT THE GUESSWORK</span>
            <MotionText>
              Discover,
              <br />
              <em>connect,</em>
              <br />& feel at home.
            </MotionText>
            <p className="intro-description">
              A gathering for every pace.
              <br />
              Find something you love, with the
              <br />
              access information you need.
            </p>
            <a className="primary" href="#events">
              Find your people <ArrowUpRight size={14} />
            </a>
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
          <MotionText>
            Your gateway
            <br />
            to good company.
          </MotionText>
          <p>
            Know the space.
            <br />
            Find your people.
            <br />
            Go on your terms.
          </p>
        </div>
        <div
          className="showcase-image"
          style={{ "--showcase-color": covers[slide][2] }}
        >
          <img
            key={slide}
            src={"/images/" + covers[slide][0] + ".jpg"}
            alt={slideEvent?.title || "Illustrative community event"}
          />
          <span className="showcase-small-label">
            {slideEvent?.title || "Find your next gathering"}
          </span>
          <button className="showcase-open" onClick={() => explore(slide)}>
            Explore event <ArrowUpRight size={14} />
          </button>
          <div
            className="showcase-pagination"
            aria-label="Featured event carousel"
          >
            <button
              onClick={() => setSlide((v) => (v + 5) % 6)}
              aria-label="Previous featured event"
            >
              <ArrowLeft size={18} />
            </button>
            <span aria-live="polite">{slide + 1} / 6</span>
            <button
              onClick={() => setSlide((v) => (v + 1) % 6)}
              aria-label="Next featured event"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
      <section className="diagonal-section">
        <div className="connecting-statement">
          <MotionText>
            Whether you come for a new skill
            <br />
            or a little good company,
            <br />
            <em className="reference-accent">there is room for you.</em>
          </MotionText>
        </div>
        <div className="diagonal-cards">
          {covers.map((item, i) => (
            <Poster
              key={item[0]}
              item={item}
              index={i + 1}
              onClick={() => explore(i)}
            />
          ))}
          <div className="diagonal-info">
            <DoorOpen size={24} />
            <h3>
              Where people
              <br />
              meet possibility.
            </h3>
            <span>OPEN DOORS</span>
            <p>
              A little more information.
              <br />A lot less wondering.
            </p>
            <button onClick={onProfile}>
              Your access profile <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </section>
      <section className="access-statement">
        <MotionText>
          A little clarity.
          <br />A lot more possibility.
        </MotionText>
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
        <div className="mission-folder">
          <div
            className="folder-tabs"
            role="group"
            aria-label="Explore community information"
          >
            <button
              aria-pressed={missionTab === "events"}
              onClick={() => setMissionTab("events")}
            >
              Community events <span>↗</span>
            </button>
            <button
              aria-pressed={missionTab === "access"}
              onClick={() => setMissionTab("access")}
            >
              Your access needs <span>↗</span>
            </button>
          </div>
          {missionTab === "events" ? (
            <div className="mission-grid">
              {covers.map((item, i) => (
                <button
                  key={item[0]}
                  onClick={() => explore(i)}
                  aria-label={"Explore " + item[0] + " event"}
                >
                  <img src={"/images/" + item[0] + ".jpg"} alt="" />
                  <span>
                    {events.find((e) => e.image === item[0])?.title || item[0]}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mission-needs">
              {[
                [Accessibility, "Step-free routes"],
                [VolumeX, "Lower noise"],
                [Armchair, "Room to sit"],
                [TramFront, "An easier journey"],
              ].map(([I, label]) => (
                <button key={label} onClick={onProfile}>
                  <I size={25} />
                  {label}
                  <ArrowUpRight size={16} />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
export function ReferenceCommunity({ onProfile, onExplore }) {
  const [paused, setPaused] = useState(false);
  return (
    <>
      <section
        className={"reference-community " + (paused ? "motion-paused" : "")}
      >
        <button
          className="pause-tiles"
          aria-label={
            paused
              ? "Play community image motion"
              : "Pause community image motion"
          }
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
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
          <MotionText>
            You will find yourself
            <br />
            among us.
          </MotionText>
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
    </>
  );
}
export function ReferenceClosing({ onProfile, onOrganiser }) {
  return (
    <>
      <section className="lime-invitation">
        <div className="lime-line">
          Inspired by people. <span>Made for belonging.</span>
        </div>
        <div className="lime-main">
          <MotionText>
            Your city.
            <br />
            Wide open.
          </MotionText>
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
      <section className="paired-invitations">
        <article className="attendee-invite">
          <img src="/images/hero.jpg" alt="Friends enjoying time outdoors" />
          <div>
            <DoorOpen size={26} />
            <MotionText>
              Find a place.
              <br />
              Feel at home.
            </MotionText>
            <p>
              Choose the access details that matter to you. Discover a day that
              fits.
            </p>
            <button onClick={onProfile}>
              Find your fit <ArrowUpRight size={15} />
            </button>
          </div>
        </article>
        <article className="organiser-invite">
          <img src="/images/pottery.jpg" alt="Hands shaping a clay pot" />
          <div>
            <DoorOpen size={26} />
            <MotionText>
              Open a door.
              <br />
              Bring people together.
            </MotionText>
            <p>
              Share your gathering, the practical details, and a welcome that
              makes room.
            </p>
            <button onClick={onOrganiser}>
              For organisers <ArrowUpRight size={15} />
            </button>
          </div>
        </article>
      </section>
    </>
  );
}
