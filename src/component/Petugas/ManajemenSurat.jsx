import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { usePengajuan } from "../../context/PengajuanContext";
import Alert from "../Alert";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import Select from "react-select";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
);

export default function ManajemenSurat() {
  const [tab, setTab] = useState("masuk");
  const [loading, setLoading] = useState(false);
  const [dataSurat, setDataSurat] = useState([]);
  const [tabArsip, setTabArsip] = useState("eksternal");
  const { token, user, users } = usePengajuan();
  const [selectedData, setSelectedData] = useState(null);
  const [corporates, setCorporates] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const showAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeAlert(id), 3000);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };
  const filterStaff = users?.filter((usr) => {
    if (user.role == "super_admin" || user.role == "staff umum") {
      return usr.role !== "super_admin" && usr.role !== "staff_umum";
    } else {
      return usr.role !== user.role && usr.role !== "super_admin";
    }
  });

  // 1. Fungsi Fetch Data (GET)
  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = tab === "masuk" ? "/surat-masuk" : "/surat-keluar";
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api${endpoint}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      if (response.ok) {
        console.log(tab);
        if (user?.role == "super_admin" || user?.role == "staff umum") {
          setDataSurat(result);
        } else {
          const filterSurat = result?.filter(
            (data) => data.current_user == user.uuid,
          );
          setDataSurat(filterSurat);
        }
        console.log("result", result);
      } else {
        throw new Error(result.message || "Gagal mengambil data");
      }
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };
  async function getCorporate() {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/corporates`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();
    setCorporates(result);
  }

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchData();
    getCorporate();
  }, [tab]);

  const bulanLabel = [
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

  const suratPerBulan = React.useMemo(() => {
    const masuk = Array(12).fill(0);
    const keluar = Array(12).fill(0);

    dataSurat.forEach((item) => {
      const date = new Date(
        tab === "masuk" ? item.tanggal_terima : item.tanggal_buat,
      );
      const month = date.getMonth();
      if (tab === "masuk") masuk[month]++;
      else keluar[month]++;
    });

    return {
      labels: bulanLabel,
      datasets: [
        {
          label: "Surat Masuk",
          data: masuk,
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.1)",
          borderColor: "#36a2eb",
          tension: 0.4,
          pointRadius: 4,
        },
        {
          label: "Surat Keluar",
          data: keluar,
          fill: true,
          backgroundColor: "rgba(75, 214, 156, 0.1)",
          borderColor: "#0b9128",
          tension: 0.4,
          pointRadius: 4,
        },
      ],
    };
  }, [dataSurat, tab]);
  const suratPerInstansi = React.useMemo(() => {
    const map = {};
    dataSurat.forEach((item) => {
      const name = item.corporate?.name || "Tidak diketahui";
      map[name] = (map[name] || 0) + 1;
    });

    return {
      labels: Object.keys(map),
      datasets: [
        {
          data: Object.values(map),
          backgroundColor: [
            "#0d6efd",
            "#20c997",
            "#ffc107",
            "#dc3545",
            "#6f42c1",
          ],
        },
      ],
    };
  }, [dataSurat]);
  const sifatSurat = React.useMemo(() => {
    const sifat = { biasa: 0, penting: 0, rahasia: 0 };

    dataSurat.forEach((item) => {
      sifat[item.sifat]++;
    });

    return {
      labels: ["Biasa", "Penting", "Rahasia"],
      datasets: [
        {
          data: Object.values(sifat),
          backgroundColor: ["#0dcaf0", "#ffc107", "#dc3545"],
        },
      ],
    };
  }, [dataSurat]);
  // Helper untuk konversi format file
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(2) + " KB";
    const mb = kb / 1024;
    return mb.toFixed(2) + " MB";
  };

  // Logika Storage (Contoh)
  const LIMIT_STORAGE_GB = 25;
  const LIMIT_IN_BYTES = LIMIT_STORAGE_GB * 1024 * 1024 * 1024;
  // Hitung total dari dataSurat (asumsi field 'file_size' ada di setiap item)
  const totalUsedBytes = dataSurat.reduce(
    (acc, curr) => acc + (curr.file_size || 0),
    0,
  );
  const usagePercentage = ((totalUsedBytes / LIMIT_IN_BYTES) * 100).toFixed(2);

  return (
    <AdminLayout>
      <Alert alerts={alerts} removeAlert={removeAlert} />
      <div className="page-wrapper">
        <div className="page-content py-4">
          <div className="d-flex align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-0">Dashboard Surat</h4>
              <p className="text-muted mb-0 small">
                Dashboard / Surat {tab === "masuk" ? "Masuk" : "Keluar"}
              </p>
            </div>
          </div>
          <div className="nav nav-pills mb-4 bg-light p-1 rounded-3">
            <button
              onClick={() => setTab("masuk")}
              className={`nav-link w-50 rounded-3 py-2 ${tab === "masuk" ? "active shadow-sm" : "text-muted"}`}
            >
              <i className="bx bx-download me-2"></i>Surat Masuk
            </button>
            <button
              onClick={() => setTab("keluar")}
              className={`nav-link w-50 rounded-3 py-2 ${tab === "keluar" ? "active shadow-sm" : "text-muted"}`}
            >
              <i className="bx bx-upload me-2"></i>Surat Keluar
            </button>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary me-3">
                    <i className="bx bx-envelope fs-3"></i>
                  </div>
                  <div>
                    <small className="text-muted">Total Surat {tab}</small>
                    <h4 className="fw-bold">{dataSurat.length}</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger me-3">
                    <i className="bx bx-error-circle fs-3"></i>
                  </div>
                  <div>
                    <small className="text-muted">Surat Penting/Rahasia</small>
                    <h4 className="fw-bold text-danger">
                      {sifatSurat.datasets[0].data[1] +
                        sifatSurat.datasets[0].data[2]}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success me-3">
                    <i className="bx bx-buildings fs-3"></i>
                  </div>
                  <div>
                    <small className="text-muted">Jumlah Instansi</small>
                    <h4 className="fw-bold">
                      {suratPerInstansi.labels.length}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-dark text-white">
                <small className="text-white-50">
                  Penyimpanan Sistem (Limit 25GB)
                </small>
                <div className="d-flex align-items-end justify-content-between mb-1 mt-2">
                  <h5 className="fw-bold mb-0">{formatSize(totalUsedBytes)}</h5>
                  <small>{usagePercentage}%</small>
                </div>
                <div
                  className="progress"
                  style={{
                    height: "6px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className={`progress-bar ${usagePercentage > 80 ? "bg-danger" : "bg-success"}`}
                    role="progressbar"
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">📈 Statistik Surat per Bulan</h6>
                  <div style={{ height: "300px" }}>
                    <Line
                      data={suratPerBulan}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { beginAtZero: true, grid: { display: false } },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">🏢 Distribusi Instansi</h6>
                  <div style={{ height: "300px" }}>
                    <Doughnut
                      data={suratPerInstansi}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: "bottom" } },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">🚦 Sifat Surat</h6>
                  <Doughnut data={sifatSurat} />
                </div>
              </div> */}
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
