import { Link, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import AdminLayout from "../layouts/AdminLayout";
import React from "react";
import { PengajuanContext } from "../../context/PengajuanContext";

export default function TujuanMaster() {
  const { tujuans, refreshData, token } = React.useContext(PengajuanContext);
  const [isEdit, setIsEdit] = React.useState(false);
  const [currentUuid, setCurrentUuid] = React.useState(null);
  const [tujuan, setTujuan] = React.useState({
    tujuan: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/api/tujuans/${currentUuid}`
        : `${import.meta.env.VITE_API_URL}/api/tujuans`;

      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tujuan),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login Gagal");
      }
      setTujuan({ tujuan: "" });
      setIsEdit(false);
      setCurrentUuid(null);
      handleCloseModal();
      refreshData();
    } catch (error) {
      console.error("Login Gagal:", error.message);
    }
  };
  const handleEdit = (tujuanItem) => {
    setIsEdit(true);
    setCurrentUuid(tujuanItem.uuid);
    setTujuan({
      tujuan: tujuanItem.tujuan,
    });
  };
  const handleDelete = async (tujuanItem) => {
    if (
      window.confirm(
        "Peringatan: Menghapus item ini akan menghapus semua sub-item di dalamnya!",
      )
    ) {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/api/tujuans/" + tujuanItem.uuid,
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
  const handleOpenModal = (data = null) => {
    if (data) {
      handleEdit(data);
      const modal = new bootstrap.Modal(
        document.getElementById("tambahTujuanMaster"),
      );
      modal.show();
    } else {
      setIsEdit(false);
      setTujuan({
        tujuan: "",
      });
    }
    const modal = new bootstrap.Modal(
      document.getElementById("tambahTujuanMaster"),
    );
    modal.show();
  };

  const handleCloseModal = () => {
    const modalElement = document.getElementById("tambahTujuanMaster");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
  };
  return (
    <AdminLayout>
      <div className="page-wrapper px-4 py-4">
        {/* Header Section */}
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h4 className="fw-bold mb-0 text-dark">Data Master</h4>
            <p className="text-muted small mb-0">
              Kelola daftar arsip dan kategori master data nama Anda.
            </p>
          </div>
          <div className="col-auto">
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary shadow-sm px-4 d-flex align-items-center gap-2"
              style={{ borderRadius: "10px" }}
            >
              <i className="bx bx-plus-circle"></i> Tambah Tujuan
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
                  Nama Data Master
                </h6>
                <Sidebar />
              </div>
            </div>
          </div>

          {/* List Content Right */}
          <div className="col-12 col-lg-9">
            <div className="row">
              {tujuans?.map((tujuan) => (
                <div
                  className="customers-list-item d-flex align-items-center justify-content-between p-3 cursor-pointer bg-white radius-10"
                  style={{ marginBottom: 15 }}
                >
                  <div
                    className="kiri"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <i className="bx bx-bullseye text-info fs-4"></i>
                        </div>
                    
                      <h6 className="mb-1 fw-bold">{tujuan.tujuan}</h6>
                    
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleOpenModal(tujuan)}
                      className="btn btn-sm btn-light-primary px-3"
                    >
                      <i className="bx bx-edit-alt me-1"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tujuan)}
                      className="btn btn-sm btn-light-danger px-3"
                    >
                      <i className="bx bx-trash me-1"></i> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="modal fade"
            id="tambahTujuanMaster"
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
                    {isEdit ? "Update Tujuan" : "Tambah Tujuan Baru"}
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
                        className={`bx ${isEdit ? "bx-edit" : "bx-bullseye"} fs-1 text-info`}
                      ></i>
                    </div>
                  </div>
                    <div className="mb-3">
                      <label className="form-label">Tujuan</label>
                      <input
                        name="tujuan"
                        onChange={(e) => setTujuan({ tujuan: e.target.value })}
                        value={tujuan.tujuan}
                        type="text"
                        className="form-control radius-30"
                        placeholder="Masukkan Tujuan"
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-0 pb-4 px-4 gap-2">
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
                    Simpan Data
                  </button>
                </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .transition-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .transition-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
        .btn-light-primary { background: #eef4ff; border: none; color: #0059ff;}
        .btn-light-primary:hover { background: #0059ff; color: #ffff; border: none; }
        .btn-light-danger { background: #fff0f0; border: none; color: #f60000 }
        .btn-light-danger:hover { background: #f60000; border: none; color: #ffff; }
        .extra-small { font-size: 11px; }
        .bg-light { background-color: #f8f9fa !important; }
      `}</style>
    </AdminLayout>
  );
}
