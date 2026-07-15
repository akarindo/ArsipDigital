export default function Alert({ alerts, removeAlert }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minWidth: "300px",
      }}
    >
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            background:
              alert.type === "success"
                ? "#dcfce7"
                : alert.type === "info"
                  ? "#dbeafe"
                  : "#fee2e2",
            borderLeft: `4px solid ${
              alert.type === "success"
                ? "#16a34a"
                : alert.type === "info"
                  ? "#2563eb"
                  : "#dc2626"
            }`,
            borderRadius: "12px",
            padding: "14px 16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            animation: "slideIn 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background:
                alert.type === "success"
                  ? "#16a34a"
                  : alert.type === "info"
                    ? "#2563eb"
                    : "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i
              className={`bx ${
                alert.type === "success"
                  ? "bx-check"
                  : alert.type === "info"
                    ? "bx-edit"
                    : "bx-trash"
              } text-white`}
              style={{ fontSize: "16px" }}
            ></i>
          </div>

          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontWeight: "700",
                fontSize: "13px",
                color:
                  alert.type === "success"
                    ? "#15803d"
                    : alert.type === "info"
                      ? "#1d4ed8"
                      : "#b91c1c",
              }}
            >
              {alert.title}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#555",
                marginTop: "2px",
              }}
            >
              {alert.message}
            </p>
          </div>

          <button
            onClick={() => removeAlert(alert.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "#999",
              fontSize: "16px",
            }}
          >
            <i className="bx bx-x"></i>
          </button>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "3px",
              background:
                alert.type === "success"
                  ? "#16a34a"
                  : alert.type === "info"
                    ? "#2563eb"
                    : "#dc2626",
              animation: "shrink 3s linear forwards",
            }}
          />
        </div>
      ))}
    </div>
  );
}
