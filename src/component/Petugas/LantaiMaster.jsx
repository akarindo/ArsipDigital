import React, { useState } from "react";
import { PengajuanContext } from "../../context/PengajuanContext";
import Sidebar from "../Sidebar";
import AdminLayout from "../layouts/AdminLayout";

export default function LantaiMaster() {
  const [floor, setFloor] = useState({
    building_uuid: "",
    name: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentUuid, setCurrentUuid] = useState(null);
  const { token, gedungs, floors, refreshData } =
    React.useContext(PengajuanContext);

  const getModal = () => {
    const modalEl = document.getElementById("tambahLantaiMaster");
    return window.bootstrap.Modal.getOrCreateInstance(modalEl);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEdit(true);
      setCurrentUuid(item.uuid);
      setFloor({
        building_uuid: item.building_uuid || "",
        name: item.name,
      });
    } else {
      setIsEdit(false);
      setFloor({ building_uuid: "", name: "" });
    }
    getModal().show();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/api/floors/${currentUuid}`
        : `${import.meta.env.VITE_API_URL}/api/floors`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(floor),
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
        "Peringatan: Menghapus lantai akan menghapus semua ruangan dan rak di dalamnya!",
      )
    ) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/floors/${item.uuid}`,
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

  // Helper untuk mendapatkan nama gedung berdasarkan UUID
  const getBuildingName = (uuid) => {
    const b = gedungs?.find((g) => g.uuid === uuid);
    return b ? b.name : "Gedung Tidak Diketahui";
  };

  return (
    <AdminLayout>
      <div className="page-wrapper px-4 py-4">
        {/* Header */}
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h4 className="fw-bold mb-0 text-dark">Data Master Lantai</h4>
            <p className="text-muted small mb-0">
              Manajemen level lantai pada setiap gedung penyimpanan.
            </p>
          </div>
          <div className="col-auto">
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary shadow-sm px-4 d-flex align-items-center gap-2"
              style={{ borderRadius: "10px" }}
            >
              <i className="bx bx-plus-circle"></i> Tambah Lantai
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-12 col-lg-3">
            <div
              className="card border-0 shadow-sm p-3"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted text-center">
                  Menu Data Master
                </h6>
                <Sidebar />
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="col-12 col-lg-9">
            <div className="row">
              {floors?.map((item) => (
                <div key={item.uuid} className="col-12 mb-3">
                  <div
                    className="card border-0 shadow-sm transition-hover"
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="card-body d-flex align-items-center justify-content-between p-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <i className="bx bx-layers text-info fs-4"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">{item.name}</h6>
                          <span className="text-muted extra-small">
                            <i className="bx bx-building me-1"></i>
                            {getBuildingName(item.building_uuid)}
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

        {/* Modal */}
        <div
          className="modal fade"
          id="tambahLantaiMaster"
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
                  {isEdit ? "Update Lantai" : "Tambah Lantai Baru"}
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
                        className={`bx ${isEdit ? "bx-edit" : "bx-layers"} fs-1 text-info`}
                      ></i>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Pilih Gedung Induk
                    </label>
                    <select
                      className="form-select border-0 bg-light"
                      style={{ borderRadius: "12px", padding: "12px" }}
                      required
                      value={floor.building_uuid}
                      onChange={(e) =>
                        setFloor({ ...floor, building_uuid: e.target.value })
                      }
                    >
                      <option value="">-- Pilih Gedung --</option>
                      {gedungs?.map((g) => (
                        <option key={g.uuid} value={g.uuid}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nama Lantai
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-0 bg-light"
                      style={{ borderRadius: "12px" }}
                      value={floor.name}
                      onChange={(e) =>
                        setFloor({ ...floor, name: e.target.value })
                      }
                      placeholder="Contoh: Lantai 1 atau Basement"
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
                    {isEdit ? "Update Lantai" : "Simpan Lantai"}
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
        .extra-small { font-size: 11px; display: block; margin-top: 2px; }
      `}</style>
    </AdminLayout>
  );
}
