import { Link, useNavigate, useLocation } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import AdminLayout from "../layouts/AdminLayout";

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

export default function LemariMaster() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cabinet, setCabinet] = useState({
    building_uuid: "",
    floor_uuid: "",
    room_uuid: "",
    name: "",
  });
  const [item, setItem] = React.useState({
    building_name: "",
    floor_name: "",
    room_name: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentUuid, setCurrentUuid] = useState(null);
  const [floorBuild, setFloorBuild] = useState([]);
  const [roomBuild, setRoomBuild] = useState([]);
  const { token, gedungs, floors, rooms, cabinets, refreshData } =
    React.useContext(PengajuanContext);
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
    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}/api/cabinets/${currentUuid}`
      : `${import.meta.env.VITE_API_URL}/api/cabinets`;

    const method = isEdit ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cabinet),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data");
      }

      // Close Modal secara otomatis
      const modalElement = document.getElementById("tambahLemariMaster");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();

      refreshData();
       if (isEdit) {
        showAlert("info", "Diperbarui!", `Data "${cabinet.name}" berhasil diperbarui.`);
      } else {
        showAlert("success", "Berhasil Ditambahkan!", `Data "${cabinet.name}" berhasil disimpan.`);
      }
    } catch (error) {
      console.error("Operasi Gagal:", error.message);
    }
  };

  const handleEdit = async (cabinetItem) => {
    setIsEdit(true);
    setCurrentUuid(cabinetItem.uuid);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/cabinets/${cabinetItem?.uuid}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const { data } = await response.json();
    handleChangeBuild(data?.room?.floor?.building_uuid);
    handleChangeFloor(data?.room?.floor_uuid);
    setCabinet({
      building_uuid: data?.room?.floor?.building_uuid,
      floor_uuid: data?.room?.floor_uuid,
      room_uuid: data?.room_uuid,
      name: cabinetItem.name,
    });
    setItem({
      building_name: data?.room?.floor?.building?.name,
      floor_name: data?.room?.floor?.name,
      room_name: data?.room?.name,
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
            `${import.meta.env.VITE_API_URL}/api/cabinets/${deleteTarget.uuid}`,
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
          showAlert("danger", "Dihapus!", `Data "${deleteTarget.name}" berhasil dihapus.`);
          setDeleteTarget(null);
        } catch (error) {
          showAlert("danger", "Gagal!", error.message);
        }
      };
  

  function handleChangeBuild(uuid) {
    const filterFloor = floors?.filter((floor) => floor.building_uuid == uuid);
    setCabinet({
      ...cabinet,
      building_uuid: uuid,
      floor_uuid: "",
      room_uuid: "",
    });
    setFloorBuild(filterFloor);
    setItem({ building_name: "", floor_name: "", room_name: "" });
  }

  function handleChangeFloor(uuid) {
    const filterRoom = rooms?.filter((room) => room.floor_uuid == uuid);
    setCabinet({ ...cabinet, floor_uuid: uuid, room_uuid: "" });
    setRoomBuild(filterRoom);
    setItem({ ...item, floor_name: "", room_name: "" });
  }

  const handleOpenModal = (data = null) => {
    if (data) {
      handleEdit(data);
    } else {
      setIsEdit(false);
      setCabinet({
        building_uuid: "",
        floor_uuid: "",
        room_uuid: "",
        name: "",
      });
      setItem({ building_name: "", floor_name: "", room_name: "" });
    }
    const modal = new bootstrap.Modal(
      document.getElementById("tambahLemariMaster"),
    );
    modal.show();
  };

  return (
    <AdminLayout>
      <Alert alerts={alerts} removeAlert={removeAlert} />
      <div className="page-wrapper px-4 py-4">
        {/* Header */}
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h4 className="fw-bold mb-0 text-dark">Data Master Lemari</h4>
            <p className="text-muted small mb-0">
              Manajemen level lemari pada setiap ruang penyimpanan.
            </p>
          </div>
          <div className="col-auto">
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary shadow-sm px-4 d-flex align-items-center gap-2"
              style={{ borderRadius: "10px" }}
            >
              <i className="bx bx-plus-circle"></i> Tambah Lemari
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-12 col-lg-3">
            <div
              className="card border-0 shadow-sm p-3"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted text-center">
                  Menu Data Master
                </h6>
                <Sidebar />
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="col-12 col-lg-9">
            <div className="row">
              {cabinets?.map((c) => (
                <div key={c.uuid} className="col-12 mb-3">
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
                          <i className="bx bxs-cabinet text-info fs-4"></i>
                        </div>
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">{c.name}</h6>
                          <div className="d-flex flex-wrap align-items-center gap-2">
                            <span className="text-primary small fw-medium">
                              {c.room?.floor?.building?.name || "Gedung"}
                            </span>
                            <span className="text-muted small">•</span>
                            <span className="badge bg-light text-secondary fw-normal border">
                              {c.room?.floor?.name || "Lantai"}
                            </span>
                            <span className="text-muted small">•</span>
                            <span className="badge bg-white text-primary border border-primary-subtle fw-normal">
                              {c.room?.name || "Ruangan"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleOpenModal(c)}
                          className="btn btn-sm btn-light-primary px-3"
                        >
                          <i className="bx bx-edit-alt me-1"></i> Edit
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(c)}
                          className="btn btn-sm btn-light-danger px-3"
                        >
                          <i className="bx bx-trash me-1"></i> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                    "{deleteTarget?.name}"
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

        {/* Modal */}
        <div
          className="modal fade"
          id="tambahLemariMaster"
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
                  {isEdit ? "Update Lemari" : "Tambah Lemari Baru"}
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
                        className={`bx ${isEdit ? "bx-edit" : "bxs-cabinet"} fs-1 text-info`}
                      ></i>
                    </div>
                    <p className="small text-muted">
                      Lengkapi detail lokasi penempatan lemari.
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Gedung</label>
                    <select
                      className="form-select border-0 bg-light py-2"
                      required
                      value={cabinet.building_uuid}
                      onChange={(e) => handleChangeBuild(e.target.value)}
                    >
                      <option value="">
                        {item.building_name || "Pilih Gedung"}
                      </option>
                      {gedungs?.map((g) => (
                        <option key={g.uuid} value={g.uuid}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Lantai</label>
                    <select
                      className="form-select border-0 bg-light py-2"
                      required
                      value={cabinet.floor_uuid}
                      onChange={(e) => handleChangeFloor(e.target.value)}
                      disabled={!cabinet.building_uuid}
                    >
                      <option value="">
                        {item.floor_name || "Pilih Lantai"}
                      </option>
                      {floorBuild?.map((f) => (
                        <option key={f.uuid} value={f.uuid}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Ruangan</label>
                    <select
                      className="form-select border-0 bg-light py-2"
                      required
                      value={cabinet.room_uuid}
                      onChange={(e) =>
                        setCabinet({ ...cabinet, room_uuid: e.target.value })
                      }
                      disabled={!cabinet.floor_uuid}
                    >
                      <option value="">
                        {item.room_name || "Pilih Ruangan"}
                      </option>
                      {roomBuild?.map((r) => (
                        <option key={r.uuid} value={r.uuid}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold">
                      Nama Lemari
                    </label>
                    <input
                      type="text"
                      className="form-control border-0 bg-light py-2"
                      placeholder="Contoh: Lemari A-01"
                      value={cabinet.name}
                      onChange={(e) =>
                        setCabinet({ ...cabinet, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer border-0 pb-4 px-4 gap-2">
                  <button
                    type="button"
                    className="btn btn-light flex-grow-1"
                    data-bs-dismiss="modal"
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary flex-grow-1">
                    Simpan Lemari
                  </button>
                </div>
              </form>
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
