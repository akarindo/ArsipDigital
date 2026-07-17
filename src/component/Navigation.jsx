import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navigation = ({ onNavigateMobile }) => {
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const petugasMenu = [
    { name: "Dashboard", path: "/dashboardPetugas", icon: "house.png" },
    { name: "Data Arsip", path: "/dataArsip", icon: "clipboard-list.png" },
    { name: "Data Master", path: "/instansi", icon: "clipboard-list.png" },
    { name: "Data Pengguna", path: "/pengguna", icon: "clipboard-list.png" },
    { name: "Approval", path: "/approvalPetugas", icon: "history.png" },
    { name: "Kotak Masuk", path: "/kotak-masuk", icon: "history.png" },
    { name: "Master Surat", path: "/surat", icon: "history.png" },
    { name: "Arsip Surat", path: "/gdrive", icon: "history.png" },
    {
      name: "Disposisi Surat",
      path: "/disposisi",
      icon: "clipboard-list.png",
    },
    { name: "Riwayat Disposisi", path: "/riwayat", icon: "clipboard-list.png" },
  ];

  const staffMenu = [
    { name: "Dashboard", path: "/dashboardpegawai", icon: "house.png" },
    { name: "Data Arsip", path: "/dataArsip", icon: "clipboard-list.png" },
    {
      name: "Log Pengajuan",
      path: "/logPengajuanStaff",
      icon: "clipboard-list.png",
    },
    { name: "Log History", path: "/logHistoryStaff", icon: "history.png" },
    { name: "Manajemen Surat", path: "/surat", icon: "history.png" },
    { name: "Kotak Masuk", path: "/kotak-masuk", icon: "history.png" },
    {
      name: "Disposisi Surat",
      path: "/disposisistaff",
      icon: "clipboard-list.png",
    },
  ];

  const pimpinanMenu = [
    { name: "Dashboard", path: "/dashboardpegawai", icon: "house.png" },
    { name: "Data Arsip", path: "/dataArsip", icon: "clipboard-list.png" },
    { name: "Kotak Masuk", path: "/kotak-masuk", icon: "history.png" },
    { name: "Riwayat Disposisi", path: "/riwayat", icon: "clipboard-list.png" },
  ];

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  }

  useEffect(() => {
    const userRole = localStorage.getItem("role");

    if (userRole === "staff umum" || userRole === "super_admin") {
      setMenus(petugasMenu);
    } else if (userRole === "pegawai" || userRole === "hrd") {
      setMenus(staffMenu);
    } else {
      setMenus(pimpinanMenu);
    }
  }, []);

  return (
    <div className="d-flex flex-column justify-content-between h-100 pb-4">
      <ul
        className="metismenu p-3 mb-0"
        id="menu"
        style={{ listStyle: "none" }}
      >
        <h6
          className="ms-3 mb-3 text-uppercase text-muted"
          style={{ fontSize: "11px", fontWeight: "bold", letterSpacing: "1px" }}
        >
          Main Menu
        </h6>
        {menus.map((menu) => {
          const isActive = location.pathname === menu.path;
          return (
            <li
              key={menu.path}
              className={`menu-item ${isActive ? "active" : ""}`}
            >
              <Link
                to={menu.path}
                // Menutup sidebar di mobile setelah item di-klik
                onClick={onNavigateMobile}
                className={`link d-flex align-items-center p-2 rounded mb-1 text-decoration-none ${
                  isActive ? "bg-light text-primary fw-semibold" : "text-dark"
                }`}
              >
                <div className="parent-icon me-3 d-flex align-items-center">
                  <img
                    src={`/assets/images/${menu.icon}`}
                    alt={menu.name}
                    width="20"
                    height="20"
                  />
                </div>
                <div className="menu-title">{menu.name}</div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bagian Tombol Logout */}
      <div className="px-4 mt-auto">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded py-2"
          style={{ transition: "all 0.2s" }}
        >
          <i className="bx bx-log-out fs-5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
