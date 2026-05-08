import React from "react";

const ArchiveDigitalCard = ({
  role,
  isPinjam,
  arsip,
  handlePreview,
  index,
  formatDate,
  handleDelete,
  handleEdit,
}) => {
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
            <span className="text-secondary">{arsip.jenis_arsip}</span>
          </div>
          <div>
            <span className="fw-bold">Kategori</span> :{" "}
            <span className="text-secondary">{arsip.kategori_arsip}</span>
          </div>
        </div>
        <div>
          <div className="mb-1">
            <span className="fw-bold">Tipe</span> :{" "}
            <span className="text-secondary">{arsip.tipe_arsip}</span>
          </div>
          <div>
            <span className="fw-bold">Waktu Upload</span> :{" "}
            <span className="text-secondary">
              {formatDate(arsip.created_at)}
            </span>
          </div>
        </div>
      </div>
      {role == "staff umum" && (
        <div className="d-flex p-3 pt-0 gap-3">
          <button
            onClick={() => handleEdit(arsip)}
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#modaltambahDigital"
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
};

export default ArchiveDigitalCard;
