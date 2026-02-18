import { useEffect, useState } from "react";
import { usePengajuan } from "../context/PengajuanContext";
import SkeletonItem from "./SkeletonItem";
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [late, setLate] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft("Waktu Habis");
        setLate(true);
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
export default function ApprovalFisik({
  filterPinjaman,
  isLoading,
  handleApprove,
  handleTolak,
  formatDate,
  handleGetArsip,
  tujuans,
}) {
  if (isLoading) {
    return (
      <div className="customers-list mb-3">
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
      </div>
    );
  }

  // JIKA DATA KOSONG (SUDAH DILOAD TAPI MEMANG TIDAK ADA ISI)
  if (!isLoading && filterPinjaman.length === 0) {
    return (
      <div className="text-center p-5 bg-white rounded shadow-sm">
        <img src="/assets/images/empty-box.png" width={100} alt="Kosong" />
        <p className="mt-3 text-secondary">
          Tidak ada pengajuan untuk saat ini.
        </p>
      </div>
    );
  }
  return (
    <div className="customers-list mb-3">
      {/* <div className="customers-list-item cursor-pointer bg-white" style={{ marginBottom: 15 }}>
        <div className="top d-flex align-items-center justify-content-between p-3">
          <div className="kiri" style={{ alignItems: 'center' }}>
            <div className="d-flex align-items-center">
              <img src="/assets/images/iconpdf.png" width={60} height={60} alt />
              <h6 className="ms-3 mb-0">PP Investasi</h6>
            </div>
          </div>
          <div className="kanan" style={{ display: 'flex' }}>
            <div className="d-flex align-items-center border p-2 radius-10" style={{ marginRight: 10, background: '#46D657', height: 35 }}>
              <div className>
                <p className="mb-0" style={{ color: 'white' }}>Disetujui</p>
              </div>
            </div>
            <div className="d-flex align-items-center border p-2 radius-10" style={{ marginRight: 10, height: 35 }}>
              <div className>
                <p className="mb-0">Sedang Dipinjam</p>
              </div>
            </div>
            <div className="d-flex align-items-center border p-2 radius-10" style={{ marginRight: 10, height: 35 }}>
              <div className="kanan d-flex align-items-center">
                <div className style={{ marginRight: 10 }}>
                  <p className="mb-0">4 jam : 24 menit : 30 detik</p>
                </div>
                <div className>
                  <img src="/assets/images/clock.png" width={15} height={15} alt />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex  justify-content-between pt-0 pb-1 p-3">
          <div>
            <div>
              <h7 className="mb-1 font-weight-bold">Jenis</h7> : <h7 className="mb-0 text-secondary">File</h7>
            </div>
            <div>
              <h7 className="mb-1 font-weight-bold">Tipe</h7> : <h7 className="mb-0 text-secondary">Statis</h7>
            </div>
            <div>
              <h7 className="mb-1 font-weight-bold">Tujuan</h7> : <h7 className="mb-0 text-secondary">Print</h7>
            </div>
            <div>
              <h7 className="mb-1 font-weight-bold">Petugas</h7> : <h7 className="mb-0 text-secondary">Dafa Maulana</h7>
            </div>
            <div>
              <h7 className="mb-1 font-weight-bold">Peminjam</h7> : <h7 className="mb-0 text-secondary">Citra</h7>
            </div>
          </div>
          <div>
            <div>
              <h7 className="mb-1 font-weight-bold">Waktu Pengajuan</h7> : <h7 className="mb-0 text-secondary">1 Desember 2025 <br />| 07:00:00 wib</h7>
            </div>
            <div>
              <h7 className="mb-1 font-weight-bold">Waktu Diterima</h7> : <h7 className="mb-0 text-secondary">1 November 2025 <br />| 10:30:00 wib</h7>
            </div>
          </div>
          <div>
            <div>
              <h7 className="mb-1 font-weight-bold">Batas Peminjaman</h7> : <h7 className="mb-0 text-secondary">1 Desember <br />2025 | 18:30:00 wib</h7>
            </div>
            <div>
              <h7 className="mb-1 font-weight-bold">Waktu Pengembalian</h7> : <h7 className="mb-0 text-secondary">...</h7>
            </div>
          </div>
        </div>
        <div className="d-flex mt-1">
          <div className="p-3 pt-0 pe-1">
            <img src="/assets/images/pin.png" width={15} height={15} alt />
          </div>
          <div>
            <p className="me-1">Gedung A</p>
          </div>
          <div>
            <img src="/assets/images/Vector.png" style={{ marginRight: 5 }} width={5} height={10} alt />
          </div>
          <div>
            <p className="me-1">Lantai 1</p>
          </div>
          <div>
            <img src="/assets/images/Vector.png" style={{ marginRight: 5 }} width={5} height={10} alt />
          </div>
          <div>
            <p className="me-1">Ruang 1</p>
          </div>
          <div>
            <img src="/assets/images/Vector.png" style={{ marginRight: 5 }} width={5} height={10} alt />
          </div>
          <div>
            <p className="me-1">Lemari 1</p>
          </div>
          <div>
            <img src="/assets/images/Vector.png" style={{ marginRight: 5 }} width={5} height={10} alt />
          </div>
          <div>
            <p className="me-1">Folder 1</p>
          </div>
          <div>
            <img src="/assets/images/Vector.png" style={{ marginRight: 5 }} width={5} height={10} alt />
          </div>
          <div>
            <p>Nomor 1</p>
          </div>
        </div>
      </div> */}
      {filterPinjaman?.map((pinjam) => {
        const filterTujuan = tujuans?.filter(
          (tujuan) => tujuan.uuid == pinjam.tujuan_uuid,
        );
        return (
          <div
            key={pinjam.uuid}
            className="customers-list-item cursor-pointer rounded bg-white"
            style={{ marginBottom: 15 }}
          >
            <div className="top d-flex align-items-center justify-content-between p-3">
              <div className="kiri" style={{ alignItems: "center" }}>
                <div className="d-flex align-items-center">
                  <img
                    src="/assets/images/iconpdf.png"
                    width={60}
                    height={60}
                    alt
                  />
                  <h6 className="ms-3 mb-0">{pinjam?.arsip?.judul_arsip}</h6>
                </div>
              </div>
              <div className="kanan" style={{ display: "flex" }}>
                {pinjam?.status == "pending" && (
                  <div
                    className="d-flex align-items-center border p-2 radius-10"
                    style={{
                      marginRight: 10,
                      background: "#c0963b",
                      height: 35,
                    }}
                  >
                    <div>
                      <p className="mb-0" style={{ color: "white" }}>
                        Menunggu Persetujuan
                      </p>
                    </div>
                  </div>
                )}
                {pinjam?.status == "dikembalikan" && (
                  <div
                    className="d-flex align-items-center border p-2 radius-10"
                    style={{
                      marginRight: 10,
                      background: "#1d1c1a",
                      height: 35,
                    }}
                  >
                    <div>
                      <p className="mb-0" style={{ color: "white" }}>
                        {pinjam.status}
                      </p>
                    </div>
                  </div>
                )}
                {pinjam?.alasan_telat && (
                  <div
                    className="d-flex align-items-center border p-2 radius-10"
                    style={{
                      marginRight: 10,
                      background: "#c22020",
                      height: 35,
                    }}
                  >
                    <div>
                      <p className="mb-0" style={{ color: "white" }}>
                        {pinjam.alasan_telat}
                      </p>
                    </div>
                  </div>
                )}
                {pinjam.status == "reject" && (
                  <div
                    className="d-flex align-items-center bg-danger border p-2 radius-10"
                    style={{ marginRight: 10, height: 35 }}
                  >
                    <div className>
                      <p className="mb-0 text-white">
                        {pinjam.status} | {pinjam.alasan_penolakan}
                      </p>
                    </div>
                  </div>
                )}
                {pinjam?.status == "approve" && pinjam?.telah_diterima ? (
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
                            targetDate={pinjam?.waktu_kembalikan}
                          />
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div className="d-flex justify-content-between pt-0 pb-4 p-3">
              <div>
                <div>
                  <h7 className="mb-1 font-weight-bold">Jenis</h7> :{" "}
                  <h7 className="mb-0 text-secondary">
                    {pinjam?.arsip?.jenis_arsip}
                  </h7>
                </div>
                <div>
                  <h7 className="mb-1 font-weight-bold">Tipe</h7> :{" "}
                  <h7 className="mb-0 text-secondary">
                    {pinjam?.arsip?.tipe_arsip}
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
                  <h7 className="mb-1 font-weight-bold">Waktu Pengajuan</h7> :{" "}
                  <h7 className="mb-0 text-secondary">
                    {formatDate(pinjam.created_at)}
                  </h7>
                </div>
                <div>
                  <h7 className="mb-1 font-weight-bold">Waktu Diterima</h7> :{" "}
                  <h7 className="mb-0 text-secondary">
                    {formatDate(pinjam.waktu_diterima) || "..."}
                  </h7>
                </div>
              </div>
              <div>
                <div>
                  <h7 className="mb-1 font-weight-bold">Batas Peminjaman</h7> :{" "}
                  <h7 className="mb-0 text-secondary">
                    {formatDate(pinjam.waktu_kembalikan) || "..."}
                  </h7>
                </div>
                <div>
                  <h7 className="mb-1 font-weight-bold">Waktu Pengembalian</h7>{" "}
                  :{" "}
                  <h7 className="mb-0 text-secondary">
                    {formatDate(pinjam.telah_dikembalikan) || "..."}
                  </h7>
                </div>
                {pinjam.alasan && (
                  <div>
                    <h7 className="mb-1 font-weight-bold">Alasan</h7> :{" "}
                    <h7 className="mb-0 text-secondary">{pinjam.alasan}</h7>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="d-flex mt-1">
              <div className="p-3 pt-0 pe-1">
                <img src="/assets/images/pin.png" width={15} height={15} alt />
              </div>
              <div>
                <p className="me-1">Gedung A</p>
              </div>
              <div>
                <img
                  src="/assets/images/Vector.png"
                  style={{ marginRight: 5 }}
                  width={5}
                  height={10}
                  alt
                />
              </div>
              <div>
                <p className="me-1">Lantai 1</p>
              </div>
              <div>
                <img
                  src="/assets/images/Vector.png"
                  style={{ marginRight: 5 }}
                  width={5}
                  height={10}
                  alt
                />
              </div>
              <div>
                <p className="me-1">Ruang 1</p>
              </div>
              <div>
                <img
                  src="/assets/images/Vector.png"
                  style={{ marginRight: 5 }}
                  width={5}
                  height={10}
                  alt
                />
              </div>
              <div>
                <p className="me-1">Lemari 1</p>
              </div>
              <div>
                <img
                  src="/assets/images/Vector.png"
                  style={{ marginRight: 5 }}
                  width={5}
                  height={10}
                  alt
                />
              </div>
              <div>
                <p className="me-1">Folder 1</p>
              </div>
              <div>
                <img
                  src="/assets/images/Vector.png"
                  style={{ marginRight: 5 }}
                  width={5}
                  height={10}
                  alt
                />
              </div>
              <div>
                <p>Nomor 1</p>
              </div>
            </div> */}
            <div className="d-flex gap-4 justify-content-center p-3 pb-0 pt-0">
              {pinjam?.status == "pending" && (
                <>
                  <div className="mb-3 w-50">
                    <button
                      onClick={() => handleApprove(pinjam)}
                      type="button"
                      className="btn btn-success px-5 radius-30 w-100"
                      data-bs-toggle="modal"
                      data-bs-target="#notifikasiKembali"
                    >
                      Approve
                    </button>
                  </div>
                  <div className="mb-3 w-50">
                    <button
                      type="button"
                      className="btn btn-danger px-5 radius-30 w-100"
                      data-bs-toggle="modal"
                      onClick={() => handleTolak(pinjam)}
                      // data-bs-target="#notifikasiKembali"
                    >
                      Tolak
                    </button>
                  </div>
                </>
              )}
              {pinjam?.status == "approve" && !pinjam?.telah_diterima ? (
                <div className="mb-3 w-100">
                  <button
                    onClick={() => handleGetArsip(pinjam)}
                    type="button"
                    className="btn btn-success px-5 radius-30 w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#notifikasiKembali"
                  >
                    Arsip Telah Diambil
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
      <nav
        aria-label="Page navigation example"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" href="javascript:;" aria-label="Previous">
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

      {/* Modal Notifikasi Pengembalian*/}
      <div className="col">
        <div
          className="modal fade"
          id="notifikasiKembali"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: "none" }}>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
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
                  Notifikasi Pengembalian
                </h5>
                <img src="/assets/images/bell icon.png" />
                <h6
                  className="modal-isi"
                  style={{ marginBottom: 0, marginTop: 15 }}
                >
                  Notifikasi pengembalian kepada peminjam telah berhasil
                  terkirim.
                </h6>
              </div>
              <div className="modal-footer" style={{ borderTop: "none" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "100%", borderRadius: 50 }}
                >
                  Oke
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
