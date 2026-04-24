import { Link, useParams } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
import React, { useState } from "react";
import ArsipDigitalPetugas from "../Petugas/ArsipDigitalPetugas";

export default function DetailArsipDigital() {
  const { uuid } = useParams();
  const { arsips, handleDelete, role, pinjamans, user } =
    React.useContext(PengajuanContext);
  // State untuk menyimpan file yang sedang dilihat
  const [viewPdf, setViewPdf] = useState(null);

  const filterArsip = arsips?.filter((arsip) => arsip.kode_arsip == uuid);

  const handlePreview = (base64String) => {
    let pdfUrl = base64String.includes("data:application/pdf")
      ? base64String
      : `data:application/pdf;base64,${base64String}`;

    // Tambahkan parameter untuk menyembunyikan toolbar
    // Catatan: base64 harus diconvert ke Blob URL agar parameter ini bekerja lebih stabil
    const byteCharacters = atob(pdfUrl.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(blob);

    // Tambahkan #toolbar=0 di akhir URL
    setViewPdf(fileURL + "#toolbar=0&navpanes=0&scrollbar=0");
  };

  return (
    <ArsipDigitalPetugas>
      <div className="dropdown">
        <a
          href="#"
          className="btn btn-white btn-sm my-3 mt-0 p-2 pe-0"
          data-bs-toggle="dropdown"
        >
          Semua Arsip <i className="bx bxs-chevron-down ms-5" />
        </a>

        {viewPdf && (
          <div className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
              <h6 className="mb-0">Pratinjau Dokumen (Hanya Lihat)</h6>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setViewPdf(null)}
              >
                Tutup
              </button>
            </div>
            <div
              className="card-body p-0 position-relative"
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Overlay transparan untuk mencegah klik kanan/interaksi langsung jika perlu */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "60px", // Melindungi area toolbar atas
                  backgroundColor: "transparent",
                  zIndex: 10,
                }}
              />

              <iframe
                src={viewPdf}
                width="100%"
                height="600px"
                style={{ border: "none" }}
                title="PDF Preview"
              ></iframe>
            </div>
          </div>
        )}

        <div className="customers-list mb-3">
          {filterArsip?.map((arsip, index) => {
            const isPinjam = pinjamans?.filter(
              (pinjam) =>
                pinjam.arsip_uuid == arsip.uuid &&
                pinjam.user_uuid == user.uuid &&
                !pinjam.telah_dikembalikan,
            );

            return (
              <div
                key={index}
                className="customers-list-item shadow-sm cursor-pointer bg-white"
                style={{ marginBottom: 15 }}
              >
                <div className="top d-flex align-items-center justify-content-between p-3">
                  <div className="kiri">
                    <img
                      src="/assets/images/iconpdf.png"
                      width={60}
                      height={60}
                      alt="pdf"
                    />
                  </div>
                  {role != "pegawai" && (
                    <div className="kanan">
                      {/* Tombol Lihat (Hanya Lihat yang tersisa) */}
                      <div
                        onClick={() => handlePreview(arsip.file)}
                        className="d-flex align-items-center border px-3 radius-10 text-white"
                        style={{
                          height: 35,
                          backgroundColor: "#386CFF",
                          cursor: "pointer",
                        }}
                      >
                        <span className="me-2 mb-0">Lihat</span>
                        <img
                          src="/assets/images/eye.png"
                          width={15}
                          height={10}
                          alt="eye"
                        />
                      </div>
                    </div>
                  )}
                  {isPinjam.length > 0 && (
                    <div className="kanan">
                      {/* Tombol Lihat (Hanya Lihat yang tersisa) */}
                      <div
                        onClick={() => handlePreview(arsip.file)}
                        className="d-flex align-items-center border px-3 radius-10 text-white"
                        style={{
                          height: 35,
                          backgroundColor: "#386CFF",
                          cursor: "pointer",
                        }}
                      >
                        <span className="me-2 mb-0">Lihat</span>
                        <img
                          src="/assets/images/eye.png"
                          width={15}
                          height={10}
                          alt="eye"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <h6 className="ms-3 mb-0 fw-bold">{arsip.judul_arsip}</h6>

                <div className="d-flex justify-content-between p-3 py-2">
                  <div>
                    <div className="mb-1">
                      <span className="fw-bold">Jenis Arsip</span> :{" "}
                      <span className="text-secondary">
                        {arsip.jenis_arsip}
                      </span>
                    </div>
                    <div>
                      <span className="fw-bold">Kategori</span> :{" "}
                      <span className="text-secondary">
                        {arsip.kategori_arsip}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1">
                      <span className="fw-bold">Tipe</span> :{" "}
                      <span className="text-secondary">{arsip.tipe_arsip}</span>
                    </div>
                    <div>
                      <span className="fw-bold">Waktu Upload</span> :{" "}
                      <span className="text-secondary">17 Maret 2025</span>
                    </div>
                  </div>
                </div>
                {role == "petugas" && (
                  <div className="d-flex p-3 pt-0 gap-3">
                    <button
                      onClick={() => handleEdit(arsip)}
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#modaltambahFisik"
                      className="btn btn-info text-white flex-grow-1 rounded"
                    >
                      Edit Arsip
                    </button>
                    <button
                      onClick={() => handleDelete(arsip)}
                      type="button"
                      className="btn btn-danger text-white flex-grow-1 rounded"
                    >
                      Hapus Arsip
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination tetep ada di bawah */}
          <nav
            aria-label="Page navigation"
            className="d-flex justify-content-center mt-4"
          >
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#">
                  «
                </a>
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  »
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </ArsipDigitalPetugas>
  );
}
