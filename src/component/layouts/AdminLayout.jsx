import React, { useEffect, useState } from "react";
import Navigation from "../Navigation";
import { usePengajuan } from "../../context/PengajuanContext";

const AdminLayout = ({ children }) => {
  const { role } = usePengajuan();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk kontrol responsive sidebar (buka/tutup)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem("user");
      if (data) {
        setUser(JSON.parse(data));
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // Menambahkan class 'toggled' jika sidebar dalam kondisi terbuka di mobile
    <div className={`wrapper ${isSidebarOpen ? "toggled" : ""}`}>
      {/* Overlay penutup jika sidebar terbuka di layar mobile */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 999,
            transition: "all 0.3s ease",
          }}
        />
      )}

      {/* Sidebar Wrapper */}
      <div
        className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}
        data-simplebar="true"
        style={{
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
      >
        <div
          className="sidebar-header d-flex align-items-center justify-content-between"
          style={{ border: "none", padding: "15px" }}
        >
          <h4
            className="logo-text mb-0"
            style={{ fontWeight: 600, fontSize: 20 }}
          >
            Manajemen Surat
          </h4>
          {/* Tombol close sidebar khusus mobile */}
          <button
            className="btn d-lg-none border-0 p-1"
            onClick={toggleSidebar}
          >
            <i className="bx bx-x fs-3" />
          </button>
        </div>

        {/* Mengirim fungsi toggleSidebar ke Navigation agar tertutup setelah navigasi di HP */}
        <Navigation onNavigateMobile={() => setIsSidebarOpen(false)} />
      </div>

      {/* Header / Topbar */}
      <header>
        <div className="topbar d-flex align-items-center">
          <nav className="navbar navbar-expand px-3 w-100 justify-content-between">
            {/* Tombol Hamburger Menu untuk Mobile */}
            <div
              className="mobile-toggle-menu me-3"
              onClick={toggleSidebar}
              style={{ cursor: "pointer" }}
            >
              <i className="bx bx-menu fs-3" />
            </div>

            <div className="search-bar flex-grow-1 d-none d-sm-block">
              <h4 className="mb-0 fs-5 text-secondary">Selamat Datang</h4>
            </div>

            <div className="d-flex align-items-center gap-3 ms-auto">
              {/* Notifikasi */}
              <ul className="navbar-nav align-items-center">
                <li className="nav-item dropdown dropdown-large">
                  <a
                    className="nav-link position-relative p-1"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src="/assets/images/bell-dot.png"
                      width="25"
                      height="25"
                      alt="Notifikasi"
                    />
                  </a>
                </li>
              </ul>

              {/* Profile Section */}
              <div className="user-box" style={{ border: "none" }}>
                <button
                  type="button"
                  className="btn-avatar p-1 d-flex align-items-center border-0 bg-transparent"
                >
                  <img
                    src="/assets/images/Avatar.png"
                    alt="User Avatar"
                    width="32"
                    height="32"
                    className="rounded-circle me-2"
                  />
                  <span className="user-name text-dark d-none d-md-inline">
                    {isLoading ? "Memuat..." : user?.name || "Pengguna"}
                  </span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
