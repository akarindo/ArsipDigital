import React, { useState, useEffect } from "react";
// Mengubah import ke custom hook 'usePengajuan' agar konsisten dengan AdminLayout
import { usePengajuan } from "../context/PengajuanContext";
import AdminLayout from "./layouts/AdminLayout";

const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = React.useState([]); // Mengambil data asli database

  // Destruktur menggunakan usePengajuan() dan menambahkan fetchUsers dari context
  const { token, users, stats, fetchUsers } = usePengajuan();

  // State Form & Modal
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    kantor_cabang: "",
    email: "",
    password: "",
    role: "direksi",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 1. FETCH DATA (GET USERS)
  // Memastikan data di-fetch saat komponen pertama kali dimuat
  useEffect(() => {
    if (token) {
      getBranches();
    }
    if (fetchUsers) {
      setLoading(true);
      fetchUsers().finally(() => setLoading(false));
    }
  }, []);

  // 2. SUBMIT DATA (POST / PUT)
  const handleSubmitUser = async (e) => {
    e.preventDefault();

    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}/api/users/${formData.id}`
      : `${import.meta.env.VITE_API_URL}/api/users`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          isEdit ? "User berhasil diperbarui!" : "User berhasil ditambahkan!",
        );

        // Tutup Modal
        const modalEl = document.getElementById("userModal");
        const modalInstance =
          window.bootstrap?.Modal?.getInstance(modalEl) || window.$(modalEl);
        modalInstance.hide();

        if (fetchUsers) fetchUsers();
      } else {
        const err = await response.json();
        alert(err.message || "Gagal menyimpan data user");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi");
    }
  };

  // 3. DELETE DATA
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        alert("User berhasil dihapus!");

        const modalEl = document.getElementById("deleteModal");
        const modalInstance =
          window.bootstrap?.Modal?.getInstance(modalEl) || window.$(modalEl);
        modalInstance.hide();

        if (fetchUsers) fetchUsers();
      } else {
        const err = await response.json();
        alert(err.message || "Gagal menghapus user");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi");
    }
  };
  const getBranches = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/branches`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Gagal mengambil data cabang");
      const result = await response.json();
      console.log("branch", result);
      setBranches(result);
    } catch (error) {
      showAlert("danger", "Error!", error.message);
    }
  };

  // Helper Handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      name: "",
      email: "",
      password: "",
      kantor_cabang: "",
      role: "direksi",
    });

    const modalEl = document.getElementById("userModal");
    const modalInstance = window.bootstrap?.Modal?.getOrCreateInstance(modalEl);
    modalInstance?.show();
  };

  const openEditModal = (user) => {
    setIsEdit(true);
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      kantor_cabang: user.kantor_cabang,
      password: "",
      role: user.role,
    });

    const modalEl = document.getElementById("userModal");
    const modalInstance = window.bootstrap?.Modal?.getOrCreateInstance(modalEl);
    modalInstance?.show();
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);

    const modalEl = document.getElementById("deleteModal");
    const modalInstance = window.bootstrap?.Modal?.getOrCreateInstance(modalEl);
    modalInstance?.show();
  };

  const getBadgeClass = (role) => {
    switch (role) {
      case "direksi":
        return "badge-primary bg-primary text-white";
      case "staff umum":
        return "badge-success bg-success text-white";
      case "hrd":
        return "badge-warning bg-warning text-dark";
      default:
        return "badge-info bg-info text-white";
    }
  };

  if (loading && (!users || users.length === 0)) {
    return (
      <AdminLayout>
        <div className="text-center mt-5 p-5">
          <div className="spinner-border text-primary" role="status"></div>
          <h4 className="mt-3">Memuat Data Pengguna...</h4>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Breadcrumb / Title */}

      <div className="page-wrapper">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Admin</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item active" aria-current="page">
                  Kelola Pengguna
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Statistik & Tombol Aksi */}
        <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
          <div className="col">
            <div className="card radius-10 border-start border-0 border-3 border-info shadow-sm">
              <div className="card-body p-3">
                <p className="mb-1 text-secondary text-uppercase small font-weight-bold">
                  Total User Sistem
                </p>
                <h3 className="my-1 text-info font-weight-bold">
                  {stats?.totalUser || 0}
                </h3>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card radius-10 border-start border-0 border-3 border-primary shadow-sm">
              <div className="card-body p-3">
                <p className="mb-1 text-secondary text-uppercase small font-weight-bold">
                  Staff Umum Aktif
                </p>
                <h3 className="my-1 text-primary font-weight-bold">
                  {stats?.totalPetugas || 0}
                </h3>
              </div>
            </div>
          </div>
          <div className="col d-flex align-items-center">
            <button
              onClick={openCreateModal}
              className="btn btn-primary w-100 py-3 font-weight-bold shadow-sm radius-10"
            >
              + Tambah User Baru
            </button>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="card radius-10 shadow-sm border-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th className="text-center">Role</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {!users || users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        Tidak ada data user.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="font-weight-bold text-dark">
                          {user.name}
                        </td>
                        <td className="text-secondary">{user.email}</td>
                        <td className="text-center">
                          <span
                            className={`badge rounded-pill text-uppercase px-3 py-2 ${getBadgeClass(user.role)}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => openEditModal(user)}
                            className="btn btn-sm btn-link text-warning me-2 text-decoration-none"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="btn btn-sm btn-link text-danger text-decoration-none"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODAL FORM (CREATE / EDIT) */}
        <div
          className="modal fade"
          id="userModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-2">
              <div className="modal-header border-0">
                <h5 className="modal-title font-weight-bold">
                  {isEdit ? "Edit Data User" : "Registrasi User Baru"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmitUser}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small font-weight-bold text-muted text-uppercase">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small font-weight-bold text-muted text-uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small font-weight-bold text-muted text-uppercase">
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="direksi">Direksi</option>
                        <option value="staff umum">Staff Umum</option>
                        <option value="pegawai">Pegawai</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small font-weight-bold text-muted text-uppercase">
                        Kantor Cabang
                      </label>
                      <select
                        name="kantor_cabang"
                        value={formData.kantor_cabang}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="">Pilih Kantor Cabang</option>
                        {branches?.map((branch) => (
                          <option value={branch.uuid}>{branch.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small font-weight-bold text-muted text-uppercase">
                        {isEdit ? "Password Baru *" : "Password"}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder={isEdit ? "Kosongkan jika tetap" : ""}
                        required={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`btn ${isEdit ? "btn-warning text-white" : "btn-primary"}`}
                  >
                    {isEdit ? "Update User" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* MODAL DELETE */}
        <div
          className="modal fade"
          id="deleteModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content text-center border-0 p-3 shadow-lg">
              <div className="modal-body">
                <h5 className="font-weight-bold text-danger mb-3">
                  Hapus User?
                </h5>
                <p className="text-muted">
                  Anda yakin ingin menghapus{" "}
                  <span className="font-weight-bold text-dark">
                    {selectedUser?.name}
                  </span>
                  ? Data tidak bisa dikembalikan.
                </p>
                <div className="d-flex justify-content-center mt-4">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    className="btn btn-danger"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
