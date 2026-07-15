import React from "react";
import Sidebar from "../Sidebar";
import { PengajuanContext } from "../../context/PengajuanContext";
import AdminLayout from "../layouts/AdminLayout";
import Alert from "../Alert";

export default function BranchMaster() {
  const { token } = React.useContext(PengajuanContext);
  const [isEdit, setIsEdit] = React.useState(false);
  const [currentUuid, setCurrentUuid] = React.useState(null);
  const [branches, setBranches] = React.useState([]); // Mengambil data asli database
  const [branch, setBranch] = React.useState({ name: "", code: "" });
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [alerts, setAlerts] = React.useState([]);

  // Fungsi Alert
  const showAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeAlert(id), 3000);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Modal Helpers
  const getModal = () => {
    const modalEl = document.getElementById("modalBranchMaster");
    return window.bootstrap.Modal.getOrCreateInstance(modalEl);
  };

  const getDeleteModal = () => {
    const modalEl = document.getElementById("modalKonfirmasiHapus");
    return window.bootstrap.Modal.getOrCreateInstance(modalEl);
  };

  // 1. HTTP GET: Mengambil Data dari Laravel API
  const getBranches = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/branches`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Gagal mengambil data cabang");
      const result = await response.json();
      setBranches(result);
    } catch (error) {
      showAlert("danger", "Error!", error.message);
    }
  };

  // Jalankan fetch data saat halaman di-load pertama kali
  React.useEffect(() => {
    if (token) {
      getBranches();
    }
  }, [token]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEdit(true);
      setCurrentUuid(item.uuid);
      setBranch({ name: item.name, code: item.code });
    } else {
      setIsEdit(false);
      setBranch({ name: "", code: "" });
    }
    getModal().show();
  };

  // 2. HTTP POST & PUT: Simpan atau Perbarui Data ke API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/api/branches/${currentUuid}`
        : `${import.meta.env.VITE_API_URL}/api/branches`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(branch),
      });

      const result = await response.json();

      if (!response.ok) {
        // Jika ada validasi gagal dari backend Laravel
        if (result.errors && result.errors.code) {
          throw new Error(result.errors.code[0]);
        }
        throw new Error(result.message || "Gagal memproses data");
      }

      getModal().hide();
      getBranches(); // Refresh list data dari DB

      if (isEdit) {
        showAlert(
          "info",
          "Diperbarui!",
          `Data "${branch.name}" berhasil diperbarui.`,
        );
      } else {
        showAlert(
          "success",
          "Berhasil Ditambahkan!",
          `Data "${branch.name}" berhasil disimpan.`,
        );
      }
    } catch (error) {
      showAlert("danger", "Gagal Menyimpan!", error.message);
    }
  };

  const handleOpenDeleteModal = (item) => {
    setDeleteTarget(item);
    getDeleteModal().show();
  };

  // 3. HTTP DELETE: Menghapus Data dari API
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/branches/${deleteTarget.uuid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Gagal menghapus data dari server");

      getDeleteModal().hide();
      getBranches(); // Refresh list data dari DB
      showAlert(
        "danger",
        "Dihapus!",
        `Data "${deleteTarget.name}" berhasil dihapus.`,
      );
      setDeleteTarget(null);
    } catch (error) {
      showAlert("danger", "Gagal!", error.message);
    }
  };

  return (
    <AdminLayout>
      <Alert alerts={alerts} removeAlert={removeAlert} />
      <div className="page-wrapper px-4 py-4">
        {/* Header Section */}
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h4 className="fw-bold mb-0 text-dark">Manajemen Kantor Cabang</h4>
            <p className="text-muted small mb-0">
              Kelola daftar kantor cabang instansi Anda untuk distribusi surat
              dan arsip.
            </p>
          </div>
          <div className="col-auto">
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary shadow-sm px-4 d-flex align-items-center gap-2"
              style={{ borderRadius: "10px" }}
            >
              <i className="bx bx-plus-circle"></i> Tambah Cabang Baru
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar Left */}
          <div className="col-12 col-lg-3">
            <div
              className="card border-0 shadow-sm p-3"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted">
                  Navigasi Master
                </h6>
                <Sidebar />
              </div>
            </div>
          </div>

          {/* List Content Right */}
          <div className="col-12 col-lg-9">
            <div className="row">
              {branches?.map((item) => (
                <div key={item.uuid} className="col-12 mb-3">
                  <div
                    className="card border-0 shadow-sm transition-hover"
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="card-body d-flex align-items-center justify-content-between p-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <i className="bx bx-buildings text-primary fs-4"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">{item.name}</h6>
                          <span className="text-muted extra-small">
                            Kode: {item.code}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="btn btn-sm btn-light-primary px-3"
                        >
                          <i className="bx bx-edit-alt me-1"></i> Edit
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(item)}
                          className="btn btn-sm btn-light-danger px-3"
                        >
                          <i className="bx bx-trash me-1"></i> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {branches?.length === 0 && (
                <div className="text-center py-5">
                  <i className="bx bx-info-circle fs-1 text-muted"></i>
                  <p className="text-muted mt-2">
                    Belum ada data kantor cabang di database.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <div
          className="modal fade"
          id="modalBranchMaster"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="modal-header border-0 pt-4 px-4">
                <h5 className="fw-bold">
                  {isEdit ? "Perbarui Cabang" : "Tambah Cabang"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="text-center mb-4">
                    <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                      <i
                        className={`bx ${isEdit ? "bx-edit" : "bx-buildings"} fs-1 text-primary`}
                      ></i>
                    </div>
                    <p className="text-muted small">
                      Inputkan detail kantor cabang baru secara teliti.
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nama Kantor Cabang
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-0 bg-light"
                      style={{ borderRadius: "12px" }}
                      value={branch.name}
                      onChange={(e) =>
                        setBranch({ ...branch, name: e.target.value })
                      }
                      placeholder="Contoh: Cabang Bekasi"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Kode Cabang
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-0 bg-light"
                      style={{ borderRadius: "12px" }}
                      value={branch.code}
                      onChange={(e) =>
                        setBranch({ ...branch, code: e.target.value })
                      }
                      placeholder="Contoh: BKS01"
                      required
                    />
                  </div>
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
                    type="submit"
                    className="btn btn-primary flex-grow-1 py-2"
                    style={{ borderRadius: "10px" }}
                  >
                    {isEdit ? "Simpan Perubahan" : "Simpan Cabang"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Modal Hapus */}
        <div
          className="modal fade"
          id="modalKonfirmasiHapus"
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
                <h5 className="fw-bold mb-1">Hapus Cabang?</h5>
                <p className="text-muted small mb-0">
                  Data{" "}
                  <span className="fw-semibold text-dark">
                    "{deleteTarget?.name}"
                  </span>{" "}
                  akan dihapus permanen.
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

      <style>{`
        .transition-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .transition-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
        .btn-light-primary { background: #eef4ff; border: none; color: #0059ff;}
        .btn-light-primary:hover { background: #0059ff; color: #ffff; border: none; }
        .btn-light-danger { background: #fff0f0; border: none; color: #f60000 }
        .btn-light-danger:hover { background: #f60000; border: none; color: #ffff; }
        .extra-small { font-size: 11px; }
        
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
