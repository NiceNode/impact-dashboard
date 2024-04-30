export const Table = ({ title, data, dataKey = "", renderRow }) => {
  const headingLabel = dataKey === "clients" ? "Share" : "Nodes";
  return (
    <div className="table-section">
      <h3>{title}</h3>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">Name</div>
          <div className="table-cell">{headingLabel}</div>
        </div>
        {data.map(renderRow)}
      </div>
    </div>
  );
};

export const Tables = ({ children }) => (
  <section id="tables">{<>{children}</>}</section>
);
