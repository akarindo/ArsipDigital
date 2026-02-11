import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { usePengajuan } from "../../context/PengajuanContext";
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
  const [tabArsip, setTabArsip] = useState("eksternal"); // default eksternal sesuai form lama
  const { token } = usePengajuan();
  const [selectedData, setSelectedData] = useState(null);
  const [corporates, setCorporates] = useState([]);
  // State Form Surat Masuk
  const [formMasuk, setFormMasuk] = useState({
    asal_instansi: "",
    nomor_surat: "",
    sifat: "biasa",
    file_path: "",
    tanggal_surat: "",
    no_registrasi: "",
    perihal: "",
    ditujukan_kepada: "",
    tanggal_terima: "",
    file_size: 0,
  });

  // State Form Surat Keluar (Termasuk Data Kurir)
  const [formKeluar, setFormKeluar] = useState({
    nomor_surat: "",
    tujuan_instansi: "",
    sifat: "biasa",
    perihal: "",
    file_path: "",
    alamat_tujuan: "",
    no_registrasi: "",
    tanggal_buat: "",
    no_resi: null,
    jenis_pengiriman: null,
    provider: null,
    type: tabArsip,
    penerima: null,
    status_internal: null,
    tanggal_serah: null,
    file_size: 0,
  });
  const openModal = (id) => {
    const modalElement = document.getElementById(id);

    if (modalElement) {
      const modalInstance =
        window.bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  };
  const handleTambahBaru = () => {
    setSelectedData(null);
    const newRegNo = generateNoRegistrasi(tab);

    if (tab === "masuk") {
      resetFormMasuk();
      setFormMasuk((prev) => ({ ...prev, no_registrasi: newRegNo }));
    } else {
      resetFormKeluar();
      setFormKeluar((prev) => ({ ...prev, no_registrasi: newRegNo }));
    }

    openModal(tab === "masuk" ? "modalSuratMasuk" : "modalSuratKeluar");
  };
  const resetFormMasuk = () => {
    setFormMasuk({
      asal_instansi: "",
      nomor_surat: "",
      no_registrasi: "",
      tanggal_surat: "",
      sifat: "biasa",
      file_path: "",
      perihal: "",
      ditujukan_kepada: "",
      tanggal_terima: "",
      file_size: 0,
    });
  };

  const resetFormKeluar = () => {
    setFormKeluar({
      nomor_surat: "",
      tujuan_instansi: "",
      sifat: "biasa",
      perihal: "",
      file_path: "",
      alamat_tujuan: "",
      no_registrasi: "",
      tanggal_buat: "",
      no_resi: null,
      jenis_pengiriman: null,
      provider: null,
      type: tabArsip,
      penerima: null,
      status_internal: null,
      tanggal_serah: null,
      file_size: 0,
    });
  };

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
        setDataSurat(result);
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
  // Fungsi Hapus
  const handleDelete = async (id, type) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const endpoint = type === "masuk" ? "/surat-masuk" : "/surat-keluar";
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api${endpoint}/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.ok) {
          fetchData();
          alert("Data berhasil dihapus");
        }
      } catch (err) {
        alert("Gagal menghapus data");
      }
    }
  };
  const generateNoRegistrasi = (type) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    const prefix = type === "masuk" ? "REG-IN" : "REG-OUT";

    // Format: REG-IN/202408/XXXX
    return `${prefix}/${year}${month}/${random}`;
  };

  // Fungsi Lihat PDF
  const previewPDF = (base64String) => {
    const newTab = window.open();
    newTab.document.write(
      `<iframe src="${base64String}" width="100%" height="100%" style="border:none;"></iframe>`,
    );
  };
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        // Menghitung ukuran string Base64 dalam Bytes
        const fileSizeInBytes = base64String.length;

        if (type === "masuk") {
          setFormMasuk({
            ...formMasuk,
            file_path: base64String,
            file_size: fileSizeInBytes, // Simpan ukuran dalam Bytes
          });
        } else {
          setFormKeluar({
            ...formKeluar,
            file_path: base64String,
            file_size: fileSizeInBytes,
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Mohon pilih file format PDF!");
      e.target.value = null;
    }
  };
  useEffect(() => {
    fetchData();
    getCorporate();
  }, [tab]);

  // 2. Fungsi Submit Data (POST)
  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const isEdit = !!selectedData;
    const payload = type === "masuk" ? formMasuk : formKeluar;
    const endpoint = type === "masuk" ? "/surat-masuk" : "/surat-keluar";
    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}/api${endpoint}/${selectedData.id}`
      : `${import.meta.env.VITE_API_URL}/api${endpoint}`;

    try {
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`Data berhasil ${isEdit ? "diperbarui" : "disimpan"}!`);
        // Tutup Modal
        const modalId =
          type === "masuk" ? "modalSuratMasuk" : "modalSuratKeluar";
        window.bootstrap.Modal.getInstance(
          document.getElementById(modalId),
        ).hide();

        setSelectedData(null); // Reset mode edit
        fetchData();
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    }
    console.log("form", formMasuk);
  };
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
      <div className="page-wrapper">
        <div className="page-content py-4">
          <div className="d-flex align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-0">Sistem Manajemen Surat</h4>
              <p className="text-muted mb-0 small">
                Dashboard / Surat {tab === "masuk" ? "Masuk" : "Keluar"}
              </p>
            </div>
            <button
              className="btn btn-primary ms-auto px-4 shadow-sm"
              onClick={() => {
                setSelectedData(null);
                if (tab === "masuk") resetFormMasuk();
                else resetFormKeluar();
                handleTambahBaru();
              }}
            >
              <i className="bx bx-plus me-1"></i> Tambah Data
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

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              {/* Tab Navigation Modern */}
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

              {/* Table Section */}

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light text-secondary small uppercase">
                    <tr>
                      <th>No</th>
                      <th>No Registrasi</th>
                      <th>Nomor Surat</th>
                      <th>
                        {tab === "masuk" ? "Asal Instansi" : "Tujuan & Alamat"}
                      </th>
                      <th>Perihal</th>
                      <th>File</th>
                      <th>Ukuran</th>
                      <th>
                        {" "}
                        {tab === "masuk"
                          ? "Tanggal Diterima"
                          : "Tanggal Dibuat"}
                      </th>
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
                    ) : dataSurat.length > 0 ? (
                      dataSurat.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.no_registrasi}</td>
                          <td>
                            <div className="fw-bold">{item.nomor_surat}</div>
                            <div className="small text-muted">
                              {tab === "masuk"
                                ? item.tanggal_terima
                                : item.tanggal_buat}
                            </div>
                          </td>
                          <td style={{ maxWidth: "200px" }}>
                            <div className="text-truncate">
                              {tab === "masuk"
                                ? item.corporate.name
                                : item.corporate.name}
                            </div>
                            {tab === "keluar" && (
                              <div className="small text-muted text-truncate">
                                {item.alamat_tujuan}
                              </div>
                            )}
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
                          <td className="text-nowrap">
                            <div className="d-flex align-items-center">
                              <i className="bx bx-hdd me-1 text-muted"></i>
                              <span className="small">
                                {item.file_size
                                  ? Math.round(
                                      item.file_size / 1024,
                                    ).toLocaleString()
                                  : 0}{" "}
                                KB
                              </span>
                            </div>
                          </td>
                          <td>
                            {tab == "masuk"
                              ? item.tanggal_terima
                              : item.tanggal_buat}
                          </td>
                          <td>
                            <span
                              className={`badge rounded-pill ${item.sifat === "penting" ? "bg-danger" : "bg-info"} opacity-75`}
                            >
                              {item.sifat}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group">
                              {/* Tombol Lihat PDF */}

                              {/* Tombol Edit */}
                              <button
                                className="btn btn-sm btn-outline-primary shadow-none"
                                onClick={() => {
                                  setSelectedData(item);
                                  if (tab === "masuk") setFormMasuk(item);
                                  else setFormKeluar(item);
                                  openModal(
                                    tab === "masuk"
                                      ? "modalSuratMasuk"
                                      : "modalSuratKeluar",
                                  );
                                }}
                              >
                                <i className="bx bx-edit"></i>
                              </button>

                              {/* Tombol Hapus */}
                              <button
                                className="btn btn-sm btn-outline-secondary shadow-none"
                                onClick={() => handleDelete(item.id, tab)}
                              >
                                <i className="bx bx-trash"></i>
                              </button>
                            </div>
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
      {/* MODAL SURAT MASUK */}
      <div
        className="modal fade"
        id="modalSuratMasuk"
        tabIndex="-1"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <div className="d-flex flex-column ms-2 mt-2">
                <h5 className="fw-bold mb-0">Registrasi Surat Masuk</h5>
                <p className="text-muted small">
                  Input data surat yang diterima dari instansi luar
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={(e) => handleSubmit(e, "masuk")}>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      No. Registrasi Sistem
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 fw-bold text-primary"
                      value={formMasuk.no_registrasi || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Asal Instansi
                    </label>
                    <select
                      className="form-select bg-light border-0"
                      required
                      value={formMasuk.asal_instansi}
                      onChange={(e) =>
                        setFormMasuk({
                          ...formMasuk,
                          asal_instansi: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Pilih Instansi --</option>
                      {corporates.map((corp) => (
                        <option key={corp.uuid} value={corp.uuid}>
                          {corp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Nomor Surat
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <i className="bx bx-hash"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-light border-0"
                        placeholder="Masukkan nomor surat resmi"
                        required
                        value={formMasuk.nomor_surat}
                        onChange={(e) =>
                          setFormMasuk({
                            ...formMasuk,
                            nomor_surat: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">
                      Sifat Surat
                    </label>
                    <select
                      className="form-select bg-light border-0 shadow-none"
                      value={formMasuk.sifat}
                      onChange={(e) =>
                        setFormMasuk({ ...formMasuk, sifat: e.target.value })
                      }
                    >
                      <option value="biasa">Biasa</option>
                      <option value="penting">Penting</option>
                      <option value="rahasia">Rahasia</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">
                      Tanggal Surat
                    </label>
                    <input
                      type="date"
                      className="form-control bg-light border-0"
                      required
                      value={formMasuk.tanggal_surat}
                      onChange={(e) =>
                        setFormMasuk({
                          ...formMasuk,
                          tanggal_surat: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Perihal
                    </label>
                    <textarea
                      className="form-control bg-light border-0"
                      rows="2"
                      placeholder="Ringkasan isi surat..."
                      required
                      value={formMasuk.perihal}
                      onChange={(e) =>
                        setFormMasuk({ ...formMasuk, perihal: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold text-secondary">
                      Tanggal Diterima
                    </label>
                    <input
                      type="date"
                      className="form-control bg-light border-0"
                      required
                      value={formMasuk.tanggal_terima}
                      onChange={(e) =>
                        setFormMasuk({
                          ...formMasuk,
                          tanggal_terima: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Ditujukan Kepada
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <i className="bx bx-user"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-light border-0"
                        placeholder="Nama pimpinan atau bagian"
                        required
                        value={formMasuk.ditujukan_kepada}
                        onChange={(e) =>
                          setFormMasuk({
                            ...formMasuk,
                            ditujukan_kepada: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Upload File (PDF)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <i className="bx bx-file"></i>
                      </span>
                      <input
                        type="file"
                        className="form-control bg-light border-0"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, "masuk")}
                      />
                    </div>
                    {formMasuk.file_pdf && (
                      <small className="text-success">
                        File berhasil diproses!
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 p-4 pt-0">
                <button
                  type="button"
                  className="btn btn-light px-4 rounded-3"
                  data-bs-dismiss="modal"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 rounded-3 shadow-sm"
                >
                  <i className="bx bx-save me-1"></i> Simpan Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* MODAL SURAT KELUAR + DATA KURIR */}
      <div
        className="modal fade"
        id="modalSuratKeluar"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="fw-bold mt-2 ms-2">Entry Surat Keluar</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <form onSubmit={(e) => handleSubmit(e, "keluar")}>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      No. Registrasi Sistem
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 fw-bold text-primary"
                      value={formKeluar.no_registrasi || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Nomor Surat
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="No. Surat Resmi"
                      value={formKeluar.nomor_surat}
                      required
                      onChange={(e) =>
                        setFormKeluar({
                          ...formKeluar,
                          nomor_surat: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">
                      Tujuan Instansi
                    </label>
                    <select
                      className="form-select bg-light border-0"
                      required
                      value={formKeluar.tujuan_instansi}
                      onChange={(e) =>
                        setFormKeluar({
                          ...formKeluar,
                          tujuan_instansi: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Pilih Instansi --</option>
                      {corporates.map((corp) => (
                        <option key={corp.uuid} value={corp.uuid}>
                          {corp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">
                      Alamat Tujuan
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Alamat pengiriman lengkap..."
                      required
                      value={formKeluar.alamat_tujuan}
                      onChange={(e) =>
                        setFormKeluar({
                          ...formKeluar,
                          alamat_tujuan: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Sifat</label>
                    <select
                      className="form-select"
                      value={formKeluar.sifat}
                      onChange={(e) =>
                        setFormKeluar({ ...formKeluar, sifat: e.target.value })
                      }
                    >
                      <option value="biasa">Biasa</option>
                      <option value="penting">Penting</option>
                      <option value="rahasia">Rahasia</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Perihal</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formKeluar.perihal}
                      required
                      onChange={(e) =>
                        setFormKeluar({
                          ...formKeluar,
                          perihal: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">
                      Tanggal Dibuat
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={formKeluar.tanggal_buat}
                      required
                      onChange={(e) =>
                        setFormKeluar({
                          ...formKeluar,
                          tanggal_buat: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Upload File (PDF)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <i className="bx bx-file"></i>
                      </span>
                      <input
                        type="file"
                        className="form-control bg-light border-0"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, "keluar")}
                      />
                    </div>
                    {formMasuk.file_pdf && (
                      <small className="text-success">
                        File berhasil diproses!
                      </small>
                    )}
                  </div>
                  <div className="col-12 mt-4">
                    <ul className="nav nav-pills nav-fill mb-3 bg-light rounded p-1">
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${tabArsip === "internal" ? "active btn-primary" : "text-secondary"}`}
                          onClick={() => setTabArsip("internal")}
                        >
                          <i className="bx bx-buildings me-2"></i>Internal /
                          Langsung
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${tabArsip === "eksternal" ? "active btn-primary" : "text-secondary"}`}
                          onClick={() => setTabArsip("eksternal")}
                        >
                          <i className="bx bx-truck me-2"></i>Eksternal / Kurir
                        </button>
                      </li>
                    </ul>
                  </div>
                  {/* KONTEN TAB INTERNAL */}
                  {tabArsip === "internal" && (
                    <div className="col-12 py-3 px-3 border rounded-3 bg-light-subtle animate__animated animate__fadeIn">
                      <h6 className="fw-bold text-primary small mb-3">
                        DETAIL PENGAMBILAN INTERNAL
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-bold">
                            Metode Serah Terima
                          </label>
                          <select
                            className="form-select"
                            value={formKeluar.status_internal || ""}
                            onChange={(e) =>
                              setFormKeluar({
                                ...formKeluar,
                                status_internal: e.target.value,
                              })
                            }
                            required={tabArsip === "internal"}
                          >
                            <option value="">-- Pilih Metode --</option>
                            <option value="diambil">Diambil Sendiri</option>
                            <option value="dititipkan">Dititipkan</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-bold">
                            Nama Penerima/Pembawa
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nama lengkap..."
                            value={formKeluar.penerima || ""}
                            onChange={(e) =>
                              setFormKeluar({
                                ...formKeluar,
                                penerima: e.target.value,
                              })
                            }
                            required={tabArsip === "internal"}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label x-small fw-bold">
                            Tanggal Diserahkan
                          </label>
                          <input
                            type="date"
                            className="form-control form-select-sm"
                            value={formKeluar.tanggal_serah}
                            required={tabArsip === "eksternal"}
                            onChange={(e) =>
                              setFormKeluar({
                                ...formKeluar,
                                tanggal_serah: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* KONTEN TAB EKSTERNAL (KODE LAMA ANDA) */}
                  {tabArsip === "eksternal" && (
                    <div className="col-12 py-2 bg-light rounded-3 px-3 border animate__animated animate__fadeIn">
                      <h6 className="mb-3 mt-1 fw-bold text-primary small uppercase">
                        <i className="bx bx-truck me-2"></i>Detail Ekspedisi /
                        Kurir
                      </h6>
                      <div className="row g-2 pb-2">
                        <div className="col-md-4">
                          <label className="form-label x-small fw-bold">
                            Provider
                          </label>
                          <select
                            className="form-select form-select-sm"
                            value={formKeluar.provider}
                            onChange={(e) =>
                              setFormKeluar({
                                ...formKeluar,
                                provider: e.target.value,
                              })
                            }
                            required={tabArsip === "eksternal"}
                          >
                            <option value="J&T">J&T Express</option>
                            <option value="JNE">JNE</option>
                            <option value="SICEPAT">Sicepat</option>
                            <option value="POS">POS Indonesia</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label x-small fw-bold">
                            Jenis Layanan
                          </label>
                          <input
                            type="text"
                            className="form-control form-select-sm"
                            placeholder="Reguler/Kilat"
                            value={formKeluar.jenis_pengiriman}
                            required={tabArsip === "eksternal"}
                            onChange={(e) =>
                              setFormKeluar({
                                ...formKeluar,
                                jenis_pengiriman: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label x-small fw-bold">
                            Nomor Resi
                          </label>
                          <input
                            type="text"
                            className="form-control form-select-sm"
                            placeholder="Contoh: JT1234..."
                            value={formKeluar.no_resi}
                            required={tabArsip === "eksternal"}
                            onChange={(e) =>
                              setFormKeluar({
                                ...formKeluar,
                                no_resi: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label x-small fw-bold">
                            Tanggal Serah Kurir
                          </label>
                          <input
                            type="date"
                            className="form-control form-select-sm"
                            value={formKeluar.tanggal_serah}
                            required={tabArsip === "eksternal"}
                            onChange={(e) =>
                              setFormKeluar({
                                ...formKeluar,
                                tanggal_serah: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-light px-4"
                  data-bs-dismiss="modal"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 shadow-sm"
                >
                  Simpan Surat Keluar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
