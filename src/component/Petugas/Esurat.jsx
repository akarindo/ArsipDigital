import React, { useEffect, useRef, useState } from "react";
import { usePengajuan } from "../../context/PengajuanContext";
import AdminLayout from "../layouts/AdminLayout";
import Alert from "../Alert";
import Select from "react-select";

const Esurat = () => {
  const [tab, setTab] = useState("masuk");
  const [dataSurat, setDataSurat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const { token, user, users } = usePengajuan();
  const [tabArsip, setTabArsip] = useState("eksternal");
  const [corporates, setCorporates] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const fileInputMasukRef = useRef(null);
  const fileInputKeluarRef = useRef(null);

  // State Form Surat Masuk
  const [formMasuk, setFormMasuk] = useState({
    asal_instansi: "",
    nomor_surat: "",
    sifat: "biasa",
    file_path: "",
    tanggal_surat: "",
    current_user: user?.uuid,
    no_registrasi: "",
    perihal: "",
    ditujukan_kepada: [],
    tanggal_terima: "",
    file_size: 0,
  });

  // State Form Surat Keluar (Termasuk Data Kurir)
  const [formKeluar, setFormKeluar] = useState({
    nomor_surat: "",
    tujuan_instansi: "",
    sifat: "biasa",
    perihal: "",
    file_path: "",
    alamat_tujuan: "",
    no_registrasi: "",
    tanggal_buat: "",
    no_resi: null,
    jenis_pengiriman: null,
    current_user: user?.uuid,
    provider: null,
    type: tabArsip,
    penerima: null,
    status_internal: null,
    tanggal_serah: null,
    file_size: 0,
  });
  const openModal = (id) => {
    const modalElement = document.getElementById(id);

    if (modalElement) {
      const modalInstance =
        window.bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  };
  const handleTambahBaru = () => {
    setSelectedData(null);
    const newRegNo = generateNoRegistrasi(tab);

    if (tab === "masuk") {
      resetFormMasuk();
      setFormMasuk((prev) => ({
        ...prev,
        no_registrasi: newRegNo,
        current_user: user?.uuid,
      }));
    } else {
      resetFormKeluar();
      setFormKeluar((prev) => ({
        ...prev,
        no_registrasi: newRegNo,
        current_user: user?.uuid,
      }));
    }

    openModal(tab === "masuk" ? "modalSuratMasuk" : "modalSuratKeluar");
  };
  const resetFormMasuk = () => {
    setFormMasuk({
      asal_instansi: "",
      nomor_surat: "",
      no_registrasi: "",
      tanggal_surat: "",
      sifat: "biasa",
      file_path: "",
      perihal: "",
      ditujukan_kepada: [],
      tanggal_terima: "",
      file_size: 0,
    });
  };

  const resetFormKeluar = () => {
    setFormKeluar({
      nomor_surat: "",
      tujuan_instansi: "",
      sifat: "biasa",
      perihal: "",
      file_path: "",
      alamat_tujuan: "",
      no_registrasi: "",
      tanggal_buat: "",
      no_resi: null,
      jenis_pengiriman: null,
      provider: null,
      type: tabArsip,
      penerima: null,
      status_internal: null,
      tanggal_serah: null,
      file_size: 0,
    });
  };
  const getDeleteModal = () => {
    const modalEl = document.getElementById("modalKonfirmasiHapusSurat");
    return window.bootstrap.Modal.getOrCreateInstance(modalEl);
  };
  const handleOpenDeleteModal = (id, type) => {
    setDeleteTarget({ id, type });
    getDeleteModal().show();
  };
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const endpoint =
        deleteTarget.type === "masuk" ? "/surat-masuk" : "/surat-keluar";
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api${endpoint}/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        getDeleteModal().hide();
        fetchData();
        showAlert("danger", data.message);
        setDeleteTarget(null);
      }
    } catch (err) {
      showAlert("danger", "Gagal!", "Gagal menghapus data");
    }
  };

  const generateNoRegistrasi = (type) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    const prefix = type === "masuk" ? "REG-IN" : "REG-OUT";

    // Format: REG-IN/202408/XXXX
    return `${prefix}/${year}${month}/${random}`;
  };

  // Fungsi Lihat PDF
  const previewPDF = (filePath) => {
    // 1. Cek apakah file_path adalah data Base64 lama
    if (filePath.startsWith("data:")) {
      // Jalankan cara lama menggunakan iframe untuk Base64
      const newTab = window.open();
      newTab.document.write(
        `<iframe src="${filePath}" width="100%" height="100%" style="border:none;"></iframe>`,
      );
    }
    // 2. Jika bukan Base64, berarti ini file fisik baru (URL Path)
    else {
      // Gabungkan dengan domain API dan buka langsung di tab baru
      const fileUrl = `${import.meta.env.VITE_API_URL}${filePath}`;
      window.open(fileUrl, "_blank");
    }
  };
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      if (type === "masuk") {
        setFormMasuk({
          ...formMasuk,
          file_pdf: file, // Simpan objek file asli di sini, bukan base64 string
          file_size: file.size, // file.size bawaan JavaScript sudah dalam bentuk Bytes
        });
      } else {
        setFormKeluar({
          ...formKeluar,
          file_pdf: file,
          file_size: file.size,
        });
      }
    } else {
      alert("Mohon pilih file format PDF!");
      e.target.value = null;
    }
  };

  // 2. Fungsi Submit Data (POST)
  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const isEdit = !!selectedData;
    const payload = type === "masuk" ? formMasuk : formKeluar;
    const endpoint = type === "masuk" ? "/surat-masuk" : "/surat-keluar";

    // Jika edit, arahkan ke endpoint POST tapi nanti kita timpa dengan _method PUT
    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}/api${endpoint}/${selectedData.id}`
      : `${import.meta.env.VITE_API_URL}/api${endpoint}`;

    // 1. Inisialisasi FormData
    const formData = new FormData();

    // 2. Masukkan semua text field ke FormData
    Object.keys(payload).forEach((key) => {
      // Pastikan kita tidak memasukkan file lama dalam bentuk string/null yang salah
      if (
        key !== "file_pdf" &&
        payload[key] !== null &&
        payload[key] !== undefined
      ) {
        formData.append(key, payload[key]);
      }
    });

    // 3. Masukkan file PDF asli (jika ada inputan file baru)
    if (payload.file_pdf instanceof File) {
      formData.append("file_pdf", payload.file_pdf);
    }

    // 4. Solusi khusus Laravel spoofing untuk method PUT
    if (isEdit) {
      formData.append("_method", "PUT");
    }

    try {
      const response = await fetch(url, {
        method: "POST", // Selalu POST jika mengirim file fisik via FormData
        headers: {
          // JANGAN gunakan "Content-Type": "application/json"
          // Biarkan browser menentukan Content-Type multipart/form-data secara otomatis
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData, // Kirim objek FormData
      });

      if (response.ok) {
        showAlert(
          isEdit ? "info" : "success",
          isEdit ? "Diperbarui!" : "Berhasil Disimpan!",
          `Data berhasil ${isEdit ? "diperbarui" : "disimpan"}!`,
        );

        const modalId =
          type === "masuk" ? "modalSuratMasuk" : "modalSuratKeluar";
        window.bootstrap?.Modal?.getInstance(
          document.getElementById(modalId),
        )?.hide();

        setSelectedData(null);
        if (type === "masuk") {
          resetFormMasuk();
          if (fileInputMasukRef.current) {
            fileInputMasukRef.current.value = "";
          }
        } else {
          resetFormKeluar();
          if (fileInputKeluarRef.current) {
            fileInputKeluarRef.current.value = "";
          }
        }
        fetchData();
      } else {
        const errorData = await response.json();
        showAlert(
          "danger",
          "Gagal!",
          errorData.message || "Terjadi kesalahan validasi.",
        );
      }
    } catch (err) {
      showAlert("danger", "Gagal!", "Terjadi kesalahan koneksi.");
    }
  };
  const showAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeAlert(id), 3000);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };
  const filterStaff = users?.filter((usr) => usr.role !== "pegawai");

  // 1. Fungsi Fetch Data (GET)
  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = tab === "masuk" ? "/surat-masuk" : "/surat-keluar";
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api${endpoint}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      if (response.ok) {
        console.log(tab);
        if (user?.role == "super_admin" || user?.role == "staff umum") {
          setDataSurat(result);
        } else {
          const filterSurat = result?.filter(
            (data) => data.current_user == user.uuid,
          );
          setDataSurat(filterSurat);
        }
        console.log("result", result);
      } else {
        throw new Error(result.message || "Gagal mengambil data");
      }
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };
  async function getCorporate() {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/corporates`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();
    setCorporates(result);
  }

  const [deleteTarget, setDeleteTarget] = useState(null);
  useEffect(() => {
    fetchData();
    getCorporate();
  }, [tab]);
  return (
    <AdminLayout>
      <Alert alerts={alerts} removeAlert={removeAlert} />
      <div className="page-wrapper">
        <div className="page-content">
          <div className="d-flex align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-0">Sistem Manajemen Surat</h4>
              <p className="text-muted mb-0 small">
                Dashboard / Surat {tab === "masuk" ? "Masuk" : "Keluar"}
              </p>
            </div>

            <button
              className="btn btn-primary ms-auto px-4 shadow-sm"
              onClick={() => {
                setSelectedData(null);
                if (tab === "masuk") resetFormMasuk();
                else resetFormKeluar();
                handleTambahBaru();
              }}
            >
              <i className="bx bx-plus me-1"></i> Tambah Data
            </button>
          </div>
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              {/* Tab Navigation Modern */}
              <div className="nav nav-pills mb-4 bg-light p-1 rounded-3">
                <button
                  onClick={() => setTab("masuk")}
                  className={`nav-link w-50 rounded-3 py-2 ${tab === "masuk" ? "active shadow-sm" : "text-muted"}`}
                >
                  <i className="bx bx-download me-2"></i>Surat Masuk
                </button>
                <button
                  onClick={() => setTab("keluar")}
                  className={`nav-link w-50 rounded-3 py-2 ${tab === "keluar" ? "active shadow-sm" : "text-muted"}`}
                >
                  <i className="bx bx-upload me-2"></i>Surat Keluar
                </button>
              </div>

              {/* Table Section */}

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light text-secondary small uppercase">
                    <tr>
                      <th style={{ width: "5%" }}>No</th>
                      <th>No Registrasi / Surat</th>
                      <th>
                        {tab === "masuk" ? "Asal Instansi" : "Tujuan & Alamat"}
                      </th>
                      <th>Perihal</th>
                      {/* <th>File & Ukuran</th>
                              <th>{tab === "masuk" ? "Tgl Diterima" : "Tgl Dibuat"}</th> */}
                      <th>Sifat</th>
                      <th>Dibuat Oleh</th> {/* Kolom Baru */}
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center py-5 text-muted small"
                        >
                          Sedang memproses data...
                        </td>
                      </tr>
                    ) : dataSurat.length > 0 ? (
                      dataSurat.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>

                          {/* NO REGIS & NO SURAT DIGABUNG AGAR MINIMIZE */}
                          <td>
                            <div className="small text-muted">
                              {item.no_registrasi}
                            </div>
                            <div className="fw-bold">{item.nomor_surat}</div>
                          </td>

                          <td style={{ maxWidth: "200px" }}>
                            <div className="text-truncate fw-semibold">
                              {item.corporate?.name || "-"}
                            </div>
                            {tab === "keluar" && item.alamat_tujuan && (
                              <div className="small text-muted text-truncate">
                                {item.alamat_tujuan}
                              </div>
                            )}
                          </td>

                          <td>
                            <span className="text-wrap">{item.perihal}</span>
                          </td>

                          {/* KOLOM FILE & UKURAN DIGABUNG AGAR LEBIH RINGKAS */}
                          {/* <td>
                                    <div className="d-flex align-items-center gap-2">
                                      {item.file_path ? (
                                        <>
                                          <button
                                            className="btn btn-sm btn-outline-danger shadow-none p-1"
                                            onClick={() => previewPDF(item.file_path)}
                                            title="Lihat PDF"
                                          >
                                            <i className="bx bx-file-find fs-5"></i>
                                          </button>
                                          <span className="small text-muted">
                                            {item.file_size
                                              ? `${Math.round(item.file_size / 1024).toLocaleString()} KB`
                                              : "0 KB"}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-muted small">-</span>
                                      )}
                                    </div>
                                  </td>
        
                                  <td>
                                    <span className="small">
                                      {tab === "masuk"
                                        ? item.tanggal_terima
                                        : item.tanggal_buat}
                                    </span>
                                  </td> */}

                          <td>
                            <span
                              className={`badge rounded-pill ${item.sifat === "penting" ? "bg-danger" : "bg-info"} opacity-75`}
                            >
                              {item.sifat}
                            </span>
                          </td>

                          {/* MENAMPILKAN PEMBUAT SURAT (CURRENT USER) */}
                          <td>
                            <div className="d-flex flex-column">
                              {/* Menampilkan nama user dari relasi 'creator' */}
                              <span className="fw-semibold small text-dark">
                                {item.creator?.name || "Tidak Diketahui"}
                              </span>
                              {/* Menampilkan role pembuat sebagai sub-info tambahan */}
                              <span
                                className="text-muted"
                                style={{ fontSize: "10px" }}
                              >
                                {item.creator?.role || "Staff"}
                              </span>
                            </div>
                          </td>

                          <td className="text-center">
                            <div className="btn-group">
                              {/* Tombol Edit */}
                              <button
                                className="btn btn-sm btn-outline-primary shadow-none"
                                onClick={() => {
                                  setSelectedData(item);
                                  if (tab === "masuk") setFormMasuk(item);
                                  else setFormKeluar(item);
                                  openModal(
                                    tab === "masuk"
                                      ? "modalSuratMasuk"
                                      : "modalSuratKeluar",
                                  );
                                }}
                              >
                                <i className="bx bx-edit"></i>
                              </button>

                              {/* Tombol Hapus */}
                              <button
                                className="btn btn-sm btn-outline-secondary shadow-none"
                                onClick={() =>
                                  handleOpenDeleteModal(item.id, tab)
                                }
                              >
                                <i className="bx bx-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-5 text-muted">
                          Belum ada data surat.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SURAT MASUK */}
      <div
        className="modal fade"
        id="modalSuratMasuk"
        tabIndex="-1"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <div className="d-flex flex-column ms-2 mt-2">
                <h5 className="fw-bold mb-0">Registrasi Surat Masuk</h5>
                <p className="text-muted small">
                  Input data surat yang diterima dari instansi luar
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={(e) => handleSubmit(e, "masuk")}>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      No. Registrasi Sistem
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 fw-bold text-primary"
                      value={formMasuk.no_registrasi || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Asal Instansi
                    </label>
                    <select
                      className="form-select bg-light border-0"
                      required
                      value={formMasuk.asal_instansi}
                      onChange={(e) =>
                        setFormMasuk({
                          ...formMasuk,
                          asal_instansi: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Pilih Instansi --</option>
                      {corporates.map((corp) => (
                        <option key={corp.uuid} value={corp.uuid}>
                          {corp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Nomor Surat
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <i className="bx bx-hash"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-light border-0"
                        placeholder="Masukkan nomor surat resmi"
                        required
                        value={formMasuk.nomor_surat}
                        onChange={(e) =>
                          setFormMasuk({
                            ...formMasuk,
                            nomor_surat: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">
                      Sifat Surat
                    </label>
                    <select
                      className="form-select bg-light border-0 shadow-none"
                      value={formMasuk.sifat}
                      onChange={(e) =>
                        setFormMasuk({ ...formMasuk, sifat: e.target.value })
                      }
                    >
                      <option value="biasa">Biasa</option>
                      <option value="penting">Penting</option>
                      <option value="rahasia">Rahasia</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">
                      Tanggal Surat
                    </label>
                    <input
                      type="date"
                      className="form-control bg-light border-0"
                      required
                      value={formMasuk.tanggal_surat}
                      onChange={(e) =>
                        setFormMasuk({
                          ...formMasuk,
                          tanggal_surat: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Perihal
                    </label>
                    <textarea
                      className="form-control bg-light border-0"
                      rows="2"
                      placeholder="Ringkasan isi surat..."
                      required
                      value={formMasuk.perihal}
                      onChange={(e) =>
                        setFormMasuk({ ...formMasuk, perihal: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold text-secondary">
                      Tanggal Diterima
                    </label>
                    <input
                      type="date"
                      className="form-control bg-light border-0"
                      required
                      value={formMasuk.tanggal_terima}
                      onChange={(e) =>
                        setFormMasuk({
                          ...formMasuk,
                          tanggal_terima: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Ditujukan Kepada
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <i className="bx bx-user"></i>
                      </span>
                      <div style={{ flex: "1" }}>
                        {" "}
                        {/* Wrapper ini penting agar react-select melebar sempurna di dalam input-group Bootstrap */}
                        <Select
                          isMulti
                          name="ditujukan_kepada"
                          placeholder="-- Pilih Tujuan (Bisa cari & pilih banyak) --"
                          className="basic-multi-select text-dark"
                          classNamePrefix="select"
                          closeMenuOnSelect={false}
                          // 1. Format data staf yang sudah difilter ke format opsi react-select
                          options={
                            filterStaff?.map((user) => ({
                              value: user.uuid,
                              label: `${user.name} - ${user.branch ? user.branch?.name : "-"} (${user.role.replace("_", " ")})`,
                            })) || []
                          }
                          // 2. Menampilkan nilai yang sedang terpilih di state formMasuk
                          value={
                            filterStaff
                              ?.filter((user) =>
                                formMasuk?.ditujukan_kepada?.includes(
                                  user.uuid,
                                ),
                              )
                              .map((user) => ({
                                value: user.uuid,
                                label: `${user.name} (${user.role.replace("_", " ")})`,
                              })) || []
                          }
                          // 3. Update state formMasuk saat ada perubahan pilihan
                          onChange={(selectedOptions) => {
                            const selectedValues = selectedOptions
                              ? selectedOptions.map((option) => option.value)
                              : [];

                            setFormMasuk({
                              ...formMasuk,
                              ditujukan_kepada: selectedValues,
                            });
                          }}
                          // 4. Styling Bootstrap 5 terintegrasi dengan mulus
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              backgroundColor: "#f8f9fa", // Menyamakan dengan kelas bg-light Bootstrap
                              border: "none",
                              boxShadow: state.isFocused
                                ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
                                : "none",
                              borderRadius: "0 0.375rem 0.375rem 0", // Sudut melengkung sebelah kanan saja karena berdampingan dengan icon input-group
                              padding: "2px",
                              minHeight: "38px",
                            }),
                            multiValue: (baseStyles) => ({
                              ...baseStyles,
                              backgroundColor: "rgba(13, 110, 253, 0.1)",
                              color: "#0d6efd",
                              borderRadius: "50px",
                              paddingLeft: "6px",
                            }),
                            multiValueLabel: (baseStyles) => ({
                              ...baseStyles,
                              color: "#0d6efd",
                              fontWeight: "500",
                              fontSize: "13px",
                            }),
                            multiValueRemove: (baseStyles) => ({
                              ...baseStyles,
                              color: "#0d6efd",
                              borderRadius: "50px",
                              "&:hover": {
                                backgroundColor: "#0d6efd",
                                color: "white",
                              },
                            }),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Upload File (PDF)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <i className="bx bx-file"></i>
                      </span>
                      <input
                        type="file"
                        ref={fileInputMasukRef}
                        className="form-control bg-light border-0"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, "masuk")}
                      />
                    </div>
                    {formMasuk.file_pdf && (
                      <small className="text-success">
                        File berhasil diproses!
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 p-4 pt-0">
                <button
                  type="button"
                  className="btn btn-light px-4 rounded-3"
                  data-bs-dismiss="modal"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 rounded-3 shadow-sm"
                >
                  <i className="bx bx-save me-1"></i> Simpan Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* MODAL SURAT KELUAR + DATA KURIR */}
      <div
        className="modal fade"
        id="modalSuratKeluar"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="fw-bold mt-2 ms-2">Entry Surat Keluar</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <form onSubmit={(e) => handleSubmit(e, "keluar")}>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">
                      No. Registrasi Sistem
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 fw-bold text-primary"
                      value={formKeluar.no_registrasi || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Nomor Surat
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="No. Surat Resmi"
                      value={formKeluar.nomor_surat}
                      required
                      onChange={(e) =>
                        setFormKeluar({
                          ...formKeluar,
                          nomor_surat: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">
                      Tujuan Instansi
                    </label>
                    <select
                      className="form-select bg-light border-0"
                      required
                      value={formKeluar.tujuan_instansi}
                      onChange={(e) =>
                        setFormKeluar({
                          ...formKeluar,
                          tujuan_instansi: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Pilih Instansi --</option>
                      {corporates.map((corp) => (
                        <option key={corp.uuid} value={corp.uuid}>
                          {corp.name}
                        </option>
                      ))}
                    </select>
                  </div> */}
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">
                      Alamat Tujuan
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Alamat pengiriman lengkap..."
                      required
                      value={formKeluar.alamat_tujuan}
                      onChange={(e) =>
                        setFormKeluar({
                          ...formKeluar,
                          alamat_tujuan: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Sifat</label>
                    <select
                      className="form-select"
                      value={formKeluar.sifat}
                      onChange={(e) =>
                        setFormKeluar({ ...formKeluar, sifat: e.target.value })
                      }
                    >
                      <option value="biasa">Biasa</option>
                      <option value="penting">Penting</option>
                      <option value="rahasia">Rahasia</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Perihal</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formKeluar.perihal}
                      required
                      onChange={(e) =>
                        setFormKeluar({
                          ...formKeluar,
                          perihal: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">
                      Tanggal Dibuat
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={formKeluar.tanggal_buat}
                      required
                      onChange={(e) =>
                        setFormKeluar({
                          ...formKeluar,
                          tanggal_buat: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Upload File (PDF)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <i className="bx bx-file"></i>
                      </span>
                      <input
                        type="file"
                        ref={fileInputKeluarRef}
                        className="form-control bg-light border-0"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, "keluar")}
                      />
                    </div>
                    {formKeluar.file_pdf && (
                      <small className="text-success">
                        File berhasil diproses!
                      </small>
                    )}
                  </div>

                  {/* KONTEN TAB EKSTERNAL (KODE LAMA ANDA) */}
                  {tabArsip === "eksternal" && (
                    <div className="col-12 py-2 bg-light rounded-3 px-3 border animate__animated animate__fadeIn">
                      <h6 className="mb-3 mt-1 fw-bold text-primary small uppercase">
                        <i className="bx bx-truck me-2"></i>Detail Ekspedisi /
                        Kurir
                      </h6>
                      <div className="row g-2 pb-2">
                        <div className="col-md-4">
                          <label className="form-label x-small fw-bold">
                            Provider
                          </label>
                          <select
                            className="form-select form-select-sm"
                            value={formKeluar.provider}
                            onChange={(e) =>
                              setFormKeluar({
                                ...formKeluar,
                                provider: e.target.value,
                              })
                            }
                            required={tabArsip === "eksternal"}
                          >
                            <option value="J&T">J&T Express</option>
                            <option value="JNE">JNE</option>
                            <option value="SICEPAT">Sicepat</option>
                            <option value="POS">POS Indonesia</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label x-small fw-bold">
                            Jenis Layanan
                          </label>
                          <input
                            type="text"
                            className="form-control form-select-sm"
                            placeholder="Reguler/Kilat"
                            value={formKeluar.jenis_pengiriman}
                            required={tabArsip === "eksternal"}
                            onChange={(e) =>
                              setFormKeluar({
                                ...formKeluar,
                                jenis_pengiriman: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label x-small fw-bold">
                            Nomor Resi
                          </label>
                          <input
                            type="text"
                            className="form-control form-select-sm"
                            placeholder="Contoh: JT1234..."
                            value={formKeluar.no_resi}
                            required={tabArsip === "eksternal"}
                            onChange={(e) =>
                              setFormKeluar({
                                ...formKeluar,
                                no_resi: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label x-small fw-bold">
                            Tanggal Serah Kurir
                          </label>
                          <input
                            type="date"
                            className="form-control form-select-sm"
                            value={formKeluar.tanggal_serah}
                            required={tabArsip === "eksternal"}
                            onChange={(e) =>
                              setFormKeluar({
                                ...formKeluar,
                                tanggal_serah: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-light px-4"
                  data-bs-dismiss="modal"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 shadow-sm"
                >
                  Simpan Surat Keluar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Hapus */}
      <div
        className="modal fade"
        id="modalKonfirmasiHapusSurat"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div
            className="modal-content border-0 shadow-lg"
            style={{ borderRadius: "20px" }}
          >
            <div className="modal-body p-4 text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: "64px", height: "64px", background: "#fff0f0" }}
              >
                <i
                  className="bx bx-trash text-danger"
                  style={{ fontSize: "28px" }}
                ></i>
              </div>
              <h5 className="fw-bold mb-1">Hapus Data?</h5>
              <p className="text-muted small mb-0">
                Data surat ini akan dihapus secara permanen dan tidak dapat
                dikembalikan.
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
    </AdminLayout>
  );
};

export default Esurat;
