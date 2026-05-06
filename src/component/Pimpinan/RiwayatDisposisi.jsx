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

export default function RiwayatDisposisi() {
  const { token } = useContext(PengajuanContext);
  const [loading, setLoading] = useState(false);
  const [disposisiList, setDisposisiList] = useState([]);

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
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/disposisi/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.ok) {
          const data = await response.json(); // Konversi body menjadi JSON
          alert(data.message);
          fetchData(); // Panggil fungsi refresh data Anda
        }
      } catch (err) {
        alert("Gagal menghapus data");
      }
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
                            onClick={() => handleDelete(item.uuid)}
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
    </AdminLayout>
  );
}
