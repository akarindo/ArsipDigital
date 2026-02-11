import { Link, useNavigate, useLocation } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import AdminLayout from "../layouts/AdminLayout";

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

  const handleDelete = async (currentCabinet) => {
    if (
      window.confirm(
        "Peringatan: Menghapus item ini akan menghapus semua sub-item di dalamnya!",
      )
    ) {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/api/cabinets/" + currentCabinet.uuid,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Gagal menghapus");
        refreshData();
      } catch (error) {
        console.error("Hapus Gagal:", error.message);
      }
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
      <div className="page-wrapper px-4 py-4">
        {/* Header */}
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h4 className="fw-bold mb-0 text-dark">Data Master Lantai</h4>
            <p className="text-muted small mb-0">
              Manajemen level lantai pada setiap gedung penyimpanan.
            </p>
          </div>
          <div className="col-auto">
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary shadow-sm px-4 d-flex align-items-center gap-2"
              style={{ borderRadius: "10px" }}
            >
              <i className="bx bx-plus-circle"></i> Tambah Ruang
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
                    className="card border-0 shadow-sm transition-all"
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="card-body d-flex align-items-center justify-content-between p-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-primary bg-opacity-10 p-3 rounded-3 me-3 d-flex align-items-center justify-content-center"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <img
                            src="/assets/images/block.png"
                            width={30}
                            alt="icon"
                          />
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
                          className="btn btn-sm btn-outline-primary px-3 rounded-pill"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          className="btn btn-sm btn-outline-danger px-3 rounded-pill"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                  {isEdit ? "Update Lantai" : "Tambah Lantai Baru"}
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
                    <img
                      src="/assets/images/documents.png"
                      width="60"
                      className="mb-2"
                      alt=""
                    />
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
    </AdminLayout>
  );
}
