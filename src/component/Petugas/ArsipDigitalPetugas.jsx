import { Link, useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { PengajuanContext, usePengajuan } from "../../context/PengajuanContext";
import React from "react";
function Alert({ alerts, removeAlert }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minWidth: "300px",
      }}
    >
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            background:
              alert.type === "success"
                ? "#dcfce7"
                : alert.type === "info"
                  ? "#dbeafe"
                  : "#fee2e2",
            borderLeft: `4px solid ${
              alert.type === "success"
                ? "#16a34a"
                : alert.type === "info"
                  ? "#2563eb"
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
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background:
                alert.type === "success"
                  ? "#16a34a"
                  : alert.type === "info"
                    ? "#2563eb"
                    : "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i
              className={`bx ${
                alert.type === "success"
                  ? "bx-check"
                  : alert.type === "info"
                    ? "bx-edit"
                    : "bx-trash"
              } text-white`}
              style={{ fontSize: "16px" }}
            ></i>
          </div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontWeight: "700",
                fontSize: "13px",
                color:
                  alert.type === "success"
                    ? "#15803d"
                    : alert.type === "info"
                      ? "#1d4ed8"
                      : "#b91c1c",
              }}
            >
              {alert.title}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#555",
                marginTop: "2px",
              }}
            >
              {alert.message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => removeAlert(alert.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "#999",
              fontSize: "16px",
            }}
          >
            <i className="bx bx-x"></i>
          </button>

          {/* Progress Bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "3px",
              background:
                alert.type === "success"
                  ? "#16a34a"
                  : alert.type === "info"
                    ? "#2563eb"
                    : "#dc2626",
              animation: "shrink 3s linear forwards",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function ArsipDigitalPetugas({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = React.useState(null);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [successModal, setSuccessModal] = React.useState(false);
  const {
    names,
    codes,
    token,
    currentUuid,
    role,
    formDataArsip,
    setFormDataArsip,
    refreshData,
    user,
    arsips,
    tujuans,
    isEdit,
    setIsEdit,
  } = React.useContext(PengajuanContext);
  const arsipDigital = arsips?.filter((arsip) => arsip.file != null);
  const tab = location.pathname.includes("ArsipDigitalPetugas")
    ? "ArsipDigitalPetugas"
    : "Arsip Fisik";
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  function handleType(value) {
    if (value === "dinamis") {
      setType("dinamis");
    } else {
      setType(null); // Sembunyikan jika bukan dinamis
    }
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
  const [formData, setFormData] = React.useState({
    user_uuid: user?.uuid,
    arsip_uuid: "",
    tujuan_uuid: "",
    status: "pending",
  });
  const handleSuccessOke = () => {
    setShowSuccessModal(false);
    navigate("/dataArsip");
  };
  const handleSuccess = () => {
    setSuccessModal(false);

    navigate("/dataArsip");
  };
  const getModal = () => {
    const modalEl = document.getElementById("modaltambahDigital");
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
  const handleInputChangeArsip = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        // Hasil base64 ada di reader.result
        setFormDataArsip((prev) => ({
          ...prev,
          file: reader.result, // Ini akan berisi string base64
        }));
      };

      reader.readAsDataURL(file);
    } else {
      setFormDataArsip((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      // navigate("/dataArsip");
      if (!response.ok) {
        throw new Error(result.message || "Login Gagal");
      }
      // setGedung({ building_uuid: "", name: "" });
      setIsEdit(false);
      // setCurrentUuid(null);
      // refreshData();
      setShowSuccessModal(true);
      // navigate("/dataArsipPetugas/ArsipDigitalPetugas");
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
    const modalElement = document.getElementById("modalDigital");
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
    setShowSuccessModal(true);
  };
  const handleSubmitArsip = async (e) => {
    e.preventDefault();

    try {
      // Pastikan file sudah terisi jika wajib
      if (!formDataArsip.file) {
        alert("Silahkan pilih file terlebih dahulu");
        return;
      }

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
        throw new Error(result.message || "Gagal menyimpan data");
      }
      setSuccessModal(true);
      setIsEdit(false);
    } catch (error) {
      console.error("Error:", error.message);
      alert("Terjadi kesalahan: " + error.message);
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
    document.getElementById("unggah_file").value = "";
    const modalElement = document.getElementById("modaltambahDigital");
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
    setSuccessModal(true);
    refreshData();
  };
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
                    className="nav-link"
                    data-bs-toggle="pill"
                    href="#primary-pills-home"
                    role="tab"
                    aria-selected="false"
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
                    className="nav-link active"
                    data-bs-toggle="pill"
                    href="#primary-pills-profile"
                    role="tab"
                    aria-selected="true"
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
                    onClick={handleOpenModal}
                    className="btn-tambah px-5"
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
                    data-bs-target="#modalDigital"
                  >
                    Pengajuan Peminjaman
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {children}
          <div
            className="modal fade"
            id="modalDigital"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header" style={{ border: "none" }}>
                  <h5 className="modal-title" style={{ paddingLeft: "15%" }}>
                    Formulir Peminjaman Arsip Digital
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
                        {arsipDigital?.map((arsip) => (
                          <option value={arsip.uuid}>
                            {arsip.judul_arsip}
                          </option>
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
          <div
            className="modal fade"
            id="modaltambahDigital"
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
                  />
                </div>
                <div className="modal-body">
                  <img
                    src="/assets/images/documents.png"
                    style={{ margin: "auto", display: "flex" }}
                    alt="documents"
                  />
                  <form onSubmit={handleSubmitArsip}>
                    {/* Unggah File */}
                    <div className="mb-3">
                      <label className="form-label">
                        Unggah File (Hanya PDF)
                      </label>
                      <input
                        onChange={handleInputChangeArsip}
                        type="file"
                        name="file"
                        id="unggah_file"
                        className="form-control"
                        accept=".pdf"
                        required={!isEdit}
                      />
                    </div>

                    {/* Nama Arsip */}
                    <div className="mb-3">
                      <label className="form-label">Nama Arsip</label>
                      <select
                        name="name_uuid"
                        value={formDataArsip.name_uuid ?? ""}
                        onChange={(e) => handleInputChangeArsip(e)}
                        className="form-select mb-3 radius-30"
                        required
                      >
                        <option value="" disabled>
                          Pilih Arsip
                        </option>
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
                        required
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
                        required
                      >
                        <option value="">Pilih Tipe Arsip</option>
                        {jenisArsip?.map((arsip) => (
                          <option key={arsip.type} value={arsip.type}>
                            {arsip.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Jenis Arsip (Khusus Dinamis) - SEKARANG RADIO */}
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
                              onChange={handleInputChangeArsip} // Menggunakan handle standar untuk radio tunggal
                              className="form-check-input"
                              type="radio"
                              id="vital_digital"
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor="vital_digital"
                            >
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
                              onChange={handleInputChangeArsip}
                              className="form-check-input"
                              type="radio"
                              id="active_digital"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="active_digital"
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
                              onChange={handleInputChangeArsip}
                              className="form-check-input"
                              type="radio"
                              id="inactive_digital"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="inactive_digital"
                            >
                              Inactive
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Kategori Arsip - SEKARANG RADIO */}
                    <label className="form-label mt-6">Kategori Arsip</label>
                    <div
                      className="line-check mb-3"
                      style={{ display: "flex" }}
                    >
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="kategori_arsip"
                          value="surat"
                          checked={formDataArsip.kategori_arsip === "surat"}
                          onChange={handleInputChangeArsip}
                          className="form-check-input"
                          type="radio"
                          id="katSurat_digital"
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="katSurat_digital"
                        >
                          Surat
                        </label>
                      </div>
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="kategori_arsip"
                          value="laporan"
                          checked={formDataArsip.kategori_arsip === "laporan"}
                          onChange={handleInputChangeArsip}
                          className="form-check-input"
                          type="radio"
                          id="katLaporan_digital"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="katLaporan_digital"
                        >
                          Laporan
                        </label>
                      </div>
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="kategori_arsip"
                          value="file"
                          checked={formDataArsip.kategori_arsip === "file"}
                          onChange={handleInputChangeArsip}
                          className="form-check-input"
                          type="radio"
                          id="katFile_digital"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="katFile_digital"
                        >
                          File
                        </label>
                      </div>
                    </div>

                    {/* Kode Arsip */}
                    <div className="mb-3">
                      <label className="form-label">Kode Arsip</label>
                      <select
                        name="kode_arsip"
                        value={formDataArsip.kode_arsip ?? ""}
                        className="form-select mb-3 radius-30"
                        onChange={handleInputChangeArsip}
                        required
                      >
                        <option value="">Pilih Kode Arsip</option>
                        {codes?.map((code) => (
                          <option key={code.uuid} value={code.uuid}>
                            {code.kode}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Keterangan */}
                    <div className="mb-3">
                      <label className="form-label">Keterangan</label>
                      <textarea
                        name="keterangan"
                        value={formDataArsip.keterangan ?? ""}
                        onChange={handleInputChangeArsip}
                        className="form-control radius-30"
                        placeholder="Tambahkan keterangan..."
                        required
                      />
                    </div>

                    {/* Tombol Aksi */}
                    <div className="p-3 pt-0">
                      <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                        <div className="w-50">
                          <button
                            type="button"
                            data-bs-dismiss="modal"
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
                  <div
                    className="modal-header"
                    style={{ borderBottom: "none" }}
                  >
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
                      Peminjaman Arsip Digital Berhasil
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
                      Pengajuan peminjaman arsip digital telah berhasil. Harap
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
          {successModal && (
            <div
              className="modal fade"
              tabIndex={-1}
              onClick={(e) => {
                // Tutup modal jika klik di luar modal content
                if (e.target.classList.contains("modal")) {
                  handleSuccess();
                }
              }}
              aria-hidden="true"
            >
              <div className="modal-dialog modal-sm">
                <div className="modal-content">
                  <div
                    className="modal-header"
                    style={{ borderBottom: "none" }}
                  >
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      onClick={handleSuccess}
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
                        ? "Edit Data Arsip Digital"
                        : "Penambahan Data Arsip Digital"}
                    </h5>
                    <img src="/assets/images/pharmacy.png" />
                    <h6
                      className="modal-isi"
                      style={{ marginBottom: 0, marginTop: 15, fontSize: 13 }}
                    >
                      {isEdit
                        ? "Data arsip digital berhasil diperbarui."
                        : "Data arsip digital berhasil ditambahkan."}
                    </h6>
                  </div>
                  <div className="modal-footer" style={{ borderTop: "none" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={handleSuccess}
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
      </div>
    </AdminLayout>
  );
}
