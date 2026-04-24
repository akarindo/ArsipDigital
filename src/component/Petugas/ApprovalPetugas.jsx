import { Link, useNavigate, useLocation } from "react-router-dom";
import ApprovalFisik from "../ApprovalFisik";
import Navigation from "../Navigation";
import { usePengajuan } from "../../context/PengajuanContext";
import { useState } from "react";

export default function ApprovalPetugas() {
  const navigate = useNavigate();
  const location = useLocation();
  const [param, setParam] = useState("fisik");
  const tab = location.pathname.includes("Arsip Digital")
    ? "Arsip Digital"
    : "Arsip Fisik";
  const { pinjamans, tujuans, token, isLoading } = usePengajuan();
  const fisik = pinjamans?.filter((pinjaman) => pinjaman?.arsip?.file == null);
  const digital = pinjamans?.filter(
    (pinjaman) => pinjaman?.arsip?.file != null,
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [alasanTolak, setAlasanTolak] = useState("");
  const filterPinjaman = param == "fisik" ? fisik : digital;
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .format(date)
      .replace(".", ":"); // Mengganti titik pemisah jam menjadi titik dua jika perlu
  };
  const handleTolak = (pengajuan) => {
    setSelectedItem(pengajuan);
    setShowModal(true);
  };
  const handleApprove = async (item) => {
    const dataToSend = {
      user_uuid: item.user_uuid,
      arsip_uuid: item.arsip_uuid,
      tujuan_uuid: item.tujuan_uuid,
      status: "approve",
      response_at: new Date().toISOString(), // Format ISO agar diterima Laravel (as date)
    };
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/peminjamans/${item.uuid}`;

      const method = "PUT";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login Gagal");
      }
    } catch (error) {
      console.error("Login Gagal:", error.message);
    }
  };
  const handleReject = async (item) => {
    const dataToSend = {
      user_uuid: item.user_uuid,
      arsip_uuid: item.arsip_uuid,
      tujuan_uuid: item.tujuan_uuid,
      status: "reject",
      alasan_penolakan: alasanTolak,
      response_at: new Date().toISOString(), // Format ISO agar diterima Laravel (as date)
    };
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/peminjamans/${item.uuid}`;

      const method = "PUT";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      setShowModal(false);
      setAlasanTolak("");
      setSelectedItem(null);
      if (!response.ok) {
        throw new Error(result.message || "Login Gagal");
      }
    } catch (error) {
      console.error("Login Gagal:", error.message);
    }
  };
  const handleGetArsip = async (item) => {
    const waktuKembali = new Date();
    waktuKembali.setMinutes(waktuKembali.getHours() + 8);
    const dataToSend = {
      user_uuid: item.user_uuid,
      arsip_uuid: item.arsip_uuid,
      tujuan_uuid: item.tujuan_uuid,
      status: "approve",
      waktu_diterima: new Date().toISOString(),
      telah_diterima: true,
      waktu_kembalikan: waktuKembali.toISOString(),
    };
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/peminjamans/${item.uuid}`;

      const method = "PUT";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Login Gagal");
      }
    } catch (error) {
      console.error("Login Gagal:", error.message);
    }
  };

  return (
    <div className="wrapper">
      {/*sidebar wrapper */}
      <div className="sidebar-wrapper" data-simplebar="true">
        <div
          className="sidebar-header"
          style={{ border: "none", justifyContent: "center" }}
        >
          <div className>
            <h4
              className="logo-text"
              style={{ fontWeight: 600, fontSize: 20, marginLeft: 0 }}
            >
              Arsip Digital Bank
            </h4>
          </div>
        </div>
        {/*navigation*/}
        <Navigation />
        {/*end navigation*/}
      </div>
      {/*end sidebar wrapper */}
      {/*start header */}
      <header>
        <div className="topbar d-flex align-items-center">
          <nav className="navbar navbar-expand">
            <div className="mobile-toggle-menu">
              <i className="bx bx-menu" />
            </div>
            <div className="search-bar flex-grow-1">
              <h4 className="mb-0">Selamat Datang</h4>
            </div>
            <div className="top-menu ms-auto">
              <ul className="navbar-nav align-items-center">
                <li className="nav-item dropdown dropdown-large">
                  <img
                    src="/assets/images/bell-dot.png"
                    width="25px"
                    height="25px"
                    alt
                  />
                </li>
              </ul>
            </div>
            <div className="user-box" style={{ border: "none" }}>
              <div className="col">
                <button
                  type="button"
                  className="btn btn-primary px-5 pe-3 ps-3 radius-30"
                >
                  <img
                    src="/assets/images/Avatar.png"
                    alt
                    style={{ marginRight: 10 }}
                  />
                  Petugas
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      {/*end header */}
      <div className="page-wrapper">
        <div className="page-content">
          <div className="d-flex align-items-center">
            <div
              className="search-bar flex-grow-1 d-flex align-items-center"
              style={{ marginBottom: 10 }}
            >
              <h4 style={{ marginBottom: 0 }}>Approval</h4>
            </div>
          </div>
          <div className="d-flex align-items-center mb-3">
            <div className="search-bar flex-grow-1">
              <ul className="nav nav-pills" role="tablist">
                <li
                  onClick={() => setParam("fisik")}
                  className={`nav-item ${tab === "Arsip Fisik" ? "active" : ""}`}
                  role="presentation"
                  style={{ width: "50%", cursor: "pointer" }}
                >
                  <div
                    className="nav-link active"
                    data-bs-toggle="pill"
                    href="#primary-pills-home"
                    role="tab"
                    aria-selected="true"
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="tab-title">Arsip Fisik</div>
                    </div>
                  </div>
                </li>
                <li
                  onClick={() => setParam("digital")}
                  className={`nav-item ${tab === "Arsip Digital" ? "active" : ""}`}
                  role="presentation"
                  style={{ width: "50%", cursor: "pointer" }}
                >
                  <div
                    className="nav-link"
                    data-bs-toggle="pill"
                    href="#primary-pills-profile"
                    role="tab"
                    aria-selected="false"
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="tab-title">Arsip Digital</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <ApprovalFisik
            filterPinjaman={filterPinjaman}
            tujuans={tujuans}
            isLoading={isLoading}
            handleApprove={(item) => handleApprove(item)}
            handleTolak={(item) => handleTolak(item)}
            formatDate={(string) => formatDate(string)}
            handleGetArsip={(item) => handleGetArsip(item)}
          />
        </div>
      </div>
      {/* Modal Alasan Terlambat */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  Peringatan: Alasan Penolakan!
                </h5>
              </div>
              <div className="modal-body">
                <p>Harap masukkan alasan penolakan:</p>
                <textarea
                  className="form-control"
                  rows="3"
                  value={alasanTolak}
                  onChange={(e) => setAlasanTolak(e.target.value)}
                  placeholder="Contoh: Masih digunakan untuk audit..."
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!alasanTolak.trim()} // Tombol mati jika alasan kosong
                  onClick={() => handleReject(selectedItem, alasanTolak)}
                >
                  Kirim & Kembalikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
