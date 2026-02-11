import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
import Sidebar from "../Sidebar";
import AdminLayout from "../layouts/AdminLayout";

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
  const handleDelete = async (currentFolder) => {
    if (
      window.confirm(
        "Peringatan: Menghapus item ini akan menghapus semua sub-item di dalamnya!",
      )
    ) {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/api/folders/" + currentFolder.uuid,
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
      } catch (error) {
        // 'error.message' akan berisi pesan dari 'throw new Error' di atas
        console.error("Login Gagal:", error.message);
      }
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
                    <div className>
                      <img
                        src="/assets/images/block.png"
                        width={40}
                        height={50}
                        alt
                      />
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-1 font-14">{folder.name}</h6>
                    </div>
                  </div>
                  <div className="kanan" style={{ display: "flex" }}>
                    <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                      <div className>
                        <h7 className="mb-1">Aksi:</h7>
                      </div>
                      <button
                        onClick={() => {
                          // setFolder(folder);
                          handleEdit(folder);
                        }}
                        type="button"
                        className="btn-edit pt-1 pb-1"
                        data-bs-toggle="modal"
                        data-bs-target="#tambahFolderMaster"
                        style={{ width: "100%" }}
                      >
                        <img
                          src="/assets/images/edit.png"
                          alt=""
                          width="15px"
                          height="15px"
                          style={{ marginRight: 8 }}
                        />
                        Edit
                      </button>

                      <div className="w-45">
                        <button
                          onClick={() => handleDelete(folder)}
                          type="submit"
                          className="btn-hapus pt-1 pb-1"
                          style={{ width: "100%" }}
                        >
                          <img
                            src="/assets/images/hapus.png"
                            width="15px"
                            height="15px"
                            style={{ marginRight: 8 }}
                            alt
                          />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                            {isEdit ? "Update Data" : "Simpan Data"}
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
      </div>
    </AdminLayout>
  );
}
