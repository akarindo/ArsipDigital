import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [menus, setMenus] = useState([]);
  const [role, setRole] = useState(null);

  const petugasMenu = [
    // { name: "Dashboard", path: "#", icon: "house.png" },
    // { name: "Data Arsip", path: "#", icon: "clipboard-list.png" },
    // {
    //   name: "Data Master",
    //   path: "#",
    //   icon: "clipboard-list.png",
    // },
    // { name: "Approval", path: "#", icon: "history.png" },
    { name: "Dashboard", path: "/dashboardPetugas", icon: "house.png" },
    { name: "Data Arsip", path: "/dataArsip", icon: "clipboard-list.png" },
    {
      name: "Data Master",
      path: "/dataMaster/main",
      icon: "clipboard-list.png",
    },
    { name: "Approval", path: "/approvalPetugas", icon: "history.png" },
    { name: "Manajemen Surat", path: "/surat", icon: "history.png" },
    {
      name: "Logout",
      path: "/",
      icon: "clipboard-list.png",
    },
  ];

  const staffMenu = [
    { name: "Dashboard", path: "/dashboardStaff", icon: "house.png" },
    { name: "Data Arsip", path: "/dataArsip", icon: "clipboard-list.png" },
    {
      name: "Log Pengajuan",
      path: "/logPengajuanStaff",
      icon: "clipboard-list.png",
    },
    { name: "Log History", path: "/logHistoryStaff", icon: "history.png" },
    // { name: "Dashboard", path: "#", icon: "house.png" },
    // { name: "Data Arsip", path: "#", icon: "clipboard-list.png" },
    // {
    //   name: "Log Pengajuan",
    //   path: "#",
    //   icon: "clipboard-list.png",
    // },
    // { name: "Log History", path: "#", icon: "history.png" },
    {
      name: "Disposisi Surat",
      path: "/disposisistaff",
      icon: "clipboard-list.png",
    },
    {
      name: "Logout",
      path: "/",
      icon: "clipboard-list.png",
    },
  ];
  const pimpinanMenu = [
    { name: "Dashboard", path: "/dashboardPetugas", icon: "house.png" },
    { name: "Data Arsip", path: "/dataArsip", icon: "clipboard-list.png" },
    // { name: "Dashboard", path: "#", icon: "house.png" },
    // { name: "Data Arsip", path: "#", icon: "clipboard-list.png" },
    { name: "Disposisi Surat", path: "/disposisi", icon: "clipboard-list.png" },
    {
      name: "Riwayat Disposisi",
      path: "/riwayat",
      icon: "clipboard-list.png",
    },
    {
      name: "Logout",
      path: "/",
      icon: "clipboard-list.png",
    },
  ];

  useEffect(() => {
    // 1. Ambil role dari localStorage cukup sekali saat komponen pertama kali muncul
    const userRole = localStorage.getItem("role");
    setRole(userRole);

    // 2. Set menu berdasarkan role di dalam useEffect agar tidak loop
    if (userRole === "staff umum") {
      setMenus(petugasMenu);
    } else if (userRole === "pegawai" || userRole == "hrd") {
      setMenus(staffMenu);
    } else {
      setMenus(pimpinanMenu);
    }
  }, []); // Dependency array kosong [] artinya hanya jalan 1x saat mount

  return (
    <ul className="metismenu p-3" id="menu">
      <h6 className="ms-3 mb-3">MAIN MENU</h6>
      {menus.map((menu) => (
        <li key={menu.path}>
          <Link to={menu.path} className="link">
            <div className="parent-icon">
              <img src={`/assets/images/${menu.icon}`} alt={menu.name} />
            </div>
            <div className="menu-title">{menu.name}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Navigation;
