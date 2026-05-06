import React, { useEffect, useState, useContext, useMemo } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { PengajuanContext } from "../../context/PengajuanContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
);

function Alert({ alerts, removeAlert }) {
  return (
    <div style={{
      position: "fixed", top: "20px", right: "20px", zIndex: 9999,
      display: "flex", flexDirection: "column", gap: "10px", minWidth: "300px",
    }}>
      {alerts.map((alert) => (
        <div key={alert.id} style={{
          background: alert.type === "success" ? "#dcfce7" : alert.type === "info" ? "#dbeafe" : "#fee2e2",
          borderLeft: `4px solid ${alert.type === "success" ? "#16a34a" : alert.type === "info" ? "#2563eb" : "#dc2626"}`,
          borderRadius: "12px", padding: "14px 16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          display: "flex", alignItems: "flex-start", gap: "12px",
          animation: "slideIn 0.3s ease", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: alert.type === "success" ? "#16a34a" : alert.type === "info" ? "#2563eb" : "#dc2626",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <i className={`bx ${alert.type === "success" ? "bx-check" : alert.type === "info" ? "bx-edit" : "bx-trash"} text-white`} style={{ fontSize: "16px" }}></i>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: "700", fontSize: "13px",
              color: alert.type === "success" ? "#15803d" : alert.type === "info" ? "#1d4ed8" : "#b91c1c",
            }}>{alert.title}</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#555", marginTop: "2px" }}>{alert.message}</p>
          </div>
          <button onClick={() => removeAlert(alert.id)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#999", fontSize: "16px" }}>
            <i className="bx bx-x"></i>
          </button>
          <div style={{
            position: "absolute", bottom: 0, left: 0, height: "3px",
            background: alert.type === "success" ? "#16a34a" : alert.type === "info" ? "#2563eb" : "#dc2626",
            animation: "shrink 3s linear forwards",
          }} />
        </div>
      ))}
    </div>
  );
}

export default function RiwayatDisposisi() {
  const { token } = useContext(PengajuanContext);
  const [loading, setLoading] = useState(false);
  const [disposisiList, setDisposisiList] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
    const showAlert = (type, title, message) => {
      const id = Date.now();
      setAlerts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => removeAlert(id), 3000);
    };
  
    const removeAlert = (id) => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/disposisi`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      console.log("data", data);
      if (res.ok) setDisposisiList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState(null);
    const getDeleteModal = () => {
      const modalEl = document.getElementById("modalKonfirmasiHapusRiwayat");
      return window.bootstrap.Modal.getOrCreateInstance(modalEl);
    };
    const handleOpenDeleteModal = (id, type) => {
      setDeleteTarget({ id, type });
      getDeleteModal().show();
    };
    const handleConfirmDelete = async () => {
      if (!deleteTarget) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/disposisi/${deleteTarget.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.ok) {
          const data = await response.json();
          getDeleteModal().hide();
          fetchData();
          showAlert("danger", "Dihapus!", `Data berhasil dihapus.`);
          setDeleteTarget(null);
        }
      } catch (err) {
        showAlert("danger", "Gagal!", "Gagal menghapus data");
      }
    };

  

  useEffect(() => {
    fetchData();
  }, [token]);

  /* =======================
     📈 CHART: DISPOSISI / BULAN
  ======================= */
  const monthlyStats = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const counts = Array(12).fill(0);

    disposisiList?.forEach((item) => {
      const date = new Date(item.created_at);
      counts[date.getMonth()]++;
    });

    return {
      labels: months,
      datasets: [
        {
          label: "Jumlah Disposisi",
          data: counts,
          fill: true,
          backgroundColor: "rgba(78,115,223,.1)",
          borderColor: "#4e73df",
          tension: 0.4,
        },
      ],
    };
  }, [disposisiList]);

  /* =======================
     🍩 PRIORITAS
  ======================= */
  const priorityStats = useMemo(() => {
    const map = { biasa: 0, segera: 0, penting: 0 };
    disposisiList?.forEach((d) => map[d.skala_prioritas]++);
    return {
      labels: ["Biasa", "Segera", "Penting"],
      datasets: [
        {
          data: Object.values(map),
          backgroundColor: ["#36b9cc", "#f6c23e", "#e74a3b"],
        },
      ],
    };
  }, [disposisiList]);

  return (
    <AdminLayout>
      <Alert alerts={alerts} removeAlert={removeAlert} />
      <div className="page-wrapper">
        <div className="page-content py-4 bg-light">
          {/* HEADER */}
          <div className="mb-4">
            <h3 className="fw-bold">Riwayat Disposisi</h3>
            <p className="text-muted">
              Histori disposisi surat yang telah diteruskan.
            </p>
          </div>

          {/* KPI */}
          <div className="row g-3 mb-4">
            {[
              { label: "Total Disposisi", value: disposisiList?.length },
              {
                label: "Prioritas Penting",
                value: disposisiList?.filter(
                  (d) => d.skala_prioritas === "penting",
                ).length,
              },
              //   {
              //     label: "Surat",
              //     value: [...new Set(disposisiList?.map((d) => d.arsip?.uuid))]
              //       .length,
              //   },
            ].map((item, i) => (
              <div className="col-md-4" key={i}>
                <div className="card border-0 shadow-sm rounded-4 p-3">
                  <small className="text-muted">{item.label}</small>
                  <h4 className="fw-bold">{item.value}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* CHART */}
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold mb-3">Tren Disposisi</h6>
                <Line data={monthlyStats} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold mb-3">Skala Prioritas</h6>
                <Doughnut data={priorityStats} />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th>No</th>
                    <th>Surat</th>
                    <th>Status</th>
                    <th>Tujuan</th>
                    <th>Tindak Lanjut</th>
                    <th>Prioritas</th>
                    <th>Batas Waktu</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        Memuat data...
                      </td>
                    </tr>
                  ) : disposisiList?.length ? (
                    disposisiList?.map((item, i) => (
                      <tr key={item.uuid}>
                        <td>{i + 1}</td>
                        <td>
                          <div className="fw-bold">
                            {item.surat?.no_registrasi}
                          </div>
                          <small className="text-muted">
                            {item.arsip?.perihal}
                          </small>
                        </td>
                        <td>
                          {item.tanggal_direspon
                            ? `Di terima tanggal ${item.tanggal_direspon}`
                            : "belum diterima"}
                        </td>
                        <td>{item.user?.name}</td>
                        <td>{item.tindak_lanjut}</td>
                        <td>
                          <span
                            className={`badge rounded-pill bg-${
                              item.skala_prioritas === "penting"
                                ? "danger"
                                : item.skala_prioritas === "segera"
                                  ? "warning"
                                  : "info"
                            }`}
                          >
                            {item.skala_prioritas}
                          </span>
                        </td>
                        <td>{item.batas_waktu}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-secondary shadow-none"
                            onClick={() => handleOpenDeleteModal(item.uuid)}
                          >
                            <i className="bx bx-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        Belum ada riwayat disposisi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Hapus */}
      <div className="modal fade" id="modalKonfirmasiHapusRiwayat" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "20px" }}>
            <div className="modal-body p-4 text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: "64px", height: "64px", background: "#fff0f0" }}
              >
                <i className="bx bx-trash text-danger" style={{ fontSize: "28px" }}></i>
              </div>
              <h5 className="fw-bold mb-1">Hapus Data?</h5>
              <p className="text-muted small mb-0">
                Data surat ini akan dihapus secara permanen dan tidak dapat dikembalikan.
              </p>
            </div>
            <div className="modal-footer border-0 pb-4 px-4 d-flex gap-2">
              <button
                type="button"
                className="btn btn-light flex-grow-1 py-2"
                data-bs-dismiss="modal"
                style={{ borderRadius: "10px" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn btn-danger flex-grow-1 py-2"
                style={{ borderRadius: "10px" }}
              >
                <i className="bx bx-trash me-1"></i> Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </AdminLayout>
  );
}
