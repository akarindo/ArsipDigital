import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { PengajuanContext } from "../../context/PengajuanContext";
import AdminLayout from "../layouts/AdminLayout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

// Registrasi ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export default function DisposisiSurat() {
  const { users, token } = useContext(PengajuanContext);
  const [suratMasukList, setSuratMasukList] = useState([]);
  const [loading, setLoading] = useState(false);
  const filterStaff = users?.filter(
    (user) => user.role == "pegawai" || user.role == "hrd",
  );

  const [selectedSurat, setSelectedSurat] = useState(null);
  const [formDisposisi, setFormDisposisi] = useState({
    arsip_uuid: "",
    user_id: "",
    tindak_lanjut: "",
    skala_prioritas: "biasa",
    intruksi: "",
    batas_waktu: "", // Sekarang akan mendukung YYYY-MM-DDTHH:mm
    catatan: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const resSurat = await fetch(
        `${import.meta.env.VITE_API_URL}/api/surat-masuk`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const dataSurat = await resSurat.json();
      if (resSurat.ok) setSuratMasukList(dataSurat);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
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
    const counts = new Array(12).fill(0);

    suratMasukList.forEach((item) => {
      const date = new Date(item.tanggal_terima);
      counts[date.getMonth()]++;
    });

    return {
      labels: months,
      datasets: [
        {
          label: "Surat Masuk",
          data: counts,
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.1)",
          borderColor: "#36a2eb",
          tension: 0.4,
          pointRadius: 4,
        },
      ],
    };
  }, [suratMasukList]);

  // 2. Data untuk Doughnut Chart (Distribusi Instansi)
  const corporateStats = useMemo(() => {
    const counts = {};
    suratMasukList.forEach((item) => {
      const name = item.corporate?.name || "Lainnya";
      counts[name] = (counts[name] || 0) + 1;
    });

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            "#4e73df",
            "#1cc88a",
            "#36b9cc",
            "#f6c23e",
            "#e74a3b",
          ],
          hoverOffset: 4,
        },
      ],
    };
  }, [suratMasukList]);

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleOpenDisposisi = (surat) => {
    setSelectedSurat(surat);
    setFormDisposisi({
      arsip_uuid: surat.uuid,
      user_id: "",
      tindak_lanjut: "",
      skala_prioritas: "biasa",
      intruksi: "",
      batas_waktu: "",
      catatan: "",
    });
    const modal = new window.bootstrap.Modal(
      document.getElementById("modalDisposisi"),
    );
    modal.show();
  };

  const handleSubmitDisposisi = async (e) => {
    e.preventDefault();
    console.log("form", formDisposisi);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/disposisi`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formDisposisi),
        },
      );

      if (response.ok) {
        alert("Disposisi berhasil diteruskan!");
        window.bootstrap.Modal.getInstance(
          document.getElementById("modalDisposisi"),
        ).hide();
        fetchData();
      } else {
        const err = await response.json();
        alert(err.message || "Gagal mengirim disposisi");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi");
    }
  };

  return (
    <AdminLayout>
      <div className="page-wrapper">
        <div
          className="page-content py-4"
          style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
        >
          {/* HEADER SECTION */}
          <div className="mb-4">
            <h3 className="fw-bold text-dark">Dashboard Disposisi</h3>
            <p className="text-muted">
              Analisis dan manajemen surat masuk secara real-time.
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary me-3">
                    <i className="bx bx-envelope fs-3"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">Total Surat</h6>
                    <h4 className="fw-bold mb-0">{suratMasukList.length}</h4>
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
                    <h6 className="mb-0 text-muted">Penting</h6>
                    <h4 className="fw-bold mb-0">
                      {
                        suratMasukList.filter((s) => s.sifat === "penting")
                          .length
                      }
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
                    <h6 className="mb-0 text-muted">Instansi Aktif</h6>
                    <h4 className="fw-bold mb-0">
                      {
                        [
                          ...new Set(
                            suratMasukList.map((s) => s.corporate?.name),
                          ),
                        ].length
                      }
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning me-3">
                    <i className="bx bx-user-voice fs-3"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">Staf Tersedia</h6>
                    <h4 className="fw-bold mb-0">{filterStaff?.length || 0}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHARTS SECTION */}
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold mb-4">Tren Surat Masuk (2026)</h6>
                <div style={{ height: "300px" }}>
                  <Line
                    data={monthlyStats}
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
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold mb-4">Asal Instansi</h6>
                <div style={{ height: "300px" }}>
                  <Doughnut
                    data={corporateStats}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: "bottom" } },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light text-secondary small uppercase">
                    <tr>
                      <th>No</th>
                      <th>No Registrasi</th>
                      <th>Nomor Surat</th>
                      <th>Asal Instansi</th>
                      <th>Perihal</th>
                      <th>File</th>
                      <th>Tanggal Diterima</th>
                      <th>Status/Sifat</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-5 text-muted small"
                        >
                          Sedang memproses data...
                        </td>
                      </tr>
                    ) : suratMasukList.length > 0 ? (
                      suratMasukList.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.no_registrasi}</td>
                          <td>
                            <div className="fw-bold">{item.nomor_surat}</div>
                            <div className="small text-muted">
                              {item.tanggal_terima}
                            </div>
                          </td>
                          <td style={{ maxWidth: "200px" }}>
                            <div className="text-truncate">
                              {item.corporate.name}
                            </div>
                          </td>
                          <td>{item.perihal}</td>
                          <td>
                            {item.file_path && (
                              <button
                                className="btn btn-sm btn-outline-danger shadow-none"
                                onClick={() => previewPDF(item.file_path)}
                                title="Lihat PDF"
                              >
                                <i className="bx bx-file-find"></i>
                              </button>
                            )}
                          </td>
                          <td>{item.tanggal_terima}</td>
                          <td>
                            <span
                              className={`badge rounded-pill ${item.sifat === "penting" ? "bg-danger" : "bg-info"} opacity-75`}
                            >
                              {item.sifat}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-primary rounded-pill px-4 btn-sm shadow-sm"
                              onClick={() => handleOpenDisposisi(item)}
                            >
                              Beri Instruksi{" "}
                              <i className="bx bx-right-arrow-alt ms-1"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          Belum ada data surat.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DISPOSISI MODERN */}
      <div
        className="modal fade"
        id="modalDisposisi"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-bottom-0 pt-4 px-4">
              <h5 className="modal-title fw-bold d-flex align-items-center">
                <i className="bx bx-edit-alt me-2 text-primary"></i> Buat
                Disposisi Baru
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <form onSubmit={handleSubmitDisposisi}>
              <div className="modal-body px-4 pb-4">
                {/* Information Callout */}
                {selectedSurat && (
                  <div className="p-3 rounded-3 bg-light border-start border-primary border-4 mb-4">
                    <div className="row">
                      <div className="col-md-6 border-end">
                        <small className="text-muted d-block">
                          Asal Instansi:
                        </small>
                        <span className="fw-bold">
                          {selectedSurat.corporate?.name}
                        </span>
                      </div>
                      <div className="col-md-6 ps-md-4">
                        <small className="text-muted d-block">Perihal:</small>
                        <span className="fw-bold">{selectedSurat.perihal}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row g-4">
                  {/* Step 1: Destination */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-uppercase">
                      1. Teruskan Kepada
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bx bx-user"></i>
                      </span>
                      <select
                        className="form-select border-start-0"
                        required
                        value={formDisposisi.user_id}
                        onChange={(e) =>
                          setFormDisposisi({
                            ...formDisposisi,
                            user_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Pilih Nama Staf...</option>
                        {filterStaff?.map((user) => (
                          <option key={user.uuid} value={user.uuid}>
                            {user.name} ({user.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Step 2: Deadline */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-uppercase">
                      2. Batas Waktu & Jam
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bx bx-time"></i>
                      </span>
                      <input
                        type="datetime-local" // MENGUBAH KE TIMESTAMP (TANGGAL & JAM)
                        className="form-control border-start-0"
                        required
                        value={formDisposisi.batas_waktu}
                        onChange={(e) =>
                          setFormDisposisi({
                            ...formDisposisi,
                            batas_waktu: e.target.value,
                          })
                        }
                      />
                    </div>
                    <small className="text-muted">
                      Kapan staf harus menyelesaikan ini?
                    </small>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold small text-uppercase">
                      3. Tindak Lanjut
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bx bx-run"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Contoh: Hadiri Rapat, Wakili Pimpinan, Balas Segera..."
                        required
                        value={formDisposisi.tindak_lanjut}
                        onChange={(e) =>
                          setFormDisposisi({
                            ...formDisposisi,
                            tindak_lanjut: e.target.value,
                          })
                        }
                      />
                    </div>
                    <small className="text-muted">
                      Ringkasan tindakan yang harus diambil.
                    </small>
                  </div>
                  {/* Step 3: Priority */}
                  <div className="col-md-12">
                    <label className="form-label fw-bold small text-uppercase">
                      3. Tingkat Urgensi
                    </label>
                    <div className="d-flex gap-3">
                      {["biasa", "segera", "penting"].map((prio) => (
                        <div key={prio} className="flex-fill">
                          <input
                            type="radio"
                            className="btn-check"
                            name="priority"
                            id={`prio-${prio}`}
                            value={prio}
                            checked={formDisposisi.skala_prioritas === prio}
                            onChange={(e) =>
                              setFormDisposisi({
                                ...formDisposisi,
                                skala_prioritas: e.target.value,
                              })
                            }
                          />
                          <label
                            className={`btn btn-outline-${prio === "penting" ? "danger" : prio === "segera" ? "warning" : "info"} w-100 text-capitalize`}
                            htmlFor={`prio-${prio}`}
                          >
                            {prio}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Instruction */}
                  <div className="col-md-12">
                    <label className="form-label fw-bold small text-uppercase">
                      4. Instruksi Pimpinan
                    </label>
                    <textarea
                      className="form-control rounded-3"
                      rows="3"
                      placeholder="Apa yang harus dilakukan staf terhadap surat ini?"
                      required
                      value={formDisposisi.intruksi}
                      onChange={(e) =>
                        setFormDisposisi({
                          ...formDisposisi,
                          intruksi: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-bold small text-uppercase">
                      Catatan Tambahan (Opsional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Informasi pendukung lainnya..."
                      value={formDisposisi.catatan}
                      onChange={(e) =>
                        setFormDisposisi({
                          ...formDisposisi,
                          catatan: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top-0 px-4 pb-4">
                <button
                  type="button"
                  className="btn btn-light px-4 rounded-pill"
                  data-bs-dismiss="modal"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-5 rounded-pill shadow"
                >
                  Kirim Disposisi <i className="bx bx-paper-plane ms-1"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
