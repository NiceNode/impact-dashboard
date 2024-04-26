export const Table = ({ title, data, dataKey, countSuffix = "" }) => {
  const headingLabel = countSuffix === "%" ? "Share" : "Count";
  console.log(title + " " + headingLabel);
  return (
    <div className="table-section">
      <h3>{title}</h3>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">Name</div>
          <div className="table-cell">{headingLabel}</div>
        </div>
        {data.map((rowData) => (
          <div className="table-row" key={rowData.name}>
            <div
              style={{
                backgroundImage: `url("../images/${rowData.name}.png")`,
              }}
              className={`table-cell ${dataKey !== "networks" ? "client" : ""}`}
            >
              {rowData.name}
            </div>
            <div className="table-cell">
              {rowData.count}
              {countSuffix}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Tables = ({ children }) => (
  <section id="tables">{<>{children}</>}</section>
);
