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
              <i className="bx bx-plus-circle"></i> Tambah +
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
                    <div className>
                      <img
                        src="/assets/images/searchdoc.png"
                        width={65}
                        height={50}
                        alt
                      />
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-1 font-14">{tujuan.tujuan}</h6>
                    </div>
                  </div>
                  <div className="kanan" style={{ display: "flex" }}>
                    <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                      <div className>
                        <h7 className="mb-1">Aksi:</h7>
                      </div>
                      <button
                        onClick={() => handleEdit(tujuan)}
                        type="button"
                        className="btn-edit pt-1 pb-1"
                        data-bs-toggle="modal"
                        data-bs-target="#tambahTujuanMaster"
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
                          onClick={() => handleDelete(tujuan)}
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
                            Simpan
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
