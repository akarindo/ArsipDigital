import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { usePengajuan } from "../../context/PengajuanContext";
import Navigation from "../Navigation";
import AdminLayout from "../layouts/AdminLayout";
import SkeletonItem from "../SkeletonItem";
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState("");
  // const [late, setLate] = useState(false);
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft("Waktu Habis");
        // setLate(true);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Format agar selalu dua digit (00:00:00)
      const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

      setTimeLeft(formatted);
    };

    // Jalankan pertama kali
    calculateTime();

    // Update setiap detik
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span>{timeLeft}</span>;
};
export default function LogPengajuanStaff() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    pengajuanList,
    updatePengajuan,
    pinjamans,
    tujuans,
    gedungs,
    token,
    isLoading,
    floors,
    rooms,
    cabinets,
    shelves,
    folders,
  } = usePengajuan();
  const tab = location.pathname.includes("PengajuanDigitalStaff")
    ? "PengajuanDigitalStaff"
    : "Arsip Fisik";
  const [showKembaliModal, setShowKembaliModal] = useState(false);
  const [showBerhasilKembaliModal, setShowBerhasilKembaliModal] =
    useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [alasanTerlambat, setAlasanTerlambat] = useState("");
  const [showLateModal, setShowLateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [alasanTelat, setAlasanTelat] = useState("");
  const [param, setParam] = useState("fisik");
  const handleKembalikan = (pengajuan) => {
    setSelectedPengajuan(pengajuan);
    setShowKembaliModal(true);
  };
  const fisik = pinjamans?.filter(
    (pinjaman) =>
      pinjaman.status != "dikembalikan" && pinjaman?.arsip?.file == null,
  );
  const fisikHistory = pinjamans?.filter(
    (pinjaman) => pinjaman?.arsip?.file == null,
  );
  const digital = pinjamans?.filter(
    (pinjaman) =>
      pinjaman.status != "dikembalikan" && pinjaman?.arsip?.file != null,
  );
  const digitalHistory = pinjamans?.filter(
    (pinjaman) => pinjaman?.arsip?.file != null,
  );
  const filterPengajuan =
    param == "fisik" && location.pathname == "/logPengajuanStaff"
      ? fisik
      : digital;
  const filterHistory =
    param == "fisik" && location.pathname == "/logHistoryStaff"
      ? fisikHistory
      : digitalHistory;
  const filterPinjaman =
    location.pathname == "/logHistoryStaff" ? filterHistory : filterPengajuan;
  const handleSubmitKembali = async (item, alasan = null) => {
    const sekarang = new Date();
    const deadline = new Date(item.waktu_kembalikan);

    // VALIDASI: Jika telat dan belum ada alasan, tampilkan modal
    if (sekarang > deadline && !alasan) {
      setSelectedItem(item); // Simpan item untuk diproses nanti
      setShowLateModal(true); // Munculkan modal alasan
      return; // Berhenti di sini, jangan fetch dulu
    }

    // Jika tidak telat ATAU alasan sudah diisi, lanjut kirim ke API
    const dataToSend = {
      user_uuid: item.user_uuid,
      arsip_uuid: item.arsip_uuid,
      tujuan_uuid: item.tujuan_uuid,
      status: "dikembalikan",
      response_at: sekarang.toISOString(),
      telah_dikembalikan: sekarang.toISOString(),
      alasan_telat: alasan, // Kirim alasan ke backend jika ada
    };

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/peminjamans/${item.uuid}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Gagal mengembalikan");

      setShowLateModal(false);
      setAlasanTelat("");
      setSelectedItem(null);
    } catch (error) {
      console.error("Gagal:", error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Disetujui":
        return "#46D657";
      case "Belum Dikembalikan":
        return "#F83434";
      case "Menunggu Persetujuan":
        return "#F8A634";
      case "Dikembalikan":
        return "#3468F8";
      default:
        return "#6c757d";
    }
  };

  const getStatusIcon = (status, subStatus) => {
    if (status === "Disetujui") return "assets/images/clock.png";
    if (status === "Belum Dikembalikan") return "assets/images/alert.png";
    if (status === "Dikembalikan") {
      return subStatus === "Telah Dikembalikan Tepat Waktu"
        ? "assets/images/check.png"
        : "assets/images/message-warning.png";
    }
    return null;
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

  return (
    <AdminLayout>
      <div className="page-wrapper" style={{ height: "500%" }}>
        <div className="page-content">
          <div className="d-flex align-items-center">
            <div
              className="search-bar flex-grow-1 d-flex align-items-center"
              style={{ marginBottom: 10 }}
            >
              <h4 style={{ marginBottom: 0 }}>
                Log{" "}
                {location.pathname == "/logHistoryStaff"
                  ? "History"
                  : "Pengajuan"}
              </h4>
            </div>
          </div>
          <div className="d-flex align-items-center mb-3">
            <div className="search-bar flex-grow-1">
              <ul className="nav nav-pills mb-3" role="tablist">
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
                  className={`nav-item ${tab === "PengajuanDigitalStaff" ? "active" : ""}`}
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
          {/* <div className="dropdown bg-white my-3" style={{ height: 38 }}>
            <div className="d-flex justify-content-between">
              <a
                href="#"
                className="btn btn-white btn-sm my-3 mt-0 p-2 pe-0"
                style={{ border: "none" }}
                data-bs-toggle="dropdown"
                data-display="static"
              >
                Tipe
                <i className="bx bxs-chevron-down ms-5" />
              </a>
              <a
                href="#"
                className="btn btn-white btn-sm my-3 mt-0 p-2 pe-0"
                style={{ border: "none" }}
                data-bs-toggle="dropdown"
                data-display="static"
              >
                Kategori
                <i className="bx bxs-chevron-down ms-5" />
              </a>
              <a
                href="#"
                className="btn btn-white btn-sm my-3 mt-0 p-2 pe-0"
                style={{ border: "none" }}
                data-bs-toggle="dropdown"
                data-display="static"
              >
                Status
                <i className="bx bxs-chevron-down ms-5" />
              </a>
            </div>
          </div> */}

          <div className="customers-list mb-3">
            {isLoading ? (
              <div className="customers-list mb-3">
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
              </div>
            ) : filterPinjaman.length === 0 ? (
              <div className="text-center py-5 bg-white">
                <p className="text-secondary">Belum ada pengajuan peminjaman</p>
              </div>
            ) : (
              filterPinjaman?.map((item) => {
                const filterTujuan = tujuans?.filter(
                  (tujuan) => tujuan.uuid == item.tujuan_uuid,
                );
                const filterGedung = gedungs?.filter(
                  (gedung) => gedung.uuid == item?.arsip?.gedung_uuid,
                );
                const filterLantai = floors?.filter(
                  (floor) => floor.uuid == item?.arsip?.lantai_uuid,
                );
                const filterRuang = rooms?.filter(
                  (room) => room.uuid == item?.arsip?.ruang_uuid,
                );
                const filterLemari = cabinets?.filter(
                  (cabinet) => cabinet.uuid == item?.arsip?.lemari_uuid,
                );
                const filterRak = shelves?.filter(
                  (shelf) => shelf.uuid == item?.arsip?.rak_uuid,
                );
                const filterFolder = folders?.filter(
                  (folder) => folder.uuid == item?.arsip?.folder_uuid,
                );
                return (
                  <div
                    key={item.id}
                    className="customers-list-item rounded border shadow cursor-pointer bg-white"
                    style={{ marginBottom: 15 }}
                  >
                    <div className="top d-flex align-items-center justify-content-between p-3">
                      <div className="kiri" style={{ alignItems: "center" }}>
                        <div className="d-flex align-items-center">
                          <img
                            src="assets/images/iconpdf.png"
                            width={60}
                            height={60}
                            alt
                          />
                          <h6 className="ms-3 mb-0">
                            {item?.arsip?.judul_arsip}
                          </h6>
                        </div>
                      </div>
                      <div className="kanan" style={{ display: "flex" }}>
                        {item.status == "approve" && !item.telah_diterima ? (
                          <>
                            <div
                              className="d-flex align-items-center bg-success border p-2 radius-10"
                              style={{ marginRight: 10, height: 35 }}
                            >
                              <div className>
                                <p className="mb-0 text-white">{item.status}</p>
                              </div>
                            </div>
                            <div
                              className="d-flex align-items-center bg-info border p-2 radius-10"
                              style={{ marginRight: 10, height: 35 }}
                            >
                              <div className>
                                <p className="mb-0 text-white">Belum Diambil</p>
                              </div>
                            </div>
                          </>
                        ) : null}
                        {item.status == "dikembalikan" && (
                          <div
                            className="d-flex align-items-center bg-info border p-2 radius-10"
                            style={{ marginRight: 10, height: 35 }}
                          >
                            <div className>
                              <p className="mb-0 text-white">{item.status}</p>
                            </div>
                          </div>
                        )}
                        {item.status == "reject" && (
                          <div
                            className="d-flex align-items-center bg-danger border p-2 radius-10"
                            style={{ marginRight: 10, height: 35 }}
                          >
                            <div className>
                              <p className="mb-0 text-white">
                                {item.status} | {item.alasan_penolakan}
                              </p>
                            </div>
                          </div>
                        )}
                        {item.status == "pending" && (
                          <div
                            className="d-flex align-items-center bg-info border p-2 radius-10"
                            style={{ marginRight: 10, height: 35 }}
                          >
                            <div className>
                              <p className="mb-0 text-white">{item.status}</p>
                            </div>
                          </div>
                        )}
                        {item?.status == "approve" &&
                        item?.telah_diterima &&
                        !item.telah_dikembalikan ? (
                          <>
                            <div
                              className="d-flex align-items-center border p-2 radius-10"
                              style={{
                                marginRight: 10,
                                background: "#78e46e",
                                height: 35,
                              }}
                            >
                              <div>
                                <p className="mb-0" style={{ color: "white" }}>
                                  Disetujui
                                </p>
                              </div>
                            </div>
                            <div
                              className="d-flex align-items-center border p-2 radius-10"
                              style={{ marginRight: 10, height: 35 }}
                            >
                              <div>
                                <p className="mb-0">Sedang Dipinjam</p>
                              </div>
                            </div>
                            <div
                              className="d-flex align-items-center border p-2 radius-10"
                              style={{ marginRight: 10, height: 35 }}
                            >
                              <div>
                                {/* Panggil komponen countdown di sini */}
                                <p className="mb-0">
                                  <CountdownTimer
                                    targetDate={item?.waktu_kembalikan}
                                  />
                                </p>
                              </div>
                            </div>
                          </>
                        ) : null}
                        {item.subStatus && (
                          <div
                            className="d-flex align-items-center border p-2 radius-10"
                            style={{ marginRight: 10, height: 35 }}
                          >
                            <div className>
                              <p className="mb-0">{item.subStatus}</p>
                            </div>
                          </div>
                        )}
                        {item.sisaWaktu && (
                          <div
                            className="d-flex align-items-center border p-2 radius-10"
                            style={{ marginRight: 10, height: 35 }}
                          >
                            <div className="kanan d-flex align-items-center">
                              <div className style={{ marginRight: 10 }}>
                                <p className="mb-0">{item.sisaWaktu}</p>
                              </div>
                              {getStatusIcon(item.status, item.subStatus) && (
                                <div className>
                                  <img
                                    src={getStatusIcon(
                                      item.status,
                                      item.subStatus,
                                    )}
                                    width={15}
                                    height={15}
                                    alt
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between pt-0 pb-4 p-3">
                      <div>
                        <div>
                          <h7 className="mb-1 font-weight-bold">Jenis</h7> :{" "}
                          <h7 className="mb-0 text-secondary">
                            {item?.arsip?.jenis_arsip}
                          </h7>
                        </div>
                        <div>
                          <h7 className="mb-1 font-weight-bold">Tipe</h7> :{" "}
                          <h7 className="mb-0 text-secondary">
                            {item?.arsip?.tipe_arsip}
                          </h7>
                        </div>
                        <div>
                          <h7 className="mb-1 font-weight-bold">Tujuan</h7> :{" "}
                          <h7 className="mb-0 text-secondary">
                            {filterTujuan[0]?.tujuan}
                          </h7>
                        </div>
                      </div>
                      <div>
                        <div>
                          <h7 className="mb-1 font-weight-bold">
                            Waktu Pengajuan
                          </h7>{" "}
                          :{" "}
                          <h7 className="mb-0 text-secondary">
                            {formatDate(item.created_at)}
                          </h7>
                        </div>
                        <div>
                          <h7 className="mb-1 font-weight-bold">
                            Waktu Diterima
                          </h7>{" "}
                          :{" "}
                          <h7 className="mb-0 text-secondary">
                            {formatDate(item.waktu_diterima) || "..."}
                          </h7>
                        </div>
                      </div>
                      <div>
                        <div>
                          <h7 className="mb-1 font-weight-bold">
                            Batas Peminjaman
                          </h7>{" "}
                          :{" "}
                          <h7 className="mb-0 text-secondary">
                            {formatDate(item.waktu_kembalikan) || "..."}
                          </h7>
                        </div>
                        <div>
                          <h7 className="mb-1 font-weight-bold">
                            Waktu Pengembalian
                          </h7>{" "}
                          :{" "}
                          <h7 className="mb-0 text-secondary">
                            {formatDate(item.telah_dikembalikan) || "..."}
                          </h7>
                        </div>
                        {item.alasan && (
                          <div>
                            <h7 className="mb-1 font-weight-bold">Alasan</h7> :{" "}
                            <h7 className="mb-0 text-secondary">
                              {item.alasan}
                            </h7>
                          </div>
                        )}
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

                    {/* Action Buttons */}
                    {item.status === "approve" &&
                    item.telah_diterima != null ? (
                      <div className="d-flex justify-content-between p-3 pb-0 pt-0">
                        <div className="mb-3 w-100">
                          <button
                            type="button"
                            className="btn-arsip px-5 pb-2 pt-2"
                            onClick={() => handleSubmitKembali(item)}
                            style={{ width: "100%" }}
                          >
                            Kembalikan Arsip
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {item.status === "Belum Dikembalikan" ? (
                      <div className="d-flex justify-content-center p-3 pb-0 pt-0">
                        <div className="mb-3 w-100">
                          <button
                            type="button"
                            className="btn-kembali px-5 pb-2 pt-2"
                            onClick={() => handleKembalikan(item)}
                            style={{ width: "100%" }}
                          >
                            Kembalikan Arsip
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}

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
                  <a
                    className="page-link"
                    href="javascript:;"
                    aria-label="Next"
                  >
                    <span aria-hidden="true">»</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Modal Pengembalian Fisik */}
          {showKembaliModal && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
              tabIndex={-1}
            >
              <div className="modal-dialog modal-sm-2">
                <div className="modal-content">
                  <div
                    className="modal-header"
                    style={{ borderBottom: "none" }}
                  >
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowKembaliModal(false)}
                    />
                  </div>
                  <div
                    className="modal-body"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <h5 className="modal-title" style={{ marginBottom: 15 }}>
                      Pengembalian Arsip Fisik
                    </h5>
                    <img src="assets/images/fileIcon.png" alt="File Icon" />
                    <span
                      className="modal-isi"
                      style={{
                        marginBottom: 0,
                        marginTop: 15,
                        textAlign: "center",
                      }}
                    >
                      Anda telah melebihi waktu peminjaman. Segera kembalikan
                      arsip fisik yang anda pinjam pada petugas kami!
                    </span>
                  </div>
                  <div className="mb-3 p-3">
                    <label className="form-label">Alasan Terlambat</label>
                    <input
                      type="text"
                      className="form-control radius-30"
                      placeholder="Tuliskan alasan terlambat melakukan pengembalian"
                      value={alasanTerlambat}
                      onChange={(e) => setAlasanTerlambat(e.target.value)}
                    />
                  </div>
                  <div className="modal-footer" style={{ borderTop: "none" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmitKembali}
                      style={{ width: "100%", borderRadius: 50 }}
                    >
                      Kembalikan Arsip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Berhasil Kembali Fisik */}
          {showBerhasilKembaliModal && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
              tabIndex={-1}
            >
              <div className="modal-dialog modal-sm">
                <div className="modal-content">
                  <div
                    className="modal-header"
                    style={{ borderBottom: "none" }}
                  >
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowBerhasilKembaliModal(false)}
                    />
                  </div>
                  <div
                    className="modal-body"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <h5 className="modal-title" style={{ marginBottom: 15 }}>
                      Pengembalian Arsip Fisik
                    </h5>
                    <img src="assets/images/checkmark.png" alt="Success" />
                    <span
                      className="modal-isi"
                      style={{
                        marginBottom: 0,
                        marginTop: 15,
                        textAlign: "center",
                      }}
                    >
                      Pengembalian arsip fisik telah berhasil dan telah diterima
                      oleh petugas kami.
                    </span>
                  </div>
                  <div className="modal-footer" style={{ borderTop: "none" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setShowBerhasilKembaliModal(false)}
                      style={{ width: "100%", borderRadius: 50 }}
                    >
                      Oke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal Alasan Terlambat */}
      {showLateModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  Peringatan: Pengembalian Terlambat!
                </h5>
              </div>
              <div className="modal-body">
                <p>
                  Waktu pengembalian telah melewati batas. Harap masukkan alasan
                  keterlambatan:
                </p>
                <textarea
                  className="form-control"
                  rows="3"
                  value={alasanTelat}
                  onChange={(e) => setAlasanTelat(e.target.value)}
                  placeholder="Contoh: Masih digunakan untuk audit..."
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLateModal(false)}
                >
                  Batal
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!alasanTelat.trim()} // Tombol mati jika alasan kosong
                  onClick={() => handleSubmitKembali(selectedItem, alasanTelat)}
                >
                  Kirim & Kembalikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
