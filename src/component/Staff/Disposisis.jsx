import { Link, useParams } from "react-router-dom";
import React from "react";
import { PengajuanContext } from "../../context/PengajuanContext";
import DataArsip from "../Petugas/DataArsip";

export default function DisposisiSurat() {
  // const { uuid } = useParams();
  const { arsips, handleEdit, handleDelete, role, users, token } =
    React.useContext(PengajuanContext);
  const filterStaff = users?.filter((user) => user.role == "staff");
  const [param, setParam] = React.useState("fisik");
  const [arsip, setArsip] = React.useState(null);

  const arsipFisik = arsips?.filter(
    (arsip) => arsip.file == null && arsip.kategori_arsip == "surat",
  );
  const arsipDigital = arsips?.filter(
    (arsip) => arsip.file != null && arsip.kategori_arsip == "surat",
  );
  const filterArsip = param == "fisik" ? arsipFisik : arsipDigital;
  const [surat, setSurat] = React.useState({
    arsip_uuid: arsip?.uuid,
    user_id: "",
    tindak_lanjut: "",
    skala_prioritas: "",
    intruksi: "",
    batas_waktu: "",
    catatan: "",
  });
  async function handleDisposisi(e) {
    e.preventDefault();
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/disposisi`;

      const method = "POST";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(surat),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login Gagal");
      }
      refreshData();
      const modalElement = document.getElementById("tambahGedungMaster");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    } catch (error) {
      console.error("Login Gagal:", error.message);
    }

    setSurat({
      arsip_uuid: arsip?.uuid,
      user_id: "",
      tindak_lanjut: "",
      skala_prioritas: "",
      intruksi: "",
      batas_waktu: "",
      catatan: "",
    });

    // Tutup modal form menggunakan Bootstrap
    const modalElement = document.getElementById("modalFisik");
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }

    // Hapus backdrop secara manual
    setTimeout(() => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }, 100);
  }
  console.log("users", users);

  return (
    <DataArsip>
      <div className="dropdown">
        {" "}
        <a
          href="#"
          className="btn btn-white btn-sm my-3 mt-0 p-2 pe-0"
          data-bs-toggle="dropdown"
          data-display="static"
        >
          Semua Arsip
          <i className="bx bxs-chevron-down ms-5" />
        </a>
        <div className="customers-list mb-3">
          {filterArsip?.map((arsip) => (
            <div
              className="customers-list-item shadow cursor-pointer bg-white"
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
                  {/* <div
                    className="d-flex align-items-center border px-2 radius-10 text-white"
                    style={{ height: 35, backgroundColor: "#386CFF" }}
                  >
                    <span className="me-2 mb-0">Lihat</span>
                    <img
                      src="/assets/images/eye.png"
                      width={15}
                      height={10}
                      alt="eye"
                    />
                  </div>

                  <div
                    className="d-flex align-items-center border px-2 radius-10 text-white"
                    style={{ height: 35, backgroundColor: "#386CFF" }}
                  >
                    <span className="me-2 mb-0">Unduh</span>
                    <img
                      src="/assets/images/download.png"
                      width={15}
                      height={15}
                      alt="download"
                    />
                  </div> */}

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
              <div className="d-flex justify-content-between p-3 py-2">
                <div className="info-kiri">
                  <div className="mb-1">
                    <span className="fw-bold">Jenis Arsip</span> :{" "}
                    <span className="text-secondary">{arsip.jenis_arsip}</span>
                  </div>
                  <div className="mb-1">
                    <span className="fw-bold">Kategori</span> :{" "}
                    <span className="text-secondary">
                      {arsip.kategori_arsip}
                    </span>
                  </div>
                  <div>
                    <span className="fw-bold">Tipe</span> :{" "}
                    <span className="text-secondary">{arsip.tipe_arsip}</span>
                  </div>
                </div>
                <div className="info-kanan">
                  <div className="mb-1">
                    <span className="fw-bold">Keterangan</span> :{" "}
                    <span className="text-secondary">File QC</span>
                  </div>
                  <div>
                    <span className="fw-bold">Waktu Upload</span> :{" "}
                    <span className="text-secondary">
                      17 Maret 2025 | 09:58
                    </span>
                  </div>
                </div>
              </div>
              {role == "pimpinan" && (
                <div className="p-4">
                  <button
                    className="w-100 btn btn-info"
                    onClick={() => {
                      setSurat({ ...surat, arsip_uuid: arsip.uuid });
                      setArsip(arsip);
                    }}
                    style={{
                      background: "#0d6efd",
                      color: "white",
                      borderRadius: "30px",
                      padding: "10px 0px",
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modalDisposisi"
                  >
                    Disposisi
                  </button>
                </div>
              )}
              {/* Action Buttons: Edit & Hapus */}
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
          ))}

          <nav
            aria-label="Page navigation example"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <ul className="pagination">
              <li className="page-item">
                <a
                  className="page-link"
                  href="javascript:;"
                  aria-label="Previous"
                >
                  {" "}
                  <span aria-hidden="true">«</span>
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="javascript:;">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="javascript:;">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="javascript:;">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="javascript:;" aria-label="Next">
                  {" "}
                  <span aria-hidden="true">»</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div
        className="modal fade"
        id="modalDisposisi"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header" style={{ border: "none" }}>
              <h5 className="modal-title">Formulir Disposisi Surat</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <img src="assets/images/documents.png" />
              <form onSubmit={handleDisposisi}>
                <h4>Informasi Umum</h4>
                <p>Nama Surat: {arsip?.judul_arsip}</p>
                <p>Jenis Surat: {arsip?.jenis_arsip}</p>
                <hr />
                <h4>Data Disposisi</h4>
                <input
                  type="hidden"
                  name="arsip_uuid"
                  value={surat.arsip_uuid}
                />
                <div className="mb-3">
                  <label className="form-label">Tujuan Disposisi</label>
                  <select
                    className="form-select mb-3"
                    style={{ borderRadius: 30 }}
                    name="user_id"
                    value={surat.user_id}
                    onChange={(e) =>
                      setSurat({ ...surat, user_id: e.target.value })
                    }
                  >
                    <option value="">Pilih Staff</option>
                    {filterStaff?.map((staff) => (
                      <option value={staff.uuid}>{staff.name}</option>
                    ))}
                  </select>
                </div>
                <label className="form-label mt-6">Jenis tindak lanjut</label>
                <div className="line-check mb-6" style={{ display: "flex" }}>
                  <div className="form-check" style={{ marginRight: 10 }}>
                    <input
                      name="tindak_lanjut"
                      value={"ditindaklanjuti"}
                      //   onChange={handleCheckboxChangeArsip}
                      onChange={(e) =>
                        setSurat({ ...surat, tindak_lanjut: e.target.value })
                      }
                      className="form-check-input"
                      type="checkbox"
                      defaultValue
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Untuk Ditindaklanjuti
                    </label>
                  </div>
                  <div className="form-check" style={{ marginRight: 10 }}>
                    <input
                      name="tindak_lanjut"
                      value={"diketahui"}
                      onChange={(e) =>
                        setSurat({ ...surat, tindak_lanjut: e.target.value })
                      }
                      //   onChange={handleCheckboxChangeArsip}
                      className="form-check-input"
                      type="checkbox"
                      defaultValue
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Untuk diketahui
                    </label>
                  </div>
                  <div className="form-check" style={{ marginRight: 10 }}>
                    <input
                      name="tindak_lanjut"
                      value={"laporan"}
                      onChange={(e) =>
                        setSurat({ ...surat, tindak_lanjut: e.target.value })
                      }
                      className="form-check-input"
                      type="checkbox"
                      defaultValue
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Untuk Laporan
                    </label>
                  </div>
                  <div className="form-check" style={{ marginRight: 10 }}>
                    <input
                      name="tindak_lanjut"
                      value={"dipelajari"}
                      onChange={(e) =>
                        setSurat({ ...surat, tindak_lanjut: e.target.value })
                      }
                      className="form-check-input"
                      type="checkbox"
                      defaultValue
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Untuk Dipelajari
                    </label>
                  </div>
                </div>
                <label htmlFor="" className="mt-2">
                  Prioritas
                </label>
                <div className="d-flex gap-4 mb-2">
                  <div className="mb-3">
                    <input
                      type="radio"
                      id="html"
                      name="skala_prioritas"
                      value="Biasa"
                      onChange={(e) =>
                        setSurat({ ...surat, skala_prioritas: e.target.value })
                      }
                    />
                    <label for="html">Biasa</label>
                  </div>
                  <div className="mb-3">
                    <input
                      type="radio"
                      id="css"
                      name="skala_prioritas"
                      value="Segera"
                      onChange={(e) =>
                        setSurat({ ...surat, skala_prioritas: e.target.value })
                      }
                    />
                    <label for="css">Segera</label>
                  </div>
                  <div className="mb-3">
                    <input
                      type="radio"
                      id="javascript"
                      name="skala_prioritas"
                      value="Rahasia"
                      onChange={(e) =>
                        setSurat({ ...surat, skala_prioritas: e.target.value })
                      }
                    />
                    <label for="javascript">Rahasia</label>
                  </div>
                </div>
                <div class="input-group mb-3">
                  <input
                    type="text"
                    value={surat.intruksi}
                    // onChange={(e) => handleInputChangeArsip(e)}
                    onChange={(e) =>
                      setSurat({ ...surat, intruksi: e.target.value })
                    }
                    class="form-control"
                    name="intruksi"
                    placeholder="Ketik Intruksi"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">
                    Batas Waktu
                  </span>
                  <input
                    type="date"
                    // value={formDataArsip.judul_arsip}
                    onChange={(e) =>
                      setSurat({ ...surat, batas_waktu: e.target.value })
                    }
                    // placeholder="Pilih Tanggal dan Jam"
                    class="form-control"
                    name="batas_waktu"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">
                    Catatan Tambahan
                  </span>
                  <input
                    type="text"
                    // value={formDataArsip.judul_arsip}
                    // onChange={(e) => handleInputChangeArsip(e)}
                    onChange={(e) =>
                      setSurat({ ...surat, catatan: e.target.value })
                    }
                    placeholder="Opsional"
                    class="form-control"
                    name="catatan"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
                {/* <div className="mb-3">
                  <label className="form-label">Nama Arsip</label>
                  <select
                    name="name_uuid"
                    onChange={(e) => handleInputChangeArsip(e)}
                    value={formDataArsip.name_uuid}
                    className="form-select mb-3 radius-30"
                    aria-label="Default select example"
                  >
                    <option selected>Pilih Arsip</option>
                    {names?.map((name) => (
                      <option key={name.uuid} value={name.uuid}>
                        {name.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">
                    Judul Arsip
                  </span>
                  <input
                    type="text"
                    value={formDataArsip.judul_arsip}
                    onChange={(e) => handleInputChangeArsip(e)}
                    class="form-control"
                    name="judul_arsip"
                    placeholder="Judul Arsip"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tipe Arsip</label>
                  <select
                    name="tipe_arsip"
                    value={formDataArsip.tipe_arsip}
                    className="form-select mb-3 radius-30"
                    onChange={(e) => {
                      handleType(e.target.value);
                      handleInputChangeArsip(e);
                    }}
                  >
                    <option value="">Pilih Tipe Arsip</option>
                    {jenisArsip?.map((arsip) => (
                      <option key={arsip.type} value={arsip.type}>
                        {arsip.name}
                      </option>
                    ))}
                  </select>
                </div>
                {type === "dinamis" && (
                  <>
                    <label className="form-label mt-6">
                      Jenis Arsip (Khusus Dinamis)
                    </label>
                    <div
                      className="line-check mb-6"
                      style={{ display: "flex" }}
                    >
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="jenis_arsip"
                          value={"vital"}
                          onChange={handleCheckboxChangeArsip}
                          className="form-check-input"
                          type="checkbox"
                          id="vital"
                        />
                        <label className="form-check-label" htmlFor="vital">
                          Vital
                        </label>
                      </div>
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="jenis_arsip"
                          value={"active"}
                          onChange={handleCheckboxChangeArsip}
                          className="form-check-input"
                          type="checkbox"
                          id="active"
                        />
                        <label className="form-check-label" htmlFor="active">
                          Active
                        </label>
                      </div>
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          name="jenis_arsip"
                          value={"inactive"}
                          onChange={handleCheckboxChangeArsip}
                          className="form-check-input"
                          type="checkbox"
                          id="inactive"
                        />
                        <label className="form-check-label" htmlFor="inactive">
                          Inactive
                        </label>
                      </div>
                    </div>
                  </>
                )}
                <label className="form-label mt-6">Kategori Arsip</label>
                <div className="line-check mb-6" style={{ display: "flex" }}>
                  <div className="form-check" style={{ marginRight: 10 }}>
                    <input
                      name="kategori_arsip"
                      value={"surat"}
                      onChange={handleCheckboxChangeArsip}
                      className="form-check-input"
                      type="checkbox"
                      defaultValue
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Surat
                    </label>
                  </div>
                  <div className="form-check" style={{ marginRight: 10 }}>
                    <input
                      name="kategori_arsip"
                      value={"laporan"}
                      onChange={handleCheckboxChangeArsip}
                      className="form-check-input"
                      type="checkbox"
                      defaultValue
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Laporan
                    </label>
                  </div>
                  <div className="form-check" style={{ marginRight: 10 }}>
                    <input
                      name="kategori_arsip"
                      value={"file"}
                      onChange={handleCheckboxChangeArsip}
                      className="form-check-input"
                      type="checkbox"
                      defaultValue
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      File
                    </label>
                  </div>
                </div>
                <div className="line" style={{ display: "flex" }}>
                  <div className="mb-3">
                    <label className="form-label">Gedung</label>
                    <select
                      name="gedung_uuid"
                      value={formDataArsip.gedung_uuid}
                      onChange={(e) => {
                        handleChangeBuild(e.target.value);
                        handleInputChangeArsip(e);
                      }}
                      className="form-select mb-3 radius-30"
                      aria-label="Default select example"
                    >
                      <option selected>Pilih Gedung</option>
                      {gedungs?.map((gedung) => (
                        <option key={gedung.uuid} value={gedung.uuid}>
                          {gedung.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Lantai</label>
                    <select
                      name="lantai_uuid"
                      value={formDataArsip.lantai_uuid}
                      onChange={(e) => {
                        handleChangeFloor(e.target.value);
                        handleInputChangeArsip(e);
                      }}
                      className="form-select mb-3 radius-30"
                      aria-label="Default select example"
                    >
                      <option selected>Pilih Lantai</option>
                      {floorBuild?.map((floor) => (
                        <option key={floor.uuid} value={floor.uuid}>
                          {floor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ruang</label>
                    <select
                      value={formDataArsip.ruang_uuid}
                      name="ruang_uuid"
                      onChange={(e) => {
                        handleChangeRoom(e.target.value);
                        handleInputChangeArsip(e);
                      }}
                      className="form-select mb-3 radius-30"
                      aria-label="Default select example"
                    >
                      <option selected>Pilih Ruang</option>
                      {roomBuild?.map((room) => (
                        <option key={room.uuid} value={room.uuid}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="line" style={{ display: "flex" }}>
                  <div className="mb-3">
                    <label className="form-label">Lemari</label>
                    <select
                      value={formDataArsip.lemari_uuid}
                      name="lemari_uuid"
                      onChange={(e) => {
                        handleChangeCabinet(e.target.value);
                        handleInputChangeArsip(e);
                      }}
                      className="form-select mb-3 radius-30"
                      aria-label="Default select example"
                    >
                      <option selected>Pilih Lemari</option>
                      {cabinetBuild?.map((cabinet) => (
                        <option key={cabinet.uuid} value={cabinet.uuid}>
                          {cabinet.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rak</label>
                    <select
                      name="rak_uuid"
                      value={formDataArsip.rak_uuid}
                      onChange={(e) => {
                        handleChangeShelf(e.target.value);
                        handleInputChangeArsip(e);
                      }}
                      className="form-select mb-3 radius-30"
                      aria-label="Default select example"
                    >
                      <option selected>Pilih Rak</option>
                      {shelfBuild?.map((shelf) => (
                        <option key={shelf.uuid} value={shelf.uuid}>
                          {shelf.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Folder</label>
                    <select
                      name="folder_uuid"
                      value={formDataArsip.folder_uuid}
                      onChange={(e) => handleInputChangeArsip(e)}
                      className="form-select mb-3 radius-30"
                      aria-label="Default select example"
                    >
                      <option selected>Pilih Folder</option>
                      {folderBuild?.map((folder) => (
                        <option key={folder.uuid} value={folder.uuid}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Keterangan</label>
                  <input
                    name="keterangan"
                    onChange={(e) => handleInputChangeArsip(e)}
                    value={formDataArsip.keterangan}
                    type="text"
                    className="form-control radius-30"
                  />
                </div> */}
                <div className="p-3 pt-0">
                  <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                    <div className="w-50">
                      <button
                        type="button"
                        className="btn btn-outline-primary radius-30"
                        style={{ width: "100%" }}
                      >
                        Batal
                      </button>
                    </div>
                    <div className="w-50">
                      <button
                        type="submit"
                        className="btn btn-primary radius-30"
                        style={{ width: "100%" }}
                        data-bs-toggle="modal"
                        data-bs-target="#berhasilTambahFisik"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DataArsip>
  );
}
