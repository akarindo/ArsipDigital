import React, { useState, useEffect } from "react";
import { usePengajuan } from "../context/PengajuanContext";
import AdminLayout from "./layouts/AdminLayout";

const UserManagement = () => {
  // State Loading
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Loading saat pertama kali buka page
  const [loading, setLoading] = useState(false); // Loading saat hit api (create, update, delete)
  const [branches, setBranches] = React.useState([]);

  const { token, users, stats, fetchUsers } = usePengajuan();

  // State Form & Modal
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    kantor_cabang: "",
    email: "",
    nomor: "",
    password: "",
    role: "direksi",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // State untuk Datatable
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // 1. FETCH DATA (Awal Buka Halaman)
  useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      try {
        // Berjalan paralel agar loading terasa lebih cepat dan efisien
        await Promise.allSettled([
          token ? getBranches() : Promise.resolve(),
          fetchUsers ? fetchUsers() : Promise.resolve(),
        ]);
      } catch (error) {
        console.error("Gagal memuat data awal:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, entriesPerPage]);

  // 2. SUBMIT DATA (Create & Update)
  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setLoading(true); // Mulai loading saat kirim data

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

        const modalEl = document.getElementById("userModal");
        const modalInstance =
          window.bootstrap?.Modal?.getInstance(modalEl) || window.$(modalEl);
        modalInstance.hide();

        if (fetchUsers) await fetchUsers();
      } else {
        const err = await response.json();
        alert(err.message || "Gagal menyimpan data user");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false); // Matikan loading setelah proses selesai
    }
  };

  // 3. DELETE DATA
  const handleDeleteUser = async () => {
    setLoading(true); // Mulai loading saat proses hapus
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

        if (fetchUsers) await fetchUsers();
      } else {
        const err = await response.json();
        alert(err.message || "Gagal menghapus user");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false); // Matikan loading setelah proses hapus selesai
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
      setBranches(result);
    } catch (error) {
      console.error(error.message);
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
      nomor: "",
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
      nomor: user.nomor,
      kantor_cabang: user.kantor_cabang || "",
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

  // Badge modern memakai kombinasi Soft Background & Dark Text
  const getBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case "direksi":
        return "bg-primary-subtle text-primary border border-primary-subtle";
      case "staff umum":
        return "bg-success-subtle text-success border border-success-subtle";
      case "hrd":
        return "bg-warning-subtle text-warning-emphasis border border-warning-subtle";
      default:
        return "bg-secondary-subtle text-secondary border border-secondary-subtle";
    }
  };

  // Logic Filter & Pagination
  const filteredUsers = (users || []).filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.branch?.name &&
        user.branch.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "all" ? true : user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredUsers.slice(
    indexOfFirstEntry,
    indexOfLastEntry,
  );
  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);

  // VIEW LOADING UNTUK DI AWAL BUKA PAGE
  if (isInitialLoading) {
    return (
      <AdminLayout>
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-50 p-5">
          <div
            className="spinner-border text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          ></div>
          <h5 className="mt-4 text-secondary fw-semibold">
            Memuat data pengguna & kantor cabang...
          </h5>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <style>{`
        .modern-card { border: none; border-radius: 16px; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .stat-card { border: none; border-radius: 16px; background: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-2px); }
        .table-modern thead th { background: #f8f9fa; text-transform: uppercase; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; color: #6c757d; padding: 16px; border-bottom: 1px solid #edf2f7; }
        .table-modern tbody td { padding: 16px; color: #4a5568; border-bottom: 1px solid #edf2f7; font-size: 0.9rem; }
        .table-modern tbody tr:hover { background-color: #fcfdfd; }
        .form-control-modern { border-radius: 10px; border: 1px solid #e2e8f0; padding: 10px 14px; font-size: 0.9rem; transition: all 0.2s; }
        .form-control-modern:focus { border-color: #3182ce; box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.15); }
        .btn-modern { border-radius: 10px; padding: 10px 20px; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; }
        .btn-action { padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 500; }
        .modal-modern { border-radius: 20px; border: none; overflow: hidden; }
      `}</style>

      <div className="page-wrapper">
        {/* Header Section */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">Kelola Pengguna</h4>
            <p className="text-secondary small mb-0">
              Manajemen hak akses, peran, dan data kantor cabang karyawan.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn btn-primary btn-modern shadow-sm d-flex align-items-center gap-2"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah User Baru
          </button>
        </div>

        {/* Stats Section */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-md-3">
            <div className="stat-card card p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1 text-muted small fw-medium text-uppercase">
                    Total User Sistem
                  </p>
                  <h3 className="mb-0 fw-bold text-dark">
                    {stats?.totalUser || 0}
                  </h3>
                </div>
                <div className="p-3 bg-info-subtle text-info rounded-3">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="stat-card card p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1 text-muted small fw-medium text-uppercase">
                    Staff Umum Aktif
                  </p>
                  <h3 className="mb-0 fw-bold text-dark">
                    {stats?.totalPetugas || 0}
                  </h3>
                </div>
                <div className="p-3 bg-primary-subtle text-primary rounded-3">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Datatable Card */}
        <div className="modern-card card mb-4">
          <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2">
            <div className="row g-3 align-items-center justify-content-between">
              {/* Entries Limit */}
              <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                <span className="text-muted small">Tampilkan</span>
                <select
                  className="form-select form-select-sm w-auto rounded-3"
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-muted small">
                  data dari total <b>{filteredUsers.length}</b>
                </span>
              </div>

              {/* Filters & Search */}
              <div className="col-12 col-md-7 d-flex flex-column flex-sm-row gap-2 justify-content-md-end">
                <select
                  className="form-select form-select-sm rounded-3 w-sm-auto"
                  style={{ minWidth: "150px" }}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Semua Role</option>
                  <option value="direksi">Direksi</option>
                  <option value="staff umum">Staff Umum</option>
                  <option value="pegawai">Pegawai</option>
                </select>

                <div
                  className="input-group input-group-sm rounded-3 overflow-hidden border"
                  style={{ maxWidth: "320px" }}
                >
                  <span className="input-group-text bg-white border-0 text-muted">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 ps-0"
                    placeholder="Cari nama, email, cabang..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-modern align-middle mb-0">
                <thead>
                  <tr>
                    <th>Nama Pengguna</th>
                    <th>Alamat Email</th>
                    <th>Kantor Cabang</th>
                    <th className="text-center">Peran / Role</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-5">
                        <div className="py-3">
                          <p className="mb-0 fw-medium">
                            Tidak ada data user yang sesuai.
                          </p>
                          <small className="text-secondary">
                            Coba ubah kata kunci pencarian atau filter Anda.
                          </small>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentEntries.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="fw-semibold text-dark">
                            {user.name}
                          </div>
                        </td>
                        <td className="text-muted">{user.email}</td>
                        <td>
                          <span className="badge bg-light text-dark border-0 px-2.5 py-1.5 rounded-2 fw-normal">
                            {user.branch ? user.branch?.name : "Tidak Ada KC"}
                          </span>
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge rounded-pill text-uppercase px-3 py-1.5 font-weight-bold tracking-wider ${getBadgeClass(user.role)}`}
                            style={{ fontSize: "0.75rem" }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-1">
                            <button
                              onClick={() => openEditModal(user)}
                              className="btn btn-outline-warning btn-action d-flex align-items-center gap-1"
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="btn btn-outline-danger btn-action d-flex align-items-center gap-1"
                              disabled={loading}
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Pagination */}
          {filteredUsers.length > 0 && (
            <div className="card-footer bg-transparent border-0 px-4 py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
              <div className="text-muted small">
                Menampilkan <b>{indexOfFirstEntry + 1}</b> -{" "}
                <b>{Math.min(indexOfLastEntry, filteredUsers.length)}</b> dari{" "}
                <b>{filteredUsers.length}</b> entri
              </div>
              {totalPages > 1 && (
                <nav>
                  <ul className="pagination pagination-sm mb-0 gap-1">
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link rounded-2 border border-0 bg-light text-dark"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      >
                        Sebelumnya
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                      >
                        <button
                          className={`page-link rounded-2 border-0 mx-0.5 ${currentPage === index + 1 ? "bg-primary text-white" : "bg-light text-dark"}`}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link rounded-2 border border-0 bg-light text-dark"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                      >
                        Selanjutnya
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          )}
        </div>

        {/* MODAL FORM (CREATE / EDIT) */}
        <div
          className="modal fade"
          id="userModal"
          tabIndex="-1"
          aria-hidden="true"
          data-bs-backdrop="static" /* Mencegah modal tertutup saat tidak sengaja klik di luar modal ketika loading */
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-modern p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">
                  {isEdit
                    ? "✏️ Edit Informasi User"
                    : "👤 Registrasi User Baru"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  disabled={loading}
                ></button>
              </div>
              <form onSubmit={handleSubmitUser}>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary text-uppercase mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control form-control-modern"
                      placeholder="Masukkan nama lengkap"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="row g-3 mb-2">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary text-uppercase mb-1.5">
                        Email Perusahaan
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control form-control-modern"
                        placeholder="nama@perusahaan.com"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary text-uppercase mb-1.5">
                        Nomor
                      </label>
                      <input
                        type="number"
                        name="nomor"
                        value={formData.nomor}
                        onChange={handleInputChange}
                        className="form-control form-control-modern"
                        placeholder="0876..."
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="row g-3 mb-2">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary text-uppercase mb-1.5">
                        Hak Akses (Role)
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="form-select form-control-modern"
                        disabled={loading}
                      >
                        <option value="direksi">Direksi</option>
                        <option value="staff umum">Staff Umum</option>
                        <option value="pegawai">Pegawai</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary text-uppercase mb-1.5">
                        Kantor Cabang
                      </label>
                      <select
                        name="kantor_cabang"
                        value={formData.kantor_cabang}
                        onChange={handleInputChange}
                        className="form-select form-control-modern"
                        disabled={loading}
                      >
                        <option value="">Pilih Kantor Cabang</option>
                        {branches?.map((branch) => (
                          <option key={branch.uuid} value={branch.uuid}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary text-uppercase mb-1.5">
                        {isEdit ? "Kata Sandi Baru" : "Kata Sandi"}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-control form-control-modern"
                        placeholder={
                          isEdit
                            ? "Kosongkan jika tidak diubah"
                            : "Buat password aman"
                        }
                        required={!isEdit}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light btn-modern text-secondary"
                    data-bs-dismiss="modal"
                    disabled={loading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-modern ${isEdit ? "btn-warning text-white" : "btn-primary"} d-flex align-items-center gap-2`}
                    disabled={loading}
                  >
                    {loading && (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    {loading
                      ? "Menyimpan..."
                      : isEdit
                        ? "Perbarui Data"
                        : "Simpan Pengguna"}
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
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content modal-modern text-center p-4">
              <div className="modal-body p-0">
                <div className="text-danger mb-3">
                  <svg
                    width="48"
                    height="48"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h5 className="fw-bold text-dark mb-2">Hapus Pengguna?</h5>
                <p className="text-secondary small mb-4">
                  Anda yakin ingin menghapus{" "}
                  <b className="text-dark">{selectedUser?.name}</b>? Tindakan
                  ini permanen.
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-light btn-modern w-50 text-secondary"
                    data-bs-dismiss="modal"
                    disabled={loading}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    className="btn btn-danger btn-modern w-50 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading && (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    {loading ? "Menghapus..." : "Ya, Hapus"}
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
