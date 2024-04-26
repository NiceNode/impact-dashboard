import React from "react";

const Introduction = ({ nodeCount, countryCount, clientType = "" }) => {
  let content;

  if (clientType == "") {
    content = (
      <h1 className="headline-primary">
        There are currently
        <span className="headline-node">
          {" " + (nodeCount || 0)} nodes
        </span>{" "}
        running across
        <span className="headline-countries">
          {" " + countryCount} countries
        </span>
        .
      </h1>
    );
  } else {
    content = (
      <>
        <h1 className="headline-primary client">{clientType}</h1>
        <div className="headline-secondary client">
          Currently
          <span className={`headline-node client ${clientType}`}>
            {" " + (nodeCount ?? 0)} {clientType} nodes
          </span>{" "}
          across
          <span className="headline-countries">
            {" " + countryCount} countries
          </span>
          .
        </div>
      </>
    );
  }

  return (
    <section id="top">
      <div
        className={`headerTextContainer ${clientType !== "" ? "client" : ""}`}
      >
        {content}
      </div>
    </section>
  );
};

export default Introduction;
