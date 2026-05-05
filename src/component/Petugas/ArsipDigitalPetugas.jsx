import { Link, useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { PengajuanContext, usePengajuan } from "../../context/PengajuanContext";
import React from "react";

export default function ArsipDigitalPetugas({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = React.useState(null);
  const [isEdit, setIsEdit] = React.useState(false);
  const { names, codes, token, role, user, arsips, tujuans } =
    React.useContext(PengajuanContext);
  const arsipDigital = arsips.filter((arsip) => arsip.file != null);
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
  const [formDataArsip, setFormDataArsip] = React.useState({
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
  const [formData, setFormData] = React.useState({
    user_uuid: user?.uuid,
    arsip_uuid: "",
    tujuan_uuid: "",
    status: "pending",
  });
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
    const modalElement = document.getElementById("modalDigital");
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }

    // Hapus backdrop secara manual
    // setTimeout(() => {
    //   const backdrops = document.querySelectorAll(".modal-backdrop");
    //   backdrops.forEach((backdrop) => backdrop.remove());
    //   document.body.classList.remove("modal-open");
    //   document.body.style.overflow = "";
    //   document.body.style.paddingRight = "";
    // }, 100);

    // Tampilkan modal sukses
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
        body: JSON.stringify(formDataArsip), // file sudah otomatis terkirim sebagai string base64
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data");
      }

      // Reset dan tutup modal
      resetForm(); // Buat fungsi helper untuk reset
      const modalElement = document.getElementById("modaltambahDigital");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();

      
      // Bersihkan backdrop
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // Buka modal sukses
      const successModalEl = document.getElementById("berhasilTambahDigital");
      const successModal = new window.bootstrap.Modal(successModalEl);
      successModal.show();
    
    } catch (error) {
      console.error("Error:", error.message);
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  // Helper untuk reset form
  const resetForm = () => {
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
    document.getElementById("unggah_file").value = ""; // Reset input file fisik
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
                    Formulir Penambahan Data Arsip Digital
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <img src="/assets/images/documents.png"
                  style={{ margin: "auto", display: "flex" }} 
                   />
                  <form onSubmit={handleSubmitArsip}>
                    <div className="mb-3">
                      <label className="form-label">
                        Unduh File(Hanya PDF)
                      </label>
                      <input
                        onChange={handleInputChangeArsip}
                        type="file"
                        name="file"
                        id="unggah_file"
                        accept=".pdf"
                      />
                    </div>
                    {/* <div className="mb-3">
                        <label className="form-label">Size File(Mb)</label>
                        <input type="number" id="jumlah_item" name="jumlah_item" min={1} max={10} placeholder="Masukkan dalam bentuk MB" />
                      </div> */}
                    <div className="mb-3">
                      <label className="form-label">Nama Arsip</label>
                      <select
                        name="name_uuid"
                        onChange={(e) => handleInputChangeArsip(e)}
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
                        className="form-select mb-3 radius-30"
                        onChange={(e) => {
                          handleType(e.target.value);
                          handleInputChangeArsip(e);
                        }} // PINDAHKAN KE SINI
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
                      className="line-check mb-3"
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
                    <div className="mb-3">
                      <label className="form-label">Kode Arsip</label>
                      <select
                        name="kode_arsip"
                        className="form-select mb-3 radius-30"
                        onChange={(e) => {
                          handleInputChangeArsip(e);
                        }} // PINDAHKAN KE SINI
                      >
                        <option value="">Pilih Tipe Arsip</option>
                        {codes?.map((code) => (
                          <option key={code.uuid} value={code.uuid}>
                            {code.kode}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Keterangan</label>
                      <textarea
                        type="text"
                        name="keterangan"
                        className="form-control radius-30"
                      />
                    </div>
                    <div className="p-3 pt-0">
                      <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                        <div className="w-50">
                          <button
                            type="button"
                            data-bs-dismiss="modal"
                            aria-label="Close"
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
                            style={{ width: "100%" }}>
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
          <div className="col">
            {/* Modal Berhasil Tambah Digital*/}
            <div className="col">
              <div
                className="modal fade"
                id="berhasilTambahDigital"
                tabIndex={-1}
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
                      <h5 className="modal-title" style={{ marginBottom: 15, fontSize: 17 }}>
                        Penambahan Data Arsip Digital
                      </h5>
                      <img src="/assets/images/pharmacy.png" />
                      <h6
                        className="modal-isi"
                        style={{ marginBottom: 0, marginTop: 15, fontSize: 13 }}
                      >
                        Data arsip digital berhasil ditambahkan.
                      </h6>
                    </div>
                    <div className="modal-footer" style={{ borderTop: "none" }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        style={{ width: "100%", borderRadius: 50 }}
                      >
                        Oke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
