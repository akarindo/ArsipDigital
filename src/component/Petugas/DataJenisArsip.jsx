import React from "react";
import Sidebar from "../Sidebar";
import { PengajuanContext } from "../../context/PengajuanContext";
import AdminLayout from "../layouts/AdminLayout";

export default function DataJenisArsip() {
  const { semuaJenis, refreshData, token } = React.useContext(PengajuanContext);
  const [isEdit, setIsEdit] = React.useState(false);
  const [currentUuid, setCurrentUuid] = React.useState(null);
  const [jenis, setJenis] = React.useState({ name: "" });

  const getModal = () => {
    const modalEl = document.getElementById("tambahJenisArsip");
    return window.bootstrap.Modal.getOrCreateInstance(modalEl);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEdit(true);
      setCurrentUuid(item.uuid);
      setJenis({ name: item.name });
    } else {
      setIsEdit(false);
      setJenis({ name: "" });
    }
    getModal().show();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/api/jenis/${currentUuid}`
        : `${import.meta.env.VITE_API_URL}/api/jenis`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jenis),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Gagal memproses data");

      getModal().hide();
      refreshData();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDelete = async (item) => {
    if (
      window.confirm(
        "Peringatan: Menghapus item ini akan menghapus semua sub-item di dalamnya!",
      )
    ) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jenis/${item.uuid}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error("Gagal menghapus data");
        refreshData();
      } catch (error) {
        console.error("Hapus Gagal:", error.message);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="page-wrapper px-4 py-4">
        {/* Header Section */}
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h4 className="fw-bold mb-0 text-dark">Data Master Jenis Arsip</h4>
            <p className="text-muted small mb-0">
              Definisikan jenis spesifik dokumen untuk mempermudah pengarsipan.
            </p>
          </div>
          <div className="col-auto">
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary shadow-sm px-4 d-flex align-items-center gap-2"
              style={{ borderRadius: "10px" }}
            >
              <i className="bx bx-plus-circle"></i> Tambah Jenis
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar Left */}
          <div className="col-12 col-lg-3">
            <div
              className="card border-0 shadow-sm p-3"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted text-center">
                  Kategori Data Master
                </h6>
                <Sidebar />
              </div>
            </div>
          </div>

          {/* List Content Right */}
          <div className="col-12 col-lg-9">
            <div className="row">
              {semuaJenis?.map((item) => (
                <div key={item.uuid} className="col-12 mb-3">
                  <div
                    className="card border-0 shadow-sm transition-hover"
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="card-body d-flex align-items-center justify-content-between p-3">
                      <div className="d-flex align-items-center">
                        {/* Icon spesifik Jenis Arsip */}
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <i className="bx bx-file-blank text-info fs-4"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">{item.name}</h6>
                          <span className="text-muted extra-small">
                            ID: {item.uuid.split("-")[0].toUpperCase()}
                          </span>
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

        {/* Modal Modern */}
        <div
          className="modal fade"
          id="tambahJenisArsip"
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
                  {isEdit ? "Update Jenis Arsip" : "Tambah Jenis Arsip"}
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
                    <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                      <i
                        className={`bx ${isEdit ? "bx-revision" : "bx-file-blank"} fs-1 text-info`}
                      ></i>
                    </div>
                    <p className="text-muted small">
                      Tentukan nama spesifik jenis arsip yang akan dikelola
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nama Jenis Arsip
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-0 bg-light"
                      style={{ borderRadius: "12px" }}
                      value={jenis.name}
                      onChange={(e) => setJenis({ name: e.target.value })}
                      placeholder="Contoh: Sertifikat, Akta, Laporan Keuangan"
                      required
                    />
                  </div>
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
                    type="submit"
                    className="btn btn-primary flex-grow-1 py-2"
                    style={{ borderRadius: "10px" }}
                  >
                    {isEdit ? "Simpan Perubahan" : "Simpan Jenis"}
                  </button>
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
        .extra-small { font-size: 11px; }
        .bg-light { background-color: #f8f9fa !important; }
      `}</style>
    </AdminLayout>
  );
}
