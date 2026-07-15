import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State untuk mengontrol tab/dropdown mana yang sedang terbuka
  const [openTab, setOpenTab] = useState({
    surat: true, // default terbuka
    arsip: true,
  });

  const toggleTab = (tabName) => {
    setOpenTab((prev) => ({
      ...prev,
      [tabName]: !prev[tabName],
    }));
  };

  // Struktur menu berdasarkan kelompok Surat
  const suratMenus = [
    { name: "Instansi", path: "/instansi" },
    { name: "Kantor Cabang", path: "/kantor-cabang" }, // Menu Baru
  ];

  // Struktur menu berdasarkan kelompok Arsip
  const arsipMenus = [
    { name: "Nama", path: "/dataMaster/nama" },
    { name: "Tipe", path: "/dataMaster/main" },
    { name: "Jenis", path: "/dataMaster/jenis" },
    { name: "Kategori", path: "/dataMaster/KategoriMaster" },
    { name: "Gedung", path: "/dataMaster/GedungMaster" },
    { name: "Lantai", path: "/dataMaster/LantaiMaster" },
    { name: "Ruang", path: "/dataMaster/RuangMaster" },
    { name: "Lemari", path: "/dataMaster/LemariMaster" },
    { name: "Rak", path: "/dataMaster/RakMaster" },
    { name: "Folder", path: "/dataMaster/FolderMaster" },
    { name: "Tujuan", path: "/dataMaster/TujuanMaster" },
    { name: "Kode Arsip", path: "/dataMaster/KodeArsipMaster" },
  ];

  // Fungsi helper untuk merender item menu
  const renderMenuItems = (menuList) => {
    return menuList.map((menu, index) => {
      const isActive = location.pathname === menu.path;
      return (
        <div
          key={index}
          onClick={() => navigate(menu.path)}
          className={`list-group-item py-2 ps-4 ${isActive ? "active" : ""}`}
          style={{ cursor: "pointer" }}
          role="presentation"
        >
          <span>{menu.name}</span>
        </div>
      );
    });
  };

  return (
    <div className="fm-menu mt-3">
      <div className="list-group list-group-flush">
        {/* === TAB SURAT === */}
        <div
          className="list-group-item bg-light font-weight-bold d-flex justify-content-between align-items-center"
          onClick={() => toggleTab("surat")}
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          <span>📁 MASTER SURAT</span>
          <span>{openTab.surat ? "▼" : "►"}</span>
        </div>
        {openTab.surat && renderMenuItems(suratMenus)}

        {/* === TAB ARSIP === */}
        <div
          className="list-group-item bg-light font-weight-bold d-flex justify-content-between align-items-center mt-2"
          onClick={() => toggleTab("arsip")}
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          <span>📁 MASTER ARSIP</span>
          <span>{openTab.arsip ? "▼" : "►"}</span>
        </div>
        {openTab.arsip && renderMenuItems(arsipMenus)}
      </div>
    </div>
  );
};

export default Sidebar;
