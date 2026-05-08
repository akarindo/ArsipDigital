import React from "react";

const ArchiveFisicalCard = ({
  arsip,
  formatDate,
  filterGedung = [],
  filterLantai = [],
  filterRuang = [],
  filterLemari = [],
  filterRak = [],
  filterFolder = [],
  handleEdit,
  role,
  handleDelete,
}) => {
  return (
    <div
      className="customers-list-item shadow cursor-pointer rounded bg-white"
      style={{ marginBottom: 15 }}
    >
      {/* Header: Icon & Badges */}
      <div className="top d-flex align-items-center justify-content-between p-3">
        <div className="kiri">
          <img
            src="/assets/images/iconpdf.png"
            width={60}
            height={60}
            alt="pdf-icon"
          />
        </div>
        <div className="kanan d-flex gap-2">
          <div
            className="d-flex align-items-center border px-2 radius-10 text-white"
            style={{ height: 35, backgroundColor: "#46D657" }}
          >
            <span className="mb-0">Tersedia</span>
          </div>
        </div>
      </div>

      {/* Judul */}
      <h6 className="ms-3 mb-0 fw-bold">{arsip.judul_arsip}</h6>

      {/* Detail Info */}
      <div className="d-flex justify-content-between p-3 pb-4 py-2">
        <div className="info-kiri">
          <div className="mb-1">
            <span className="fw-bold">Jenis Arsip</span> :{" "}
            <span className="text-secondary">{arsip.jenis_arsip}</span>
          </div>
          <div className="mb-1">
            <span className="fw-bold">Kategori</span> :{" "}
            <span className="text-secondary">{arsip.kategori_arsip}</span>
          </div>
          <div>
            <span className="fw-bold">Tipe</span> :{" "}
            <span className="text-secondary">{arsip.tipe_arsip}</span>
          </div>
        </div>
        <div className="info-kanan">
          <div className="mb-1">
            <span className="fw-bold">Keterangan</span> :{" "}
            <span className="text-secondary">{arsip.keterangan ?? "-"}</span>
          </div>
          <div>
            <span className="fw-bold">Waktu Upload</span> :{" "}
            {formatDate(arsip.created_at)}
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center p-3 pt-0">
        <img
          src="/assets/images/pin.png"
          width={15}
          height={15}
          className="me-2"
          alt="pin"
        />
        {[
          filterGedung[0]?.name,
          filterLantai[0]?.name,
          filterRuang[0]?.name,
          filterLemari[0]?.name,
          filterRak[0]?.name,
          filterFolder[0]?.name,
        ].map((location, index, array) => (
          <React.Fragment key={index}>
            <p className="mb-0 small me-1">{location}</p>
            {index < array.length - 1 && (
              <img
                src="/assets/images/Vector.png"
                width={5}
                height={10}
                className="me-1"
                alt="arrow"
              />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Action Buttons: Edit & Hapus */}
      {role == "staff umum" && (
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
};

export default ArchiveFisicalCard;
