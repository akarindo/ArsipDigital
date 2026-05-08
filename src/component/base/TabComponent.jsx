import React from "react";

const TabComponent = ({ navigate, role, tab, handleOpenModal }) => {
  return (
    <>
      <div className="d-flex align-items-center">
        <div className="search-bar flex-grow-1">
          <h4>Data Arsip</h4>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div className="search-bar flex-grow-1">
          <ul className="nav nav-pills mb-3" role="tablist">
            <li
              onClick={() => navigate("/dataArsip")}
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
              onClick={() => navigate("/dataArsipPetugas/ArsipDigitalPetugas")}
              className={`nav-item ${tab === "ArsipDigitalPetugas" ? "active" : ""}`}
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

        {role == "staff umum" ? (
          <div className="user-box">
            <div className="col mb-3">
              <button
                type="button"
                className="btn-tambah px-5"
                onClick={handleOpenModal}
              >
                Tambah
              </button>
            </div>
          </div>
        ) : role == "pegawai" ? (
          <div className="user-box">
            <div className="col mb-3">
              <button
                type="button"
                className="btn-pengajuan px-5 pb-2 pt-2"
                data-bs-toggle="modal"
                data-bs-target="#modalFisik"
              >
                Pengajuan Peminjaman
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default TabComponent;
