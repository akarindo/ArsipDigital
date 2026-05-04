import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
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

export default function FolderMaster() {
  const [folder, setFolder] = useState({
    building_uuid: "",
    floor_uuid: "",
    room_uuid: "",
    cabinet_uuid: "",
    shelf_uuid: "",
    name: "",
  });
  const [shelfBuild, setShelfBuild] = useState([]);
  const [cabinetBuild, setCabinetBuild] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUuid, setCurrentUuid] = useState(null);
  const [floorBuild, setFloorBuild] = useState([]);
  const [item, setItem] = React.useState({
    building_name: "",
    floor_name: "",
    room_name: "",
    cabinet_name: "",
    shelf_name: "",
  });
  const [roomBuild, setRoomBuild] = useState([]);
  const [rak, setRak] = useState(null);
  const [lemari, setLemari] = useState(null);
  const {
    token,
    gedungs,
    floors,
    rooms,
    cabinets,
    shelves,
    folders,
    refreshData,
  } = React.useContext(PengajuanContext);
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
    console.log("id", currentUuid);
    console.log("folder", folder);
    // Tentukan URL dan Method berdasarkan mode (Edit atau Tambah)
    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}/api/folders/${currentUuid}`
      : `${import.meta.env.VITE_API_URL}/api/folders`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(folder),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data");
      }

      // Reset Form & State
      setFolder({
        building_uuid: "",
        floor_uuid: "",
        room_uuid: "",
        cabinet_uuid: "",
        shelf_uuid: "",
        name: "",
      });
      setIsEdit(false);
      setCurrentUuid(null);
      refreshData();
      handleCloseModal();
      if (isEdit) {
        showAlert("info", "Diperbarui!", `Data "${folder.name}" berhasil diperbarui.`);
      } else {
        showAlert("success", "Berhasil Ditambahkan!", `Data "${folder.name}" berhasil disimpan.`);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };
  const handleEdit = async (folderItem) => {
    setIsEdit(true);
    setCurrentUuid(folderItem.uuid);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/folders/${folderItem?.uuid}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const { data } = await response.json();

    // 1. Definisikan data secara eksplisit
    const buildingId = data?.shelf?.cabinet?.room?.floor?.building_uuid;
    const floorId = data?.shelf?.cabinet?.room?.floor_uuid;
    const roomId = data?.shelf?.cabinet?.room_uuid;
    const cabinetId = data?.shelf?.cabinet_uuid;

    handleChangeBuild(buildingId);
    handleChangeFloor(floorId);
    handleChangeRoom(roomId);
    handleChangeCabinet(cabinetId);
    setFolder({
      building_uuid: buildingId,
      floor_uuid: floorId,
      room_uuid: roomId,
      cabinet_uuid: cabinetId,
      shelf_uuid: data?.shelf_uuid,
      name: folderItem.name, // Ambil langsung dari parameter
    });
    setItem({
      building_name: data?.shelf?.cabinet?.room?.floor?.building?.name,
      floor_name: data?.shelf?.cabinet?.room?.floor?.name,
      room_name: data?.shelf?.cabinet?.room?.name,
      cabinet_name: data?.shelf?.cabinet?.name,
      shelf_name: data?.shelf?.name,
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
            `${import.meta.env.VITE_API_URL}/api/folders/${deleteTarget.uuid}`,
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
    setFolder({ ...folder, building_uuid: uuid });
    setFloorBuild(filterFloor);
    setItem({
      building_name: "",
      floor_name: "",
      room_name: "",
      cabinet_name: "",
      shelf_name: "",
    });
  }
  function handleChangeFloor(uuid) {
    const filterRoom = rooms?.filter((room) => room.floor_uuid == uuid);
    setFolder({ ...folder, floor_uuid: uuid });
    setRoomBuild(filterRoom);
    setItem({
      building_name: item.building_name,
      floor_name: "",
      room_name: "",
      cabinet_name: "",
      shelf_name: "",
    });
  }
  function handleChangeRoom(uuid) {
    const filterCabinet = cabinets?.filter(
      (cabinet) => cabinet.room_uuid == uuid,
    );
    setFolder({ ...folder, room_uuid: uuid });
    setCabinetBuild(filterCabinet);
    setItem({
      building_name: item.building_name,
      floor_name: item.floor_name,
      room_name: "",
      cabinet_name: "",
      shelf_name: "",
    });
  }
  function handleChangeCabinet(uuid) {
    const filterShelf = shelves?.filter((shelf) => shelf.cabinet_uuid == uuid);
    setFolder({ ...folder, cabinet_uuid: uuid });
    setShelfBuild(filterShelf);
    setItem({
      building_name: item.building_name,
      floor_name: item.floor_name,
      room_name: item.room_name,
      cabinet_name: "",
      shelf_name: "",
    });
  }
  const handleOpenModal = (data = null) => {
    if (data) {
      handleEdit(data);
    } else {
      setIsEdit(false);
      setFolder({
        building_uuid: "",
        floor_uuid: "",
        room_uuid: "",
        cabinet_uuid: "",
        shelf_uuid: "",
        name: "",
      });
      setItem({
        building_name: "",
        floor_name: "",
        room_name: "",
        cabinet_name: "",
        shelf_name: "",
      });
    }
    const modal = new bootstrap.Modal(
      document.getElementById("tambahFolderMaster"),
    );
    modal.show();
  };

  const handleCloseModal = () => {
    const modalElement = document.getElementById("tambahFolderMaster");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
  };
  return (
    <AdminLayout>
      <Alert alerts={alerts} removeAlert={removeAlert} />
      <div className="page-wrapper px-4 py-4">
        {/* Header */}
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h4 className="fw-bold mb-0 text-dark">Data Master Folder</h4>
            <p className="text-muted small mb-0">
              Manajemen level folder pada setiap rak penyimpanan.
            </p>
          </div>
          <div className="col-auto">
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary shadow-sm px-4 d-flex align-items-center gap-2"
              style={{ borderRadius: "10px" }}
            >
              <i className="bx bx-plus-circle"></i> Tambah Folder
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
              {folders?.map((folder) => (
                <div
                  key={folder.uuid}
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
                          <i className="bx bx-folder text-info fs-4"></i>
                        </div>
                    
                      <h6 className="mb-1 fw-bold">{folder.name}</h6>
          
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleOpenModal(folder)}
                      className="btn btn-sm btn-light-primary px-3"
                    >
                      <i className="bx bx-edit-alt me-1"></i> Edit
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(folder)}
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

          {/* Modal Form */}
          <div
            className="modal fade"
            id="tambahFolderMaster"
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
                    {isEdit ? "Update Folder" : "Tambah Folder Baru"}
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
                        className={`bx ${isEdit ? "bx-edit" : "bx-folder"} fs-1 text-info`}
                      ></i>
                    </div>
                  </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Gedung</label>
                      <select
                        className="form-select border-0 bg-light py-2"
                        required
                        value={folder.building_uuid}
                        onChange={(e) => handleChangeBuild(e.target.value)}
                        id=""
                      >
                        {item.building_name != "" ? (
                          <option value={folder.building_uuid}>
                            {item?.building_name}
                          </option>
                        ) : (
                          <option value="">Pilih Gedung</option>
                        )}
                        {gedungs?.map((gedung) => (
                          <option key={gedung.uuid} value={gedung.uuid}>
                            {gedung.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Lantai</label>
                      <select
                        className="form-select border-0 bg-light py-2"
                        name="floor_uuid"
                        required
                        value={folder.floor_uuid}
                        onChange={(e) => handleChangeFloor(e.target.value)}
                        id=""
                      >
                        {item.floor_name != "" ? (
                          <option value={folder.floor_uuid}>
                            {item.floor_name}
                          </option>
                        ) : (
                          <option value="">Pilih Lantai</option>
                        )}
                        {floorBuild?.map((floor) => (
                          <option key={floor.uuid} value={floor.uuid}>
                            {floor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Ruang</label>
                      <select
                        className="form-select border-0 bg-light py-2"
                        name="room_uuid"
                        required
                        value={folder.room_uuid}
                        onChange={(e) => handleChangeRoom(e.target.value)}
                        id=""
                      >
                        {item.room_name != "" ? (
                          <option value={folder.room_uuid}>
                            {item.room_name}
                          </option>
                        ) : (
                          <option value="">Pilih Ruang</option>
                        )}
                        {roomBuild?.map((room) => (
                          <option key={room.uuid} value={room.uuid}>
                            {room.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Lemari</label>
                      <select
                        className="form-select border-0 bg-light py-2"
                        name="cabinet_uuid"
                        required
                        value={folder.cabinet_uuid}
                        onChange={(e) => handleChangeCabinet(e.target.value)}
                        id=""
                      >
                        {item.cabinet_name != "" ? (
                          <option value={folder.cabinet_uuid}>
                            {item.cabinet_name}
                          </option>
                        ) : (
                          <option value="">Pilih Lemari</option>
                        )}
                        {cabinetBuild?.map((cabinet) => (
                          <option key={cabinet.uuid} value={cabinet.uuid}>
                            {cabinet.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Rak</label>
                      <select
                        className="form-select border-0 bg-light py-2"
                        name="shelf_uuid"
                        required
                        value={folder.shelf_uuid}
                        onChange={(e) =>
                          setFolder({ ...folder, shelf_uuid: e.target.value })
                        }
                        id=""
                      >
                        {item.shelf_name != "" ? (
                          <option value={folder.shelf_uuid}>
                            {item.shelf_name}
                          </option>
                        ) : (
                          <option value="">Pilih Rak</option>
                        )}

                        {shelfBuild?.map((shelf) => (
                          <option key={shelf.uuid} value={shelf.uuid}>
                            {shelf.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Folder</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={folder.name}
                        onChange={(e) =>
                          setFolder({ ...folder, name: e.target.value })
                        }
                        className="form-control radius-30"
                        placeholder="Masukkan Nama Folder"
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
                    {isEdit ? "Update Data" : "Simpan Data"}
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
