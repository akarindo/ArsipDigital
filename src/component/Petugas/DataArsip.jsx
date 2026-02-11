import { Link, useNavigate, useLocation } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function DataArsip({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [shelfBuild, setShelfBuild] = useState([]);
  const [cabinetBuild, setCabinetBuild] = useState([]);
  const [type, setType] = React.useState(null);
  const [floorBuild, setFloorBuild] = useState([]);
  const [roomBuild, setRoomBuild] = useState([]);
  const [folderBuild, setFolderBuild] = useState([]);
  const {
    token,
    gedungs,
    user,
    tujuans,
    arsips,
    isEdit,
    currentUuid,
    formDataArsip,
    setIsEdit,
    setFormDataArsip,
    floors,
    rooms,
    cabinets,
    shelves,
    folders,
    names,
    role,
  } = React.useContext(PengajuanContext);
  const tab = location.pathname.includes("ArsipDigitalPetugas")
    ? "ArsipDigitalPetugas"
    : "Arsip Fisik";
  function handleType(value) {
    if (value === "dinamis") {
      setType("dinamis");
    } else {
      setType(null); // Sembunyikan jika bukan dinamis
    }
  }
  function handleChangeBuild(uuid) {
    const filterFloor = floors?.filter((floor) => floor.building_uuid == uuid);
    setFloorBuild(filterFloor);
  }
  function handleChangeFloor(uuid) {
    const filterRoom = rooms?.filter((room) => room.floor_uuid == uuid);
    setRoomBuild(filterRoom);
  }
  function handleChangeRoom(uuid) {
    const filterCabinet = cabinets?.filter(
      (cabinet) => cabinet.room_uuid == uuid,
    );
    setCabinetBuild(filterCabinet);
  }
  function handleChangeCabinet(uuid) {
    const filterShelf = shelves?.filter((shelf) => shelf.cabinet_uuid == uuid);
    setShelfBuild(filterShelf);
  }
  function handleChangeShelf(uuid) {
    const filterFolder = folders?.filter((folder) => folder.shelf_uuid == uuid);
    setFolderBuild(filterFolder);
  }
  const jenisArsip = [
    {
      name: "Dinamis",
      type: "dinamis",
    },
    {
      name: "Statis",
      type: "statis",
    },
  ];
  const [formData, setFormData] = useState({
    user_uuid: user?.uuid,
    arsip_uuid: "",
    tujuan_uuid: "",
    status: "pending",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleInputChangeArsip = (e) => {
    const { name, value } = e.target;
    setFormDataArsip((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCheckboxChangeArsip = (e) => {
    const { name, value, checked } = e.target;

    setFormDataArsip((prev) => {
      // Ambil array yang sudah ada atau buat array kosong jika belum ada
      const currentList = prev[name] || [];

      if (checked) {
        // Tambahkan nilai jika dicentang
        return { ...prev, [name]: value };
      } else {
        // Hapus nilai jika centang dilepas
        return {
          ...prev,
          [name]: currentList.filter((item) => item !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.arsip_uuid || !formData.tujuan_uuid) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }
    try {
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/api/peminjamans/${currentUuid}`
        : `${import.meta.env.VITE_API_URL}/api/peminjamans`;

      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login Gagal");
      }
      // setGedung({ building_uuid: "", name: "" });
      setIsEdit(false);
      setCurrentUuid(null);
      refreshData();
      const modalElement = document.getElementById("tambahGedungMaster");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    } catch (error) {
      console.error("Login Gagal:", error.message);
    }

    setFormData({
      user_uuid: "",
      arsip_uuid: "",
      tujuan_uuid: "",
      status: "pending",
    });

    // Tutup modal form menggunakan Bootstrap
    const modalElement = document.getElementById("modalFisik");
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }

    // Hapus backdrop secara manual
    setTimeout(() => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }, 100);

    // Tampilkan modal sukses
    setShowSuccessModal(true);
  };

  const handleSubmitArsip = async (e) => {
    e.preventDefault();
    // Validasi form
    // if (!formData.namaPetugas || !formData.namaArsip || !formData.tujuan) {
    //   alert("Mohon lengkapi semua field yang wajib diisi!");
    //   return;
    // }
    try {
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/api/arsips/${currentUuid}`
        : `${import.meta.env.VITE_API_URL}/api/arsips`;

      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formDataArsip),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login Gagal");
      }
      // setGedung({ building_uuid: "", name: "" });
      setIsEdit(false);
      setCurrentUuid(null);
      refreshData();
      const modalElement = document.getElementById("tambahGedungMaster");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    } catch (error) {
      console.error("Login Gagal:", error.message);
    }

    setFormDataArsip({
      file: null,
      name_uuid: null,
      tipe_arsip: null,
      judul_arsip: null,
      jenis_arsip: null,
      kategori_arsip: null,
      gedung_uuid: null,
      lantai_uuid: null,
      ruang_uuid: null,
      lemari_uuid: null,
      rak_uuid: null,
      folder_uuid: null,
      kode_arsip: null,
      keterangan: null,
    });

    // Tutup modal form menggunakan Bootstrap
    const modalElement = document.getElementById("modalFisik");
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }

    // Hapus backdrop secara manual
    setTimeout(() => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }, 100);

    // Tampilkan modal sukses
    // setShowSuccessModal(true);
  };

  const handleSuccessOke = () => {
    // Tutup modal sukses
    setShowSuccessModal(false);

    // Hapus semua backdrop yang mungkin masih ada
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((backdrop) => backdrop.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    // Navigate ke log pengajuan
    navigate("/logPengajuanStaff");
  };

  // Cleanup saat component unmount
  useEffect(() => {
    return () => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);
  return (
    <AdminLayout>
      <div className="page-wrapper">
        <div className="page-content">
          <div className="d-flex align-items-center">
            <div className="search-bar flex-grow-1">
              <h4>Data Arsip</h4>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="search-bar flex-grow-1">
              <ul className="nav nav-pills mb-3" role="tablist">
                <li
                  onClick={() => navigate("/dataArsip")}
                  className={`nav-item ${tab === "Arsip Fisik" ? "active" : ""}`}
                  role="presentation"
                  style={{ width: "50%", cursor: "pointer" }}
                >
                  <div
                    className="nav-link active"
                    data-bs-toggle="pill"
                    href="#primary-pills-home"
                    role="tab"
                    aria-selected="true"
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="tab-title">Arsip Fisik</div>
                    </div>
                  </div>
                </li>
                <li
                  onClick={() =>
                    navigate("/dataArsipPetugas/ArsipDigitalPetugas")
                  }
                  className={`nav-item ${tab === "ArsipDigitalPetugas" ? "active" : ""}`}
                  role="presentation"
                  style={{ width: "50%", cursor: "pointer" }}
                >
                  <div
                    className="nav-link"
                    data-bs-toggle="pill"
                    href="#primary-pills-profile"
                    role="tab"
                    aria-selected="false"
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="tab-title">Arsip Digital</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {role == "staff umum" ? (
              <div className="user-box">
                <div className="col mb-3">
                  <button
                    type="button"
                    className="btn-tambah px-5"
                    onClick={() => {
                      setIsEdit(false);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modaltambahFisik"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            ) : role == "pegawai" ? (
              <div className="user-box">
                <div className="col mb-3">
                  <button
                    type="button"
                    className="btn-pengajuan px-5 pb-2 pt-2"
                    data-bs-toggle="modal"
                    data-bs-target="#modalFisik"
                  >
                    Pengajuan Peminjaman
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          {children}

          {/* Modal Tambah Fisik */}
          <div
            className="modal fade"
            id="modaltambahFisik"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header" style={{ border: "none" }}>
                  <h5 className="modal-title">
                    Formulir Penambahan Data Arsip Fisik
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <img src="assets/images/documents.png" />
                  <form onSubmit={handleSubmitArsip}>
                    <div className="mb-3">
                      <label className="form-label">Nama Arsip</label>
                      <select
                        name="name_uuid"
                        onChange={(e) => handleInputChangeArsip(e)}
                        value={formDataArsip.name_uuid}
                        className="form-select mb-3 radius-30"
                        aria-label="Default select example"
                      >
                        <option selected>Pilih Arsip</option>
                        {names?.map((name) => (
                          <option key={name.uuid} value={name.uuid}>
                            {name.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="input-group mb-3">
                      <span class="input-group-text" id="basic-addon1">
                        Judul Arsip
                      </span>
                      <input
                        type="text"
                        value={formDataArsip.judul_arsip}
                        onChange={(e) => handleInputChangeArsip(e)}
                        class="form-control"
                        name="judul_arsip"
                        placeholder="Judul Arsip"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Tipe Arsip</label>
                      <select
                        name="tipe_arsip"
                        value={formDataArsip.tipe_arsip}
                        className="form-select mb-3 radius-30"
                        onChange={(e) => {
                          handleType(e.target.value);
                          handleInputChangeArsip(e);
                        }}
                      >
                        <option value="">Pilih Tipe Arsip</option>
                        {jenisArsip?.map((arsip) => (
                          <option key={arsip.type} value={arsip.type}>
                            {arsip.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {type === "dinamis" && (
                      <>
                        <label className="form-label mt-6">
                          Jenis Arsip (Khusus Dinamis)
                        </label>
                        <div
                          className="line-check mb-6"
                          style={{ display: "flex" }}
                        >
                          <div
                            className="form-check"
                            style={{ marginRight: 10 }}
                          >
                            <input
                              name="jenis_arsip"
                              value={"vital"}
                              onChange={handleCheckboxChangeArsip}
                              className="form-check-input"
                              type="checkbox"
                              id="vital"
                            />
                            <label className="form-check-label" htmlFor="vital">
                              Vital
                            </label>
                          </div>
                          <div
                            className="form-check"
                            style={{ marginRight: 10 }}
                          >
                            <input
                              name="jenis_arsip"
                              value={"active"}
                              onChange={handleCheckboxChangeArsip}
                              className="form-check-input"
                              type="checkbox"
                              id="active"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="active"
                            >
                              Active
                            </label>
                          </div>
                          <div
                            className="form-check"
                            style={{ marginRight: 10 }}
                          >
                            <input
                              name="jenis_arsip"
                              value={"inactive"}
                              onChange={handleCheckboxChangeArsip}
                              className="form-check-input"
                              type="checkbox"
                              id="inactive"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="inactive"
                            >
                              Inactive
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                    <label className="form-label mt-6">Kategori Arsip</label>
                    <div
                      className="line-check mb-6"
                      style={{ display: "flex" }}
                    >
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="kategori_arsip"
                          value={"surat"}
                          onChange={handleCheckboxChangeArsip}
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Surat
                        </label>
                      </div>
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="kategori_arsip"
                          value={"laporan"}
                          onChange={handleCheckboxChangeArsip}
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Laporan
                        </label>
                      </div>
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="kategori_arsip"
                          value={"file"}
                          onChange={handleCheckboxChangeArsip}
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          File
                        </label>
                      </div>
                    </div>
                    <div className="line" style={{ display: "flex" }}>
                      <div className="mb-3">
                        <label className="form-label">Gedung</label>
                        <select
                          name="gedung_uuid"
                          value={formDataArsip.gedung_uuid}
                          onChange={(e) => {
                            handleChangeBuild(e.target.value);
                            handleInputChangeArsip(e);
                          }}
                          className="form-select mb-3 radius-30"
                          aria-label="Default select example"
                        >
                          <option selected>Pilih Gedung</option>
                          {gedungs?.map((gedung) => (
                            <option key={gedung.uuid} value={gedung.uuid}>
                              {gedung.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Lantai</label>
                        <select
                          name="lantai_uuid"
                          value={formDataArsip.lantai_uuid}
                          onChange={(e) => {
                            handleChangeFloor(e.target.value);
                            handleInputChangeArsip(e);
                          }}
                          className="form-select mb-3 radius-30"
                          aria-label="Default select example"
                        >
                          <option selected>Pilih Lantai</option>
                          {floorBuild?.map((floor) => (
                            <option key={floor.uuid} value={floor.uuid}>
                              {floor.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Ruang</label>
                        <select
                          value={formDataArsip.ruang_uuid}
                          name="ruang_uuid"
                          onChange={(e) => {
                            handleChangeRoom(e.target.value);
                            handleInputChangeArsip(e);
                          }}
                          className="form-select mb-3 radius-30"
                          aria-label="Default select example"
                        >
                          <option selected>Pilih Ruang</option>
                          {roomBuild?.map((room) => (
                            <option key={room.uuid} value={room.uuid}>
                              {room.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="line" style={{ display: "flex" }}>
                      <div className="mb-3">
                        <label className="form-label">Lemari</label>
                        <select
                          value={formDataArsip.lemari_uuid}
                          name="lemari_uuid"
                          onChange={(e) => {
                            handleChangeCabinet(e.target.value);
                            handleInputChangeArsip(e);
                          }}
                          className="form-select mb-3 radius-30"
                          aria-label="Default select example"
                        >
                          <option selected>Pilih Lemari</option>
                          {cabinetBuild?.map((cabinet) => (
                            <option key={cabinet.uuid} value={cabinet.uuid}>
                              {cabinet.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Rak</label>
                        <select
                          name="rak_uuid"
                          value={formDataArsip.rak_uuid}
                          onChange={(e) => {
                            handleChangeShelf(e.target.value);
                            handleInputChangeArsip(e);
                          }}
                          className="form-select mb-3 radius-30"
                          aria-label="Default select example"
                        >
                          <option selected>Pilih Rak</option>
                          {shelfBuild?.map((shelf) => (
                            <option key={shelf.uuid} value={shelf.uuid}>
                              {shelf.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Folder</label>
                        <select
                          name="folder_uuid"
                          value={formDataArsip.folder_uuid}
                          onChange={(e) => handleInputChangeArsip(e)}
                          className="form-select mb-3 radius-30"
                          aria-label="Default select example"
                        >
                          <option selected>Pilih Folder</option>
                          {folderBuild?.map((folder) => (
                            <option key={folder.uuid} value={folder.uuid}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Keterangan</label>
                      <input
                        name="keterangan"
                        onChange={(e) => handleInputChangeArsip(e)}
                        value={formDataArsip.keterangan}
                        type="text"
                        className="form-control radius-30"
                      />
                    </div>
                    <div className="p-3 pt-0">
                      <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                        <div className="w-50">
                          <button
                            type="button"
                            className="btn btn-outline-primary radius-30"
                            style={{ width: "100%" }}
                          >
                            Batal
                          </button>
                        </div>
                        <div className="w-50">
                          <button
                            type="submit"
                            className="btn btn-primary radius-30"
                            style={{ width: "100%" }}
                            data-bs-toggle="modal"
                            data-bs-target="#berhasilTambahFisik"
                          >
                            Tambah
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="modalFisik"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header" style={{ border: "none" }}>
                <h5 className="modal-title" style={{ paddingLeft: "15%" }}>
                  Formulir Peminjaman Arsip Fisik
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body pt-0">
                <img
                  src="/assets/images/documents.png"
                  style={{ width: 100, margin: "auto", display: "flex" }}
                />
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nama Arsip</label>
                    <select
                      className="form-select mb-3"
                      style={{ borderRadius: 30 }}
                      name="arsip_uuid"
                      value={formData.arsip_uuid}
                      onChange={handleInputChange}
                    >
                      <option value="">Nama Arsip</option>
                      {arsips?.map((arsip) => (
                        <option value={arsip.uuid}>{arsip.judul_arsip}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Pilih Tujuan</label>
                    <select
                      className="form-select"
                      style={{ borderRadius: 30 }}
                      name="tujuan_uuid"
                      value={formData.tujuan_uuid}
                      onChange={handleInputChange}
                    >
                      <option value="">Pilih Tujuan</option>
                      {tujuans?.map((tujuan) => (
                        <option value={tujuan.uuid}>{tujuan.tujuan}</option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer" style={{ border: "none" }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "100%", borderRadius: 30 }}
                    >
                      Ajukan Peminjaman
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Modal Berhasil Tambah Fisik*/}
        <div className="col">
          <div
            className="modal fade"
            id="berhasilTambahFisik"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header" style={{ borderBottom: "none" }}>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div
                  className="modal-body"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <h5 className="modal-title" style={{ marginBottom: 15 }}>
                    Penambahan Data Arsip Fisik
                  </h5>
                  <img src="assets/images/pharmacy.png" />
                  <h6
                    className="modal-isi"
                    style={{ marginBottom: 0, marginTop: 15 }}
                  >
                    Data arsip fisik berhasil ditambahkan.
                  </h6>
                </div>
                <div className="modal-footer" style={{ borderTop: "none" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "100%", borderRadius: 50 }}
                  >
                    Oke
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showSuccessModal && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 9999,
            }}
            tabIndex={-1}
            onClick={(e) => {
              // Tutup modal jika klik di luar modal content
              if (e.target.classList.contains("modal")) {
                handleSuccessOke();
              }
            }}
          >
            <div className="modal-dialog modal-cols-lg-2">
              <div className="modal-content">
                <div className="modal-header" style={{ borderBottom: "none" }}>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleSuccessOke}
                    aria-label="Close"
                  />
                </div>
                <div
                  className="modal-body"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <h5 className="modal-title" style={{ marginBottom: 15 }}>
                    Peminjaman Arsip Fisik Berhasil
                  </h5>
                  <img src="assets/images/checkmark.png" alt="Success" />
                  <h6
                    className="modal-isi"
                    style={{
                      marginBottom: 0,
                      marginTop: 15,
                      textAlign: "center",
                    }}
                  >
                    Pengajuan peminjaman arsip fisik telah berhasil. Harap
                    menunggu persetujuan.
                  </h6>
                </div>
                <div className="modal-footer" style={{ borderTop: "none" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSuccessOke}
                    style={{ width: "100%", borderRadius: 50 }}
                  >
                    Oke
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
