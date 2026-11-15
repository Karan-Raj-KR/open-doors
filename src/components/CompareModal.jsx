import { ArrowUpRight, X, Info, CheckCircle2 } from "lucide-react";
import { accessOptions } from "../../server/data.js";
import { money, date, time } from "../lib.js";
import Icon from "./Icon.jsx";
import Modal from "./Modal.jsx";

export default function CompareModal({ events, needs, onClose, onSelect }) {
  return (
    <Modal title="Side by side. On your terms." wide onClose={onClose}>
      <div className="comparison-body">
        <div className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</div>
        <h2>Which day feels like you?</h2>
        <p>
          Compare the practical details. Your selected needs are highlighted.
        </p>
        <div className="comparison-scroll">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Your next good day</th>
                {events.map((e) => (
                  <th scope="col" key={e._id}>
                    <img
                      src={`/images/${e.image}.jpg`}
                      alt=""
                      width="260"
                      height="150"
                    />
                    <button onClick={() => onSelect(e._id)}>
                      {e.title}
                      <ArrowUpRight size={17} />
                    </button>
                    <small>
                      {date(e.date, { day: "numeric", month: "short" })} at{" "}
                      {time(e.date)}
                    </small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accessOptions.map((a) => (
                <tr
                  className={needs.includes(a.key) ? "priority" : ""}
                  key={a.key}
                >
                  <th scope="row">
                    <Icon name={a.key} />
                    <span>
                      {a.label}
                      {needs.includes(a.key) && (
                        <small>One of your needs</small>
                      )}
                    </span>
                  </th>
                  {events.map((e) => (
                    <td key={e._id}>
                      {e.access[a.key] === true ? (
                        <span className="yes">
                          <CheckCircle2 size={17} />
                          Available
                        </span>
                      ) : e.access[a.key] === false ? (
                        <span>
                          <X size={17} />
                          Not available
                        </span>
                      ) : (
                        <span>
                          <Info size={17} />
                          Unconfirmed
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row">Price</th>
                {events.map((e) => (
                  <td key={e._id}>{money(e.price)}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Venue</th>
                {events.map((e) => (
                  <td key={e._id}>
                    {e.venue}
                    <small>{e.area}</small>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="privacy-note">
          <Info size={16} />
          Illustrative organiser information. Unknown access is never treated as
          a confirmed feature.
        </div>
      </div>
    </Modal>
  );
}
