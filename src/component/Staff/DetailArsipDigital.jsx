import { Link, useParams } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
import React, { useState } from "react";
import ArsipDigitalPetugas from "../Petugas/ArsipDigitalPetugas";
import SkeletonItem from "../SkeletonItem";
import ArchiveDigitalCard from "../base/ArchiveDigitalCard";

export default function DetailArsipDigital() {
  const { uuid } = useParams();
  const {
    arsips,
    handleDelete,
    role,
    isLoading,
    handleEdit,
    pinjamans,
    refreshData,
    user,
  } = React.useContext(PengajuanContext);
  // State untuk menyimpan file yang sedang dilihat
  const [viewPdf, setViewPdf] = useState(null);

  const filterArsip = arsips?.filter((arsip) => arsip.kode_arsip == uuid);

  const handlePreview = (base64String) => {
    let pdfUrl = base64String.includes("data:application/pdf")
      ? base64String
      : `data:application/pdf;base64,${base64String}`;
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
  React.useEffect(() => {
    refreshData();
  }, []);
  return (
    <ArsipDigitalPetugas>
      <div className="dropdown">
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
          {isLoading ? (
            <div className="customers-list mb-3">
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
            </div>
          ) : (
            filterArsip?.map((arsip, index) => {
              const isPinjam = pinjamans?.filter(
                (pinjam) =>
                  pinjam.arsip_uuid == arsip.uuid &&
                  pinjam.user_uuid == user.uuid &&
                  !pinjam.telah_dikembalikan,
              );

              return (
                <ArchiveDigitalCard
                  role={role}
                  isPinjam={isPinjam}
                  index={index}
                  arsip={arsip}
                  handlePreview={handlePreview}
                  formatDate={formatDate}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              );
            })
          )}
        </div>
      </div>
    </ArsipDigitalPetugas>
  );
}
