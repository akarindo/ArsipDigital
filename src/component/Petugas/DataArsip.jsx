import { Link, useNavigate, useLocation } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import TabComponent from "../base/TabComponent";

export default function DataArsip({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [type, setType] = React.useState(null);

  const {
    token,
    gedungs,
    user,
    tujuans,
    arsips,
    isEdit,
    currentUuid,
    formDataArsip,
    refreshData,
    setIsEdit,
    setFormDataArsip,
    floorBuild,
    folderBuild,
    roomBuild,
    cabinetBuild,
    shelfBuild,
    setFloorBuild,
    setFolderBuild,
    setRoomBuild,
    setCabinetBuild,
    setShelfBuild,
    handleChangeBuild,
    handleChangeFloor,
    handleChangeRoom,
    handleChangeCabinet,
    handleChangeShelf,
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
  const arsipFisik = arsips?.filter((arsip) => arsip.file == null);
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
  const handleRadioChangeArsip = (e) => {
    const { name, value } = e.target;

    setFormDataArsip((prev) => ({
      ...prev,
      [name]: value, // Langsung timpa nilainya dengan string baru
    }));
  };
  const getModal = () => {
    const modalEl = document.getElementById("modaltambahFisik");
    return window.bootstrap.Modal.getOrCreateInstance(modalEl);
  };
  const handleOpenModal = () => {
    setIsEdit(false);

    setFormDataArsip({
      file: null,
      name_uuid: "",
      tipe_arsip: "",
      judul_arsip: "",
      jenis_arsip: "",
      kategori_arsip: "",
      gedung_uuid: "",
      lantai_uuid: "",
      ruang_uuid: "",
      lemari_uuid: "",
      rak_uuid: "",
      folder_uuid: "",
      kode_arsip: "",
      keterangan: "",
    });

    setTimeout(() => {
      getModal().show();
    }, 300); // delay 300ms
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
      setIsEdit(false);
      setCurrentUuid(null);
      refreshData();
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
    setShowSuccessModal(true);
  };
  const resetPlace = () => {
    setFloorBuild([]);
    setFolderBuild([]);
    setRoomBuild([]);
    setCabinetBuild([]);
    setShelfBuild([]);
  };
  const handleSubmitArsip = async (e) => {
    e.preventDefault();
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
      setCurrentUuid(null);
    } catch (error) {
      console.error("Login Gagal:", error.message);
    }
    setFormDataArsip({
      file: null,
      name_uuid: "",
      tipe_arsip: "",
      judul_arsip: "",
      jenis_arsip: "",
      kategori_arsip: "",
      gedung_uuid: "",
      lantai_uuid: "",
      ruang_uuid: "",
      lemari_uuid: "",
      rak_uuid: "",
      folder_uuid: "",
      kode_arsip: "",
      keterangan: "",
    });
    const modalElement = document.getElementById("modaltambahFisik");
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
    const successModal = new window.bootstrap.Modal(
      document.getElementById("berhasilTambahFisik"),
    );
    successModal.show();
    // setIsEdit(false);
  };

  const handleSuccessOke = () => {
    setShowSuccessModal(false);
    navigate("/dataArsipPetugas/ArsipDigitalPetugas");
  };

  useEffect(() => {
    return () => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);
  const modalRef = useRef(null);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      const handleModalClose = () => {
        resetPlace();
      };
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
      return () => {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
      };
    }
  }, []);
  return (
    <AdminLayout>
      <div className="page-wrapper">
        <div className="page-content">
          <TabComponent
            role={role}
            navigate={navigate}
            tab={tab}
            handleOpenModal={handleOpenModal}
          />
          {children}

          {/* Modal Tambah Fisik */}
          <div
            ref={modalRef}
            className="modal fade"
            id="modaltambahFisik"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header" style={{ border: "none" }}>
                  <h5 className="modal-title">
                    {isEdit
                      ? "Formulir Edit Data Arsip Fisik"
                      : "Formulir Penambahan Data Arsip Fisik"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => resetPlace()}
                  />
                </div>
                <div className="modal-body">
                  <img
                    src="/assets/images/documents.png"
                    style={{ margin: "auto", display: "flex" }}
                    alt="documents"
                  />
                  <form onSubmit={handleSubmitArsip}>
                    {/* Nama Arsip */}
                    <div className="mb-3">
                      <label className="form-label">Nama Arsip</label>
                      <select
                        name="name_uuid"
                        onChange={(e) => handleInputChangeArsip(e)}
                        value={formDataArsip.name_uuid}
                        className="form-select mb-3 radius-30"
                        required // Tambah Required
                      >
                        {/* {isEdit ? (
                          <option value="">{formDataArsip.name_uuid}</option>
                        ) : ( */}
                        <option value="">Pilih Arsip</option>
                        {/* )} */}
                        {names?.map((name) => (
                          <option key={name.uuid} value={name.uuid}>
                            {name.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Judul Arsip */}
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="basic-addon1">
                        Judul Arsip
                      </span>
                      <input
                        type="text"
                        value={formDataArsip.judul_arsip ?? ""}
                        onChange={(e) => handleInputChangeArsip(e)}
                        className="form-control"
                        name="judul_arsip"
                        placeholder="Judul Arsip"
                        required // Tambah Required
                        aria-label="Judul Arsip"
                        aria-describedby="basic-addon1"
                      />
                    </div>

                    {/* Tipe Arsip */}
                    <div className="mb-3">
                      <label className="form-label">Tipe Arsip</label>
                      <select
                        name="tipe_arsip"
                        value={formDataArsip.tipe_arsip ?? ""}
                        className="form-select mb-3 radius-30"
                        onChange={(e) => {
                          handleType(e.target.value);
                          handleInputChangeArsip(e);
                        }}
                        required // Tambah Required
                      >
                        <option value="">Pilih Tipe Arsip</option>
                        {jenisArsip?.map((arsip) => (
                          <option key={arsip.type} value={arsip.type}>
                            {arsip.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Jenis Arsip (Radio) */}
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
                              value="vital"
                              checked={formDataArsip.jenis_arsip === "vital"}
                              onChange={handleRadioChangeArsip}
                              className="form-check-input"
                              type="radio"
                              id="vital"
                              required // Tambah Required (cukup satu di grup radio yang sama)
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
                              value="active"
                              checked={formDataArsip.jenis_arsip === "active"}
                              onChange={handleRadioChangeArsip}
                              className="form-check-input"
                              type="radio"
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
                              value="inactive"
                              checked={formDataArsip.jenis_arsip === "inactive"}
                              onChange={handleRadioChangeArsip}
                              className="form-check-input"
                              type="radio"
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

                    {/* Kategori Arsip (Radio) */}
                    <label className="form-label">Kategori Arsip</label>
                    <div
                      className="line-check mb-3"
                      style={{ display: "flex" }}
                    >
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="kategori_arsip"
                          value="surat"
                          onChange={handleRadioChangeArsip}
                          checked={formDataArsip.kategori_arsip === "surat"}
                          className="form-check-input"
                          type="radio"
                          id="katSurat"
                          required // Tambah Required
                        />
                        <label className="form-check-label" htmlFor="katSurat">
                          Surat
                        </label>
                      </div>
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="kategori_arsip"
                          value="laporan"
                          onChange={handleRadioChangeArsip}
                          checked={formDataArsip.kategori_arsip === "laporan"}
                          className="form-check-input"
                          type="radio"
                          id="katLaporan"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="katLaporan"
                        >
                          Laporan
                        </label>
                      </div>
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="kategori_arsip"
                          value="file"
                          onChange={handleRadioChangeArsip}
                          checked={formDataArsip.kategori_arsip === "file"}
                          className="form-check-input"
                          type="radio"
                          id="katFile"
                        />
                        <label className="form-check-label" htmlFor="katFile">
                          File
                        </label>
                      </div>
                    </div>

                    {/* Lokasi Fisik */}
                    <div
                      className="line"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="mb-0">
                        <label className="form-label">Gedung</label>
                        <select
                          name="gedung_uuid"
                          value={formDataArsip.gedung_uuid}
                          onChange={(e) => {
                            handleChangeBuild(e.target.value);
                            handleInputChangeArsip(e);
                          }}
                          className="form-select mb-3 radius-30"
                          required // Tambah Required
                        >
                          <option value="">Pilih Gedung</option>
                          {gedungs?.map((gedung) => (
                            <option key={gedung.uuid} value={gedung.uuid}>
                              {gedung.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Lantai</label>
                        <select
                          name="lantai_uuid"
                          value={formDataArsip.lantai_uuid}
                          onChange={(e) => {
                            handleChangeFloor(e.target.value);
                            handleInputChangeArsip(e);
                          }}
                          className="form-select mb-3 radius-30"
                          required // Tambah Required
                        >
                          <option value="">Pilih Lantai</option>
                          {floorBuild?.map((floor) => (
                            <option key={floor.uuid} value={floor.uuid}>
                              {floor.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Ruang</label>
                        <select
                          value={formDataArsip.ruang_uuid}
                          name="ruang_uuid"
                          onChange={(e) => {
                            handleChangeRoom(e.target.value);
                            handleInputChangeArsip(e);
                          }}
                          className="form-select mb-3 radius-30"
                          required // Tambah Required
                        >
                          <option value="">Pilih Ruang</option>
                          {roomBuild?.map((room) => (
                            <option key={room.uuid} value={room.uuid}>
                              {room.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div
                      className="line"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="mb-0">
                        <label className="form-label">Lemari</label>
                        <select
                          value={formDataArsip.lemari_uuid}
                          name="lemari_uuid"
                          onChange={(e) => {
                            handleChangeCabinet(e.target.value);
                            handleInputChangeArsip(e);
                          }}
                          className="form-select mb-3 radius-30"
                          required // Tambah Required
                        >
                          <option value="">Pilih Lemari</option>
                          {cabinetBuild?.map((cabinet) => (
                            <option key={cabinet.uuid} value={cabinet.uuid}>
                              {cabinet.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Rak</label>
                        <select
                          name="rak_uuid"
                          value={formDataArsip.rak_uuid}
                          onChange={(e) => {
                            handleChangeShelf(e.target.value);
                            handleInputChangeArsip(e);
                          }}
                          className="form-select mb-3 radius-30"
                          required // Tambah Required
                        >
                          <option value="">Pilih Rak</option>
                          {shelfBuild?.map((shelf) => (
                            <option key={shelf.uuid} value={shelf.uuid}>
                              {shelf.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Folder</label>
                        <select
                          name="folder_uuid"
                          value={formDataArsip.folder_uuid}
                          onChange={(e) => handleInputChangeArsip(e)}
                          className="form-select mb-3 radius-30"
                          required // Tambah Required
                        >
                          <option value="">Pilih Folder</option>
                          {folderBuild?.map((folder) => (
                            <option key={folder.uuid} value={folder.uuid}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Keterangan */}
                    <div className="mb-3">
                      <label className="form-label">Keterangan</label>
                      <textarea
                        name="keterangan"
                        onChange={(e) => handleInputChangeArsip(e)}
                        value={formDataArsip.keterangan ?? ""}
                        className="form-control radius-30"
                        required // Tambah Required
                        placeholder="Tambahkan keterangan..."
                      />
                    </div>

                    {/* Tombol Aksi */}
                    <div className="p-3 pt-0">
                      <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                        <div className="w-50">
                          <button
                            type="button"
                            className="btn btn-outline-primary radius-30"
                            data-bs-dismiss="modal"
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
                          >
                            {isEdit ? "Simpan Perubahan" : "Tambah"}
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
                      {arsipFisik?.map((arsip) => (
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
                  <h5
                    className="modal-title"
                    style={{ marginBottom: 15, fontSize: 17 }}
                  >
                    {isEdit
                      ? "Edit Data Arsip Fisik"
                      : "Penambahan Data Arsip Fisik"}
                  </h5>
                  <img src="/assets/images/pharmacy.png" />
                  <h6
                    className="modal-isi"
                    style={{ marginBottom: 0, marginTop: 15, fontSize: 13 }}
                  >
                    {isEdit
                      ? "Data arsip fisik berhasil diperbarui."
                      : "Data arsip fisik berhasil ditambahkan."}
                  </h6>
                </div>
                <div className="modal-footer" style={{ borderTop: "none" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => refreshData()}
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
                  <img src="/assets/images/checkmark.png" alt="Success" />
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
