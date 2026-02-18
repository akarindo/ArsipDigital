const SkeletonItem = () => (
  <div
    className="customers-list-item rounded bg-white p-3 mb-3"
    style={{ opacity: 0.6 }}
  >
    <div className="d-flex align-items-center justify-content-between mb-3">
      <div className="d-flex align-items-center">
        <div
          className="skeleton-box"
          style={{ width: 60, height: 60, borderRadius: 8, background: "#eee" }}
        ></div>
        <div className="ms-3">
          <div
            className="skeleton-line"
            style={{
              width: 150,
              height: 15,
              background: "#eee",
              marginBottom: 8,
            }}
          ></div>
          <div
            className="skeleton-line"
            style={{ width: 100, height: 10, background: "#eee" }}
          ></div>
        </div>
      </div>
      <div
        className="skeleton-box"
        style={{ width: 120, height: 35, borderRadius: 10, background: "#eee" }}
      ></div>
    </div>
    <div className="row">
      <div className="col-4">
        <div
          className="skeleton-line mb-2"
          style={{ width: "80%", height: 12, background: "#eee" }}
        ></div>
        <div
          className="skeleton-line mb-2"
          style={{ width: "60%", height: 12, background: "#eee" }}
        ></div>
      </div>
      <div className="col-4">
        <div
          className="skeleton-line mb-2"
          style={{ width: "80%", height: 12, background: "#eee" }}
        ></div>
        <div
          className="skeleton-line mb-2"
          style={{ width: "60%", height: 12, background: "#eee" }}
        ></div>
      </div>
      <div className="col-4">
        <div
          className="skeleton-line mb-2"
          style={{ width: "80%", height: 12, background: "#eee" }}
        ></div>
        <div
          className="skeleton-line mb-2"
          style={{ width: "60%", height: 12, background: "#eee" }}
        ></div>
      </div>
    </div>
    <style>{`
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.4; }
        100% { opacity: 1; }
      }
      .skeleton-box, .skeleton-line {
        animation: pulse 1.5s infinite ease-in-out;
      }
    `}</style>
  </div>
);
export default SkeletonItem;
