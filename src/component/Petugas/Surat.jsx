import React, { useEffect, useState, useContext } from "react";
import AdminLayout from "../layouts/AdminLayout"; // Sesuaikan path import AdminLayout Anda
import Alert from "../Alert"; // Sesuaikan path import Alert Anda
import { PengajuanContext } from "../../context/PengajuanContext"; // Menggunakan context yang sama dengan contoh Anda

export default function Surat() {
  const { token } = useContext(PengajuanContext);
  const [tab, setTab] = useState("masuk"); // 'masuk' atau 'keluar'
  const [dataSurat, setDataSurat] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [loading, setLoading] = useState(false);

  // State untuk Filtering & Searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSifat, setFilterSifat] = useState("semua");
  const [filterCorporate, setFilterCorporate] = useState("semua");

  // State Aksi Modal & Alert
  const [selectedData, setSelectedData] = useState(null);
  const [formMasuk, setFormMasuk] = useState({});
  const [formKeluar, setFormKeluar] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // --- FUNGSI UTILITAS & MEMORY HELPERS ---
  const showAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeAlert(id), 3000);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const getDeleteModal = () => {
    const modalEl = document.getElementById("modalKonfirmasiHapusSurat");
    return window.bootstrap.Modal.getOrCreateInstance(modalEl);
  };

  // --- HTTP GET: AMBIL DATA SURAT ---
  const fetchData = async () => {
    if (!token) return;
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
      showAlert("danger", "Gagal Memuat!", err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- HTTP GET: AMBIL DATA INSTANSI (CORPORATE) ---
  const getCorporate = async () => {
    if (!token) return;
    try {
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
      if (response.ok) {
        setCorporates(result);
      }
    } catch (err) {
      console.error("Gagal memuat data instansi", err);
    }
  };

  // Jalankan fetch data saat tab aktif berubah atau token tersedia
  useEffect(() => {
    fetchData();
    getCorporate();
  }, [tab, token]);

  // --- PRATINJAU PDF ---
  const previewPDF = (filePath) => {
    if (filePath.startsWith("data:")) {
      const newTab = window.open();
      newTab.document.write(
        `<iframe src="${filePath}" width="100%" height="100%" style="border:none;"></iframe>`,
      );
    } else {
      const fileUrl = `${import.meta.env.VITE_API_URL}${filePath}`;
      window.open(fileUrl, "_blank");
    }
  };

  // --- LOGIKA FILTERING ---
  const filteredData = dataSurat.filter((item) => {
    const matchesSearch =
      item.nomor_surat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.perihal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.no_registrasi?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSifat =
      filterSifat === "semua" ? true : item.sifat === filterSifat;

    const matchesCorporate =
      filterCorporate === "semua"
        ? true
        : item.corporate?.uuid?.toString() === filterCorporate;

    return matchesSearch && matchesSifat && matchesCorporate;
  });

  // --- AKSI MODAL HAPUS ---
  const handleOpenDeleteModal = (id, currentTab) => {
    setDeleteTarget({ id, tab: currentTab });
    getDeleteModal().show();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const endpoint =
        deleteTarget.tab === "masuk" ? "/surat-masuk" : "/surat-keluar";
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api${endpoint}/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Gagal menghapus surat dari server");

      getDeleteModal().hide();
      fetchData(); // Refresh data setelah berhasil dihapus
      showAlert(
        "danger",
        "Dihapus!",
        "Data surat berhasil dihapus secara permanen.",
      );
      setDeleteTarget(null);
    } catch (error) {
      showAlert("danger", "Gagal!", error.message);
    }
  };

  return (
    <AdminLayout>
      <Alert alerts={alerts} removeAlert={removeAlert} />
      <div className="page-wrapper">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark">Manajemen Arsip Surat</h4>
            <p className="text-muted small mb-0">
              Kelola dokumen surat masuk dan keluar instansi secara digital dan
              terstruktur.
            </p>
          </div>

          {/* Tab Navigation Modern */}
          <div
            className="nav nav-pills bg-white p-1 rounded-3 shadow-sm border"
            style={{ width: "fit-content" }}
          >
            <button
              onClick={() => {
                setTab("masuk");
                setSearchQuery("");
              }}
              className={`nav-link rounded-2 px-4 py-2 border-0 d-flex align-items-center gap-2 fw-semibold fs-7 ${
                tab === "masuk"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted bg-transparent"
              }`}
            >
              <i className="bx bx-download fs-5"></i> Surat Masuk
            </button>
            <button
              onClick={() => {
                setTab("keluar");
                setSearchQuery("");
              }}
              className={`nav-link rounded-2 px-4 py-2 border-0 d-flex align-items-center gap-2 fw-semibold fs-7 ${
                tab === "keluar"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted bg-transparent"
              }`}
            >
              <i className="bx bx-upload fs-5"></i> Surat Keluar
            </button>
          </div>
        </div>

        {/* Filter & Search Panel */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3">
            <div className="row g-3">
              {/* Search Bar */}
              <div className="col-12 col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-light border-0 text-muted">
                    <i className="bx bx-search fs-5"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-0 py-2.5 fs-7"
                    placeholder="Cari No. Surat, Perihal, No. Registrasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="btn btn-light border-0"
                      onClick={() => setSearchQuery("")}
                    >
                      <i className="bx bx-x"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Sifat */}
              <div className="col-12 col-sm-6 col-md-3">
                <select
                  className="form-select bg-light border-0 py-2.5 fs-7"
                  value={filterSifat}
                  onChange={(e) => setFilterSifat(e.target.value)}
                >
                  <option value="semua">Semua Sifat Surat</option>
                  <option value="penting">Penting</option>
                  <option value="biasa">Biasa</option>
                  <option value="rahasia">Rahasia</option>
                </select>
              </div>

              {/* Filter Asal/Tujuan Instansi */}
              <div className="col-12 col-sm-6 col-md-3">
                <select
                  className="form-select bg-light border-0 py-2.5 fs-7"
                  value={filterCorporate}
                  onChange={(e) => setFilterCorporate(e.target.value)}
                >
                  <option value="semua">Semua Instansi</option>
                  {corporates.map((corp) => (
                    <option key={corp.uuid} value={corp.uuid}>
                      {corp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Indikator Total Surat */}
              <div className="col-12 col-md-2 d-flex align-items-center justify-content-md-end">
                <span className="badge bg-secondary-subtle text-secondary px-3 py-2.5 rounded-2 fs-8 w-100 text-center">
                  Total: <b>{filteredData.length}</b> Surat
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CARDS DISPLAY SECTION */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Memuat...</span>
            </div>
            <p className="text-muted small">Sedang mengambil berkas arsip...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {filteredData.map((item, index) => {
              const tanggalLabel =
                tab === "masuk" ? item.tanggal_terima : item.tanggal_buat;

              return (
                <div className="col" key={item.id || index}>
                  <div className="card h-100 border-0 shadow-sm transition-hover rounded-4">
                    {/* Card Header */}
                    <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-start">
                      <span className="badge bg-light text-muted border px-2.5 py-1.5 rounded-2 fs-8">
                        #{item.no_registrasi || "N/A"}
                      </span>
                      <span
                        className={`badge rounded-pill px-3 py-1.5 fs-8 text-uppercase ${
                          item.sifat === "penting"
                            ? "bg-danger-subtle text-danger"
                            : item.sifat === "rahasia"
                              ? "bg-warning-subtle text-dark"
                              : "bg-info-subtle text-info"
                        }`}
                      >
                        {item.sifat || "Biasa"}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="card-body px-4 pb-4">
                      <h6
                        className="card-title text-dark fw-bold mb-1 text-truncate"
                        title={item.nomor_surat}
                      >
                        {item.nomor_surat}
                      </h6>
                      <p
                        className="text-muted small mb-3 text-truncate-2"
                        style={{
                          height: "40px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.perihal}
                      </p>

                      <hr className="my-3 opacity-25" />

                      {/* Detail Informasi */}
                      <div className="row g-2 mb-3 fs-8">
                        <div className="col-6">
                          <div className="text-muted small">
                            {tab === "masuk"
                              ? "Asal Instansi"
                              : "Tujuan Instansi"}
                          </div>
                          <div className="fw-semibold text-dark text-truncate">
                            {item.corporate?.name || "Tidak Diketahui"}
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted small">Tanggal</div>
                          <div className="fw-semibold text-dark text-nowrap">
                            <i className="bx bx-calendar me-1 text-secondary"></i>
                            {tanggalLabel}
                          </div>
                        </div>
                      </div>

                      {/* Preview Berkas */}
                      {item.file_path ? (
                        <div className="d-flex align-items-center justify-content-between bg-light p-2.5 rounded-3 border border-dashed mb-1">
                          <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
                            <i className="bx bxs-file-pdf text-danger fs-4"></i>
                            <span className="text-dark fw-medium fs-8 text-truncate">
                              Lampiran Berkas
                            </span>
                          </div>
                          <span className="text-muted fs-9 text-nowrap">
                            {item.file_size
                              ? `${Math.round(item.file_size / 1024).toLocaleString()} KB`
                              : "0 KB"}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center p-2.5 text-muted rounded-3 bg-light fs-8">
                          <i className="bx bx-error-circle me-1"></i> Tanpa
                          berkas lampiran
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="card-footer bg-light-subtle border-0 px-4 py-3 d-flex gap-2">
                      {item.file_path && (
                        <button
                          className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 py-2 rounded-2"
                          onClick={() => previewPDF(item.file_path)}
                          title="Lihat PDF"
                        >
                          <i className="bx bx-show-alt fs-6"></i>
                          <span>Pratinjau</span>
                        </button>
                      )}

                      {/* <button
                        className="btn btn-light-primary btn-sm px-3 rounded-2"
                        onClick={() => {
                          setSelectedData(item);
                          if (tab === "masuk") setFormMasuk(item);
                          else setFormKeluar(item);
                          // Hubungkan dengan pemanggil modal bootstrap kustom Anda jika ada
                        }}
                        title="Edit"
                      >
                        <i className="bx bx-edit fs-5"></i>
                      </button>

                      <button
                        className="btn btn-light-danger btn-sm px-3 rounded-2"
                        onClick={() => handleOpenDeleteModal(item.id, tab)}
                        title="Hapus"
                      >
                        <i className="bx bx-trash fs-5"></i>
                      </button> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="card border-0 shadow-sm rounded-4 text-center py-5">
            <div className="card-body">
              <div className="mb-3">
                <i
                  className="bx bx-folder-open text-muted"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h5 className="fw-bold text-dark">Arsip Tidak Ditemukan</h5>
              <p
                className="text-muted small mx-auto"
                style={{ maxWidth: "350px" }}
              >
                Tidak ada data surat yang cocok dengan kata kunci pencarian atau
                kombinasi filter Anda.
              </p>
              <button
                className="btn btn-sm btn-outline-primary rounded-2 px-3 mt-2"
                onClick={() => {
                  setSearchQuery("");
                  setFilterSifat("semua");
                  setFilterCorporate("semua");
                }}
              >
                Reset Penyaringan
              </button>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus Surat */}
        <div
          className="modal fade"
          id="modalKonfirmasiHapusSurat"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="modal-body p-4 text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: "64px",
                    height: "64px",
                    background: "#fff0f0",
                  }}
                >
                  <i
                    className="bx bx-trash text-danger"
                    style={{ fontSize: "28px" }}
                  ></i>
                </div>
                <h5 className="fw-bold mb-1">Hapus Surat?</h5>
                <p className="text-muted small mb-0">
                  Data arsip surat ini akan dihapus secara permanen dari server.
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
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Card CSS Variables */}
      <style>{`
        .transition-hover { 
          transition: transform 0.25s ease, box-shadow 0.25s ease; 
        }
        .transition-hover:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 12px 24px rgba(0,0,0,0.075) !important; 
        }
        .btn-light-primary { 
          background: #eef4ff; 
          border: none; 
          color: #0059ff;
        }
        .btn-light-primary:hover { 
          background: #0059ff; 
          color: #ffff; 
        }
        .btn-light-danger { 
          background: #fff0f0; 
          border: none; 
          color: #f60000; 
        }
        .btn-light-danger:hover { 
          background: #f60000; 
          color: #ffff; 
        }
        .fs-7 { font-size: 0.9rem; }
        .fs-8 { font-size: 0.8rem; }
        .fs-9 { font-size: 0.7rem; }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </AdminLayout>
  );
}
