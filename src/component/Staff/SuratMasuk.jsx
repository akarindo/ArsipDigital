import React, { useEffect, useState } from "react";
import { usePengajuan } from "../../context/PengajuanContext";
import AdminLayout from "../layouts/AdminLayout";
import Select from "react-select"; // Import react-select untuk modal multi-select

const SuratMasukList = () => {
  const [suratList, setSuratList] = useState([]);
  const { user, token, users } = usePengajuan(); // Ambil data 'users' dari context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State tambahan untuk fitur disposisi
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [formDisposisi, setFormDisposisi] = useState({
    user_ids: [],
  });

  // Filter staff dengan role pegawai untuk target disposisi
  const filterStaff = users?.filter((u) => u.role === "pegawai");

  const fetchSuratMasuk = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/surat-masuk`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data dari server");
      }

      const result = await response.json();

      // Filter surat yang ditujukan ke user yang sedang login
      const suratUntukSaya = result.filter((surat) => {
        if (Array.isArray(surat.ditujukan_kepada)) {
          return surat.ditujukan_kepada.includes(user.uuid);
        }
        return false;
      });

      setSuratList(suratUntukSaya);
    } catch (err) {
      console.error("Error:", err);
      setError("Gagal memuat data surat masuk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.uuid) {
      fetchSuratMasuk();
    }
  }, [user, token]);

  // Helper waktu lokal string
  function getLocalDateTimeString() {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return localISOTime;
  }

  // Handler Buka Modal Disposisi
  const handleOpenDisposisi = (surat) => {
    setSelectedSurat(surat);
    setFormDisposisi({ user_ids: [] }); // Reset pilihan form sebelumnya
    const modal = new window.bootstrap.Modal(
      document.getElementById("modalDisposisiSuratMasuk"),
    );
    modal.show();
  };

  // Handler Kirim Disposisi (Post data baru & update status respons)
  async function handleToPegawai(e) {
    e.preventDefault();
    console.log("form", selectedSurat);
    const formPayload = {
      arsip_uuid: selectedSurat.uuid, // Sesuaikan field primary key arsip/surat masuk Anda
      user_ids: formDisposisi.user_ids,
      parent_uuid: user.uuid,
      tindak_lanjut: selectedSurat.tindak_lanjut || "Segera tindak lanjuti",
      skala_prioritas: selectedSurat.sifat || "biasa",
      intruksi: "Disposisi dari pimpinan",
      batas_waktu: getLocalDateTimeString(),
      catatan: "-",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/disposisi`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formPayload),
        },
      );

      if (response.ok) {
        // Jika sukses meneruskan, tutup modal dan refresh list
        const modalElement = document.getElementById(
          "modalDisposisiSuratMasuk",
        );
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        setFormDisposisi({ user_ids: [] });
        setSelectedSurat(null);
        fetchSuratMasuk();
      }
    } catch (error) {
      console.error("Gagal melakukan disposisi:", error);
    }
  }

  // Helper warna badge status/sifat surat
  const getSifatBadge = (sifat) => {
    switch (sifat) {
      case "rahasia":
        return "bg-danger";
      case "penting":
        return "bg-warning text-dark";
      default:
        return "bg-info text-white";
    }
  };

  return (
    <AdminLayout>
      <div className="page-wrapper px-4 py-4">
        {/* Breadcrumb */}
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Surat Masuk</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="bx bx-home-alt" />
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Kotak Masuk Saya
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Card Utama */}
        <div className="card radius-10 border-0 shadow-sm">
          <div className="card-body">
            <div className="mb-4">
              <h5 className="mb-0 text-dark fw-bold">
                Daftar Surat Ditujukan Kepada Anda
              </h5>
              <p className="mb-0 text-secondary small">
                Menampilkan arsip surat yang diteruskan ke akun Anda
              </p>
            </div>

            {/* State: Loading */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Memuat...</span>
                </div>
              </div>
            )}

            {/* State: Error */}
            {error && !loading && (
              <div className="alert alert-danger border-0 py-2" role="alert">
                <i className="bx bx-x-circle me-2" />
                {error}
              </div>
            )}

            {/* State: Kosong */}
            {!loading && !error && suratList.length === 0 && (
              <div className="text-center py-5 bg-light rounded">
                <i className="bx bx-envelope-open text-secondary display-4" />
                <h6 className="mt-3 text-secondary fw-semibold">
                  Tidak ada surat untuk Anda
                </h6>
              </div>
            )}

            {/* State: Ada Data */}
            {!loading && !error && suratList.length > 0 && (
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover">
                  <thead className="table-light text-secondary">
                    <tr>
                      <th>No. Registrasi</th>
                      <th>Asal Instansi / Perusahaan</th>
                      <th>Nomor & Perihal</th>
                      <th>Pengirim</th>
                      <th>Sifat</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suratList.map((surat) => (
                      <tr key={surat.id}>
                        <td>
                          <span className="fw-semibold text-primary">
                            {surat.no_registrasi}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="text-dark fw-bold">
                              {surat.corporate?.name || surat.asal_instansi}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="text-dark small fw-semibold">
                              {surat.nomor_surat}
                            </span>
                            <span
                              className="text-muted small text-truncate"
                              style={{ maxWidth: "300px" }}
                            >
                              {surat.perihal}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold small text-dark">
                              {surat.creator?.name || "Tidak Diketahui"}
                            </span>
                            <span
                              className="text-muted"
                              style={{ fontSize: "10px" }}
                            >
                              {surat.creator?.role || "Staff"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill text-uppercase px-3 py-1 ${getSifatBadge(surat.sifat)}`}
                          >
                            {surat.sifat}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {/* Tombol Buka PDF */}
                            {surat.file_path ? (
                              <a
                                href={`http://127.0.0.1:8000${surat.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary radius-30 px-3"
                              >
                                Buka PDF
                              </a>
                            ) : (
                              <span className="text-muted small align-self-center">
                                Tidak ada file
                              </span>
                            )}

                            {/* Tombol Disposisi (Kecuali untuk role pegawai) */}
                            {user?.role !== "pegawai" && (
                              <button
                                onClick={() => handleOpenDisposisi(surat)}
                                className="btn btn-sm btn-success radius-30 px-3 d-flex align-items-center gap-1"
                              >
                                <i className="bx bx-share fs-6"></i> Disposisi
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DISPOSISI DARI HALAMAN SURAT MASUK */}
      <div
        className="modal fade"
        id="modalDisposisiSuratMasuk"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered px-3">
          <div className="modal-content border-0 shadow rounded-4">
            <div className="modal-header border-0 pt-4 px-4 pb-2">
              <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bx bx-git-pull-request text-primary"></i>{" "}
                Delegasikan Disposisi Surat
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleToPegawai}>
              <div className="modal-body px-4">
                <div className="mb-3">
                  <label
                    className="form-label fw-bold text-secondary small text-uppercase"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Pilih Staf Penerima (Bisa Banyak)
                  </label>

                  <Select
                    isMulti
                    name="user_ids"
                    placeholder="-- Pilih Staf (Bisa cari & pilih banyak) --"
                    className="basic-multi-select text-dark small"
                    classNamePrefix="select"
                    closeMenuOnSelect={false}
                    options={
                      filterStaff?.map((u) => ({
                        value: u.uuid,
                        label: `${u.name} (${u.role.replace("_", " ")})`,
                      })) || []
                    }
                    value={
                      filterStaff
                        ?.filter((u) =>
                          formDisposisi?.user_ids?.includes(u.uuid),
                        )
                        .map((u) => ({
                          value: u.uuid,
                          label: `${u.name} (${u.role.replace("_", " ")})`,
                        })) || []
                    }
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions
                        ? selectedOptions.map((option) => option.value)
                        : [];

                      setFormDisposisi({
                        ...formDisposisi,
                        user_ids: selectedValues,
                      });
                    }}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: state.isFocused ? "#86b7fe" : "#dee2e6",
                        boxShadow: state.isFocused
                          ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
                          : "none",
                        borderRadius: "0.5rem",
                        padding: "4px",
                        fontSize: "14px",
                        "&:hover": { borderColor: "#86b7fe" },
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
                        fontSize: "12px",
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

                  <div className="form-text text-muted mt-2 small">
                    Surat beserta riwayat instruksi pimpinan akan didelegasikan
                    serentak ke seluruh staf yang Anda pilih.
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 px-4 pb-4 gap-2">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4 py-2 flex-grow-1 flex-sm-grow-0"
                  data-bs-dismiss="modal"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formDisposisi.user_ids.length === 0}
                  className="btn btn-primary rounded-pill px-4 py-2 flex-grow-1 flex-sm-grow-0 shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  Kirim Sekarang <i className="bx bx-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SuratMasukList;
