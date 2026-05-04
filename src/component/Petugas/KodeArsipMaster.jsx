import { Link, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import AdminLayout from "../layouts/AdminLayout";
import React from "react";
import { PengajuanContext } from "../../context/PengajuanContext";


function Alert({ alerts, removeAlert }) {
  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      minWidth: "300px",
    }}>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            background: alert.type === "success" ? "#dcfce7"
              : alert.type === "info" ? "#dbeafe"
              : "#fee2e2",
            borderLeft: `4px solid ${
              alert.type === "success" ? "#16a34a"
              : alert.type === "info" ? "#2563eb"
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
          {/* Icon */}
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: alert.type === "success" ? "#16a34a"
              : alert.type === "info" ? "#2563eb"
              : "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <i className={`bx ${
              alert.type === "success" ? "bx-check"
              : alert.type === "info" ? "bx-edit"
              : "bx-trash"
            } text-white`} style={{ fontSize: "16px" }}></i>
          </div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <p style={{
              margin: 0,
              fontWeight: "700",
              fontSize: "13px",
              color: alert.type === "success" ? "#15803d"
                : alert.type === "info" ? "#1d4ed8"
                : "#b91c1c",
            }}>
              {alert.title}
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#555", marginTop: "2px" }}>
              {alert.message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => removeAlert(alert.id)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#999", fontSize: "16px" }}
          >
            <i className="bx bx-x"></i>
          </button>

          {/* Progress Bar */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "3px",
            background: alert.type === "success" ? "#16a34a"
              : alert.type === "info" ? "#2563eb"
              : "#dc2626",
            animation: "shrink 3s linear forwards",
          }} />
        </div>
      ))}
    </div>
  );
}


export default function KodeArsipMaster() {
  const { codes, refreshData, token } = React.useContext(PengajuanContext);
  const [isEdit, setIsEdit] = React.useState(false);
  const [currentUuid, setCurrentUuid] = React.useState(null);
  const [kode, setKode] = React.useState({
    kode: "",
  });
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/api/kode/${currentUuid}`
        : `${import.meta.env.VITE_API_URL}/api/kode`;

      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(kode),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login Gagal");
      }
      setKode({ kode: "" });
      setIsEdit(false);
      setCurrentUuid(null);
      refreshData();
      handleCloseModal();
      if (isEdit) {
        showAlert("info", "Diperbarui!", `Data "${kode.kode}" berhasil diperbarui.`);
      } else {
        showAlert("success", "Berhasil Ditambahkan!", `Data "${kode.kode}" berhasil disimpan.`);
      }
    } catch (error) {
      console.error("Login Gagal:", error.message);
      handleCloseModal();
    }
  };
  const handleEdit = (kodeItem) => {
    setIsEdit(true);
    setCurrentUuid(kodeItem.uuid);
    setKode({
      kode: kodeItem.kode,
    });
  };
  
  const [deleteTarget, setDeleteTarget] = React.useState(null);
        
          const getDeleteModal = () => {
            const modalEl = document.getElementById("modalKonfirmasiHapus");
            return window.bootstrap.Modal.getOrCreateInstance(modalEl);
          };
        
          const handleOpenDeleteModal = (item) => {
            setDeleteTarget(item);
            getDeleteModal().show();
          };
      
          const handleConfirmDelete = async () => {
          if (!deleteTarget) return;
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/kode/${deleteTarget.uuid}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            
            if (!response.ok) throw new Error("Gagal menghapus data");
            getDeleteModal().hide();
            refreshData();
            showAlert("danger", "Dihapus!", `Data "${deleteTarget.kode}" berhasil dihapus.`);
            setDeleteTarget(null);
          } catch (error) {
            showAlert("danger", "Gagal!", error.message);
          }
        };

  const handleOpenModal = (data = null) => {
    if (data) {
      handleEdit(data);
    } else {
      setIsEdit(false);
      setKode({
        kode: "",
      });
    }
    const modal = new bootstrap.Modal(
      document.getElementById("tambahKodeMaster"),
    );
    modal.show();
  };

  const handleCloseModal = () => {
    const modalElement = document.getElementById("tambahKodeMaster");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
  };
  return (
    <AdminLayout>
      <Alert alerts={alerts} removeAlert={removeAlert} />
      <div className="page-wrapper px-4 py-4">
        {/* Header Section */}
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h4 className="fw-bold mb-0 text-dark">Data Master</h4>
            <p className="text-muted small mb-0">
              Kelola daftar arsip dan kategori master data nama Anda.
            </p>
          </div>
          <div className="col-auto">
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary shadow-sm px-4 d-flex align-items-center gap-2"
              style={{ borderRadius: "10px" }}
            >
              <i className="bx bx-plus-circle"></i> Tambah Kode Arsip
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
                <h6 className="fw-bold mb-3 text-uppercase small text-muted text-center">
                  Nama Data Master
                </h6>
                <Sidebar />
              </div>
            </div>
          </div>

          {/* List Content Right */}
          <div className="col-12 col-lg-9">
            <div className="row">
              {codes?.map((code) => (
                <div
                  className="customers-list-item d-flex align-items-center justify-content-between p-3 cursor-pointer bg-white radius-10"
                  style={{ marginBottom: 15 }}
                >
                  <div
                    className="kiri"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <i className="bx bx-barcode text-info fs-4"></i>
                        </div>
                    
                      <h6 className="mb-1 fw-bold">{code.kode}</h6>
                    
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleOpenModal(code)}
                      className="btn btn-sm btn-light-primary px-3"
                    >
                      <i className="bx bx-edit-alt me-1"></i> Edit
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(code)}
                      className="btn btn-sm btn-light-danger px-3"
                    >
                      <i className="bx bx-trash me-1"></i> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Modal Konfirmasi Hapus */}
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
                  {/* Icon */}
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: "64px", height: "64px", background: "#fff0f0" }}
                  >
                    <i className="bx bx-trash text-danger" style={{ fontSize: "28px" }}></i>
                  </div>

                  <h5 className="fw-bold mb-1">Hapus Data?</h5>
                  <p className="text-muted small mb-0">
                    Data{" "}
                    <span className="fw-semibold text-dark">
                      "{deleteTarget?.kode}"
                    </span>{" "}
                    akan dihapus secara permanen dan tidak dapat dikembalikan.
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

          {/* Modal Tambah Kode Arsip */}
          <div
            className="modal fade"
            id="tambahKodeMaster"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg"
              style={{ borderRadius: "20px" }}>
                <div className="modal-header border-0 pt-4 px-4">
                  <h5 className="fw-bold">
                  {isEdit ? "Update Kode Arsip" : "Tambah Kode Arsip Baru"}
                </h5>
                
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    />
                  </div>
                    
                  <form onSubmit={handleSubmit}>
                    <div className="modal-body" p-4>
                      <div className="text-center mb-4">
                        <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                          <i
                            className={`bx ${isEdit ? "bx-edit" : "bx-barcode"} fs-1 text-info`}
                          ></i>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Kode Arsip</label>
                        <input
                          type="text"
                          name="kode"
                          value={kode.kode}
                          onChange={(e) => setKode({ kode: e.target.value })}
                          className="form-control radius-30"
                          placeholder="Masukkan Kode Arsip"
                        />
                      </div>
                      </div>
                    <div className="modal-footer border-0 pb-4 px-4 gap-2">
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
                    Simpan Data
                  </button>
                </div>
                  </form>
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
        .bg-light { background-color: #f8f9fa !important; }

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
