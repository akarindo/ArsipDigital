import { Link, useNavigate, useLocation } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import AdminLayout from "../layouts/AdminLayout";

export default function RakMaster() {
  const navigate = useNavigate();
  const location = useLocation();
  const [shelf, setShelf] = useState({
    building_uuid: "",
    floor_uuid: "",
    room_uuid: "",
    cabinet_uuid: "",
    name: "",
  });
  const [item, setItem] = React.useState({
    building_name: "",
    floor_name: "",
    room_name: "",
    cabinet_name: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [currentUuid, setCurrentUuid] = useState(null);
  const [floorBuild, setFloorBuild] = useState([]);
  const [roomBuild, setRoomBuild] = useState([]);
  const [cabinetBuild, setCabinetBuild] = useState([]);

  const {
    token,
    gedungs,
    floors,
    rooms,
    cabinets,
    shelves,
    getShelves,
    refreshData,
  } = React.useContext(PengajuanContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}/api/shelves/${currentUuid}`
      : `${import.meta.env.VITE_API_URL}/api/shelves`;

    const method = isEdit ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shelf),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data");
      }

      // Reset & Close Modal
      handleCloseModal();
      refreshData();
    } catch (error) {
      console.error("Operasi Gagal:", error.message);
      alert(error.message);
    }
  };

  const handleEdit = async (shelfItem) => {
    setIsEdit(true);
    setCurrentUuid(shelfItem.uuid);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/shelves/${shelfItem?.uuid}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const { data } = await response.json();

    // Load dependent dropdowns
    handleChangeBuild(data?.cabinet?.room?.floor?.building_uuid);
    handleChangeFloor(data?.cabinet?.room?.floor_uuid);
    handleChangeRoom(data?.cabinet?.room_uuid);

    setShelf({
      building_uuid: data?.cabinet?.room?.floor?.building_uuid,
      floor_uuid: data?.cabinet?.room?.floor_uuid,
      room_uuid: data?.cabinet?.room_uuid,
      cabinet_uuid: data?.cabinet_uuid,
      name: shelfItem.name,
    });
    setItem({
      building_name: data?.cabinet?.room?.floor?.building?.name,
      floor_name: data?.cabinet?.room?.floor?.name,
      room_name: data?.cabinet?.room?.name,
      cabinet_name: data?.cabinet?.name,
    });
  };

  const handleDelete = async (currentShelf) => {
    if (
      window.confirm(
        "Peringatan: Menghapus Rak akan berdampak pada data di dalamnya!",
      )
    ) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/shelves/${currentShelf.uuid}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) throw new Error("Gagal menghapus data");
        refreshData();
      } catch (error) {
        console.error("Hapus Gagal:", error.message);
      }
    }
  };

  // --- Dropdown Logic ---
  function handleChangeBuild(uuid) {
    const filterFloor = floors?.filter((f) => f.building_uuid == uuid);
    setShelf((prev) => ({
      ...prev,
      building_uuid: uuid,
      floor_uuid: "",
      room_uuid: "",
      cabinet_uuid: "",
    }));
    setFloorBuild(filterFloor);
  }

  function handleChangeFloor(uuid) {
    const filterRoom = rooms?.filter((r) => r.floor_uuid == uuid);
    setShelf((prev) => ({
      ...prev,
      floor_uuid: uuid,
      room_uuid: "",
      cabinet_uuid: "",
    }));
    setRoomBuild(filterRoom);
  }

  function handleChangeRoom(uuid) {
    const filterCabinet = cabinets?.filter((c) => c.room_uuid == uuid);
    setShelf((prev) => ({ ...prev, room_uuid: uuid, cabinet_uuid: "" }));
    setCabinetBuild(filterCabinet);
  }

  const handleOpenModal = (data = null) => {
    if (data) {
      handleEdit(data);
    } else {
      setIsEdit(false);
      setShelf({
        building_uuid: "",
        floor_uuid: "",
        room_uuid: "",
        cabinet_uuid: "",
        name: "",
      });
      setItem({
        building_name: "",
        floor_name: "",
        room_name: "",
        cabinet_name: "",
      });
    }
    const modal = new bootstrap.Modal(
      document.getElementById("tambahRakMaster"),
    );
    modal.show();
  };

  const handleCloseModal = () => {
    const modalElement = document.getElementById("tambahRakMaster");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
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
              {shelves?.map((s) => (
                <div key={s.uuid} className="col-12 mb-3">
                  <div
                    className="card border-0 shadow-sm card-hover"
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="card-body d-flex align-items-center justify-content-between p-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3">
                          <img
                            src="/assets/images/block.png"
                            width={30}
                            alt="rak"
                          />
                        </div>
                        <div>
                          <h6 className="mb-1 fw-bold">{s.name}</h6>
                          <div className="d-flex flex-wrap align-items-center gap-1">
                            <span className="badge bg-light text-dark fw-normal border">
                              {s.cabinet?.room?.floor?.building?.name}
                            </span>
                            <i className="bi bi-chevron-right small text-muted"></i>
                            <span className="badge bg-light text-dark fw-normal border">
                              {s.cabinet?.room?.name}
                            </span>
                            <i className="bi bi-chevron-right small text-muted"></i>
                            <span className="badge bg-primary-subtle text-primary fw-medium border border-primary-subtle">
                              {s.cabinet?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleOpenModal(s)}
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
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

        {/* Modal Form */}
        <div
          className="modal fade"
          id="tambahRakMaster"
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
                  {isEdit ? "Update Rak" : "Tambah Rak Baru"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Gedung</label>
                    <select
                      className="form-select border-0 bg-light py-2"
                      required
                      value={shelf.building_uuid}
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

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Lantai</label>
                      <select
                        className="form-select border-0 bg-light py-2"
                        required
                        value={shelf.floor_uuid}
                        onChange={(e) => handleChangeFloor(e.target.value)}
                        disabled={!shelf.building_uuid}
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
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">
                        Ruangan
                      </label>
                      <select
                        className="form-select border-0 bg-light py-2"
                        required
                        value={shelf.room_uuid}
                        onChange={(e) => handleChangeRoom(e.target.value)}
                        disabled={!shelf.floor_uuid}
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
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Lemari</label>
                    <select
                      className="form-select border-0 bg-light py-2"
                      required
                      value={shelf.cabinet_uuid}
                      onChange={(e) =>
                        setShelf({ ...shelf, cabinet_uuid: e.target.value })
                      }
                      disabled={!shelf.room_uuid}
                    >
                      <option value="">
                        {item.cabinet_name || "Pilih Lemari"}
                      </option>
                      {cabinetBuild?.map((c) => (
                        <option key={c.uuid} value={c.uuid}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold">Nama Rak</label>
                    <input
                      type="text"
                      className="form-control border-0 bg-light py-2"
                      placeholder="Contoh: Rak Baris 1"
                      value={shelf.name}
                      onChange={(e) =>
                        setShelf({ ...shelf, name: e.target.value })
                      }
                      required
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
    </AdminLayout>
  );
}
