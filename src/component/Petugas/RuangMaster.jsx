import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
import Sidebar from "../Sidebar";
import AdminLayout from "../layouts/AdminLayout";

export default function RuangMaster() {
  const navigate = useNavigate();
  const location = useLocation();
  const [room, setRoom] = useState({
    building_uuid: "",
    floor_uuid: "",
    name: "",
  });
  const [item, setItem] = React.useState({
    building_name: "",
    floor_name: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentUuid, setCurrentUuid] = useState(null);
  const [floorBuild, setFloorBuild] = useState([]);
  const { token, gedungs, floors, rooms, refreshData } =
    React.useContext(PengajuanContext);
  const getModal = () => {
    const modalEl = document.getElementById("tambahLantaiMaster");
    return window.bootstrap.Modal.getOrCreateInstance(modalEl);
  };

  const handleOpenModal = async (item = null) => {
    if (item) {
      setIsEdit(true);
      setCurrentUuid(item.uuid);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rooms/${item?.uuid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const { data } = await response.json();
      handleChangeBuild(data?.floor?.building_uuid);
      setRoom({
        building_uuid: data?.floor?.building_uuid,
        floor_uuid: data?.floor_uuid,
        name: data?.name,
      });
      setItem({
        building_name: data?.floor?.building?.name,
        floor_name: data?.floor?.name,
      });
    } else {
      setIsEdit(false);
      setRoom({
        building_uuid: "",
        floor_uuid: "",
        name: "",
      });
      setItem({
        building_name: "",
        floor_name: "",
      });
    }
    getModal().show();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}/api/rooms/${currentUuid}`
      : `${import.meta.env.VITE_API_URL}/api/rooms`;

    const method = isEdit ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(room),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login Gagal");
      }
      getModal().hide();
      refreshData();
    } catch (error) {
      // 'error.message' akan berisi pesan dari 'throw new Error' di atas
      console.error("Login Gagal:", error.message);
    }
  };
  const handleDelete = async (currentRoom) => {
    if (
      window.confirm(
        "Peringatan: Menghapus item ini akan menghapus semua sub-item di dalamnya!",
      )
    ) {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/api/rooms/" + currentRoom.uuid,
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

        if (!response.ok) {
          throw new Error(result.message || "Login Gagal");
        }
        refreshData();
        // getRooms(token);
      } catch (error) {
        // 'error.message' akan berisi pesan dari 'throw new Error' di atas
        console.error("Login Gagal:", error.message);
      }
    }
  };
  const handleEdit = async (roomItem) => {
    setIsEdit(true);
    setCurrentUuid(roomItem.uuid);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/rooms/${roomItem?.uuid}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const { data } = await response.json();
    handleChangeBuild(data?.floor?.building_uuid);
    setRoom({
      building_uuid: data?.floor?.building_uuid,
      floor_uuid: data?.floor_uuid,
      name: data?.name,
    });
  };
  function handleChangeBuild(uuid) {
    const filterFloor = floors?.filter((floor) => floor.building_uuid == uuid);
    setRoom({ ...room, building_uuid: uuid });
    setFloorBuild(filterFloor);
    setItem({
      building_name: "",
      floor_name: "",
    });
  }

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
              {rooms?.map((item) => (
                <div key={item.uuid} className="col-12 mb-3">
                  <div
                    className="card border-0 shadow-sm transition-hover"
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
                          <h6 className="mb-0 fw-bold">{item.name}</h6>
                          {/* <span className="text-muted extra-small">
                            <i className="bx bx-building me-1"></i>
                            {getBuildingName(item.building_uuid)}
                          </span> */}
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="btn btn-sm btn-light-primary text-primary px-3"
                        >
                          <i className="bx bx-edit-alt me-1"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="btn btn-sm btn-light-danger text-danger px-3"
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

        {/* Modal */}
        <div
          className="modal fade"
          id="tambahLantaiMaster"
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
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Pilih Gedung Induk
                    </label>
                    <select
                      className="form-select border-0 bg-light"
                      style={{ borderRadius: "12px", padding: "12px" }}
                      required
                      value={room.building_uuid}
                      onChange={(e) => handleChangeBuild(e.target.value)}
                      id=""
                    >
                      {item.building_name != "" ? (
                        <option value={room.building_uuid}>
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
                    <label className="form-label fw-semibold">
                      Pilih Lantai
                    </label>
                    <select
                      className="form-select border-0 bg-light"
                      style={{ borderRadius: "12px", padding: "12px" }}
                      required
                      value={room.floor_uuid}
                      onChange={(e) =>
                        setRoom({ ...room, floor_uuid: e.target.value })
                      }
                      id=""
                    >
                      {item.floor_name != "" ? (
                        <option value={room.floor_uuid}>
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
                    <label className="form-label">Ruang</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={room.name}
                      onChange={(e) =>
                        setRoom({ ...room, name: e.target.value })
                      }
                      className="form-control radius-30"
                      placeholder="Masukkan Ruang Arsip"
                    />
                  </div>
                  <div className="p-3 pt-0">
                    <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                      <div className="w-50">
                        <button
                          type="button"
                          className="btn-batal"
                          style={{ width: "100%" }}
                        >
                          Batal
                        </button>
                      </div>
                      <div className="w-50">
                        <button
                          type="submit"
                          className="btn-tambah"
                          style={{ width: "100%" }}
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .transition-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .transition-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
        .btn-light-primary { background: #eef4ff; border: none; }
        .btn-light-danger { background: #fff0f0; border: none; }
        .extra-small { font-size: 11px; display: block; margin-top: 2px; }
      `}</style>
    </AdminLayout>
  );
}
