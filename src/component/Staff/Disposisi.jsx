import AdminLayout from "../layouts/AdminLayout";
import { usePengajuan } from "../../context/PengajuanContext";
import React, { useState, useEffect } from "react";
import Select from "react-select"; // Import react-select

export default function Disposisi() {
  const { token, user, users } = usePengajuan();
  const [loading, setLoading] = useState(true);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSurat, setSelectedSurat] = useState(null);

  // State baru untuk menampung data form multi-select pegawai
  const [formDisposisi, setFormDisposisi] = useState({
    user_ids: [],
  });

  const filterStaff = users?.filter((user) => user.role === "pegawai");

  async function getDisposisi() {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/disposisi`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json();

      if (response.ok) {
        const filtered = result.filter((d) => d?.user_id === user.uuid);
        setFilteredData(filtered);
      }
    } catch (error) {
      console.error("Gagal mengambil data disposisi:", error);
    } finally {
      setLoading(false);
    }
  }

  function getLocalDateTimeString() {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return localISOTime;
  }

  async function handleTerimaSurat(item) {
    let form = [];
    form = { ...item, read_at: getLocalDateTimeString() };

    try {
      setButtonLoad(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/disposisi/${item.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );
      if (response.ok) {
        setSelectedSurat(null);
        console.log("action");
        getDisposisi();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setButtonLoad(false);
    }
  }

  async function handleToPegawai(e) {
    e.preventDefault();

    // Payload disesuaikan mengirim array user_ids ke backend Anda
    const form = {
      arsip_uuid: selectedSurat.arsip_uuid,
      user_ids: formDisposisi.user_ids,
      parent_uuid: user.uuid, // Mengirim multi-select data
      tindak_lanjut: selectedSurat.tindak_lanjut,
      skala_prioritas: selectedSurat.skala_prioritas,
      intruksi: selectedSurat.intruksi,
      batas_waktu: selectedSurat.batas_waktu,
      catatan: selectedSurat.catatan,
    };
    const currentform = {
      arsip_uuid: selectedSurat.arsip_uuid,
      user_id: selectedSurat.user_id,
      parent_uuid: user.uuid, // Mengirim multi-select data
      tindak_lanjut: selectedSurat.tindak_lanjut,
      skala_prioritas: selectedSurat.skala_prioritas,
      intruksi: selectedSurat.intruksi,
      batas_waktu: selectedSurat.batas_waktu,
      catatan: selectedSurat.catatan,
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
          body: JSON.stringify(form),
        },
      );
      if (response.ok) {
        await updatedis(currentform);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function updatedis(defaultForm) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/disposisi/${selectedSurat.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(defaultForm),
        },
      );
      if (response.ok) {
        const modalElement = document.getElementById("modalDisposisi");
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        setFormDisposisi({ user_ids: [] }); // Reset Pilihan
        setSelectedSurat(null);
        getDisposisi();
      }
    } catch (error) {
      console.error(error);
    }
  }
  const handleOpenDisposisi = (surat) => {
    setSelectedSurat(surat);
    setFormDisposisi({ user_ids: [] }); // Reset input form lama saat modal dibuka baru
    const modal = new window.bootstrap.Modal(
      document.getElementById("modalDisposisi"),
    );
    modal.show();
  };

  useEffect(() => {
    if (token && user?.uuid) {
      getDisposisi();
    }
  }, [token, user]);

  const getPrioClass = (prio) => {
    if (prio === "penting") return "bg-danger text-white";
    if (prio === "segera") return "bg-warning text-dark";
    return "bg-info text-white";
  };

  const previewPDF = (filePath) => {
    if (filePath.startsWith("data:")) {
      const newTab = window.open();
      newTab.document.write(
        `<iframe src="${filePath}" width="100%" height="100%" style="border:none;"></iframe>`,
      );
    } else {
      const fileUrl = `${import.meta.env.VITE_API_URL}${filePath}`;
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <AdminLayout>
      <div className="page-wrapper py-4 px-2 px-md-4 bg-light min-vh-100">
        <div className="container-fluid">
          {/* Header Section */}
          <div className="row mb-4 align-items-center">
            <div className="col">
              <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <i className="bx bx-task text-primary"></i> Tugas Disposisi Saya
              </h3>
              <p className="text-muted mb-0 small text-wrap">
                Kelola instruksi pimpinan dan lakukan tindak lanjut berkas surat
                secara real-time.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="row g-3 g-md-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div
                  className="spinner-border text-primary mb-3"
                  role="status"
                ></div>
                <p className="text-muted fw-medium">
                  Menyelaraskan data tugas Anda...
                </p>
              </div>
            ) : filteredData?.length > 0 ? (
              filteredData.map((item) => (
                <div
                  className="col-12 col-md-6 col-xxl-4"
                  key={item.uuid || item.id}
                >
                  <div className="card border-0 shadow-sm rounded-4 h-100 d-flex flex-column transition-hover">
                    <div
                      className={`p-1 ${item.skala_prioritas === "penting" ? "bg-danger" : item.skala_prioritas === "segera" ? "bg-warning" : "bg-info"}`}
                    />

                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                          <span
                            className={`badge rounded-pill ${getPrioClass(item.skala_prioritas)} px-3 py-2 text-capitalize shadow-sm fs-7`}
                          >
                            <i className="bx bxs-zap me-1"></i>{" "}
                            {item.skala_prioritas}
                          </span>
                          {item.batas_waktu && (
                            <div className="text-muted small d-flex align-items-center">
                              <i className="bx bx-calendar-event me-1 text-danger"></i>
                              <span className="text-secondary fw-semibold">
                                {new Date(item.batas_waktu).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label
                            className="text-muted small text-uppercase fw-bold d-block mb-1"
                            style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                          >
                            Perihal Surat
                          </label>
                          <h6 className="text-dark fw-bold mb-0 text-truncate-2">
                            {item?.surat?.perihal || "Tidak ada Perihal"}
                          </h6>
                        </div>

                        <div className="bg-light p-3 rounded-3 mb-3 border-start border-primary border-3 shadow-inner">
                          <small
                            className="text-primary fw-bold d-block mb-1 text-uppercase"
                            style={{ fontSize: "10px", letterSpacing: "0.5px" }}
                          >
                            Instruksi Pimpinan:
                          </small>
                          <p
                            className="mb-0 text-dark italic small text-break"
                            style={{ lineHeight: "1.5" }}
                          >
                            "{item.intruksi || "Tidak ada instruksi khusus."}"
                          </p>
                        </div>

                        <div className="d-flex align-items-start gap-2 bg-light-subtle p-2 rounded-2 mb-4">
                          <i className="bx bx-notepad text-muted mt-1 fs-5"></i>
                          <span className="small text-muted text-break">
                            <strong className="text-secondary">
                              Pengirim:
                            </strong>{" "}
                            {item.creator ? (
                              <>
                                {item.creator.name} —{" "}
                                <span className="fw-semibold text-primary">
                                  {item.creator.branch
                                    ? item.creator.branch.name
                                    : "Kantor Pusat"}
                                </span>
                              </>
                            ) : (
                              "Tidak ada data pengirim."
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto pt-2 border-top">
                        <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end">
                          {item.read_at ? (
                            <button
                              onClick={() => previewPDF(item.surat.file_path)}
                              className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 w-100 w-sm-auto d-flex align-items-center justify-content-center gap-1"
                            >
                              <i className="bx bx-show fs-5"></i> Lihat Surat
                            </button>
                          ) : (
                            <button
                              onClick={() => handleTerimaSurat(item)}
                              className="btn btn-primary btn-sm rounded-pill px-4 py-2 w-100 d-flex align-items-center justify-content-center gap-1 shadow-sm"
                            >
                              <i className="bx bx-check-shield fs-5"></i>{" "}
                              {buttonLoad
                                ? "Loading ...."
                                : "Konfirmasi Terima Surat"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="card border-0 shadow-sm rounded-4 py-5 text-center bg-white">
                  <div
                    className="p-4 mx-auto bg-light rounded-circle mb-3"
                    style={{ width: "max-content" }}
                  >
                    <i
                      className="bx bx-box text-muted"
                      style={{ fontSize: "3.5rem" }}
                    ></i>
                  </div>
                  <h5 className="text-dark fw-bold mb-1">Semua Tugas Beres!</h5>
                  <p className="text-muted small px-3">
                    Belum ada dokumen disposisi baru yang ditugaskan kepada Anda
                    hari ini.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DISPOSISI MODERN DENGAN REACT-SELECT MULTI */}
      <div
        className="modal fade"
        id="modalDisposisi"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered px-3">
          <div className="modal-content border-0 shadow rounded-4">
            <div className="modal-header border-0 pt-4 px-4 pb-2">
              <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bx bx-git-pull-request text-primary"></i>{" "}
                Delegasikan Disposisi
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

                  {/* Integrasi Komponen React-Select Multi Pilihan Anda */}
                  <Select
                    isMulti
                    name="user_ids"
                    placeholder="-- Pilih Staf (Bisa cari & pilih banyak) --"
                    className="basic-multi-select text-dark small"
                    classNamePrefix="select"
                    closeMenuOnSelect={false}
                    options={
                      filterStaff?.map((user) => ({
                        value: user.uuid,
                        label: `${user.name} (${user.role.replace("_", " ")})`,
                      })) || []
                    }
                    value={
                      filterStaff
                        ?.filter((user) =>
                          formDisposisi?.user_ids?.includes(user.uuid),
                        )
                        .map((user) => ({
                          value: user.uuid,
                          label: `${user.name} (${user.role.replace("_", " ")})`,
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
                        "&:hover": {
                          borderColor: "#86b7fe",
                        },
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
}
