import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { usePengajuan } from "../../context/PengajuanContext";

export default function LogPengajuanStaff() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pengajuanList, updatePengajuan } = usePengajuan();

  const tab = location.pathname.includes("PengajuanDigitalStaff") ? "PengajuanDigitalStaff" : "Arsip Fisik";

  const [showKembaliModal, setShowKembaliModal] = useState(false);
  const [showBerhasilKembaliModal, setShowBerhasilKembaliModal] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [alasanTerlambat, setAlasanTerlambat] = useState("");

  const handleKembalikan = (pengajuan) => {
    setSelectedPengajuan(pengajuan);
    setShowKembaliModal(true);
  };

  const handleSubmitKembali = () => {
    if (selectedPengajuan) {
      updatePengajuan(selectedPengajuan.id, {
        status: "Dikembalikan",
        subStatus: alasanTerlambat ? "Telah Dikembalikan Melebihi Deadline" : "Telah Dikembalikan Tepat Waktu",
        waktuPengembalian: new Date().toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(',', '|') + ' wib',
        alasan: alasanTerlambat || null
      });
    }

    setShowKembaliModal(false);
    setShowBerhasilKembaliModal(true);
    setAlasanTerlambat("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Disetujui": return "#46D657";
      case "Belum Dikembalikan": return "#F83434";
      case "Menunggu Persetujuan": return "#F8A634";
      case "Dikembalikan": return "#3468F8";
      default: return "#6c757d";
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

  return (
    <div className="wrapper">
      {/*sidebar wrapper */}
      <div className="sidebar-wrapper" data-simplebar="true">
        <div className="sidebar-header" style={{ border: 'none', justifyContent: 'center' }}>
          <div className>
            <h4 className="logo-text" style={{ fontWeight: 600, fontSize: 20, marginLeft: 0 }}>Arsip Digital Bank</h4>
          </div>
        </div>
        {/*navigation*/}
        <ul className="metismenu p-3" id="menu">
          <h6 className="ms-3 mb-3">MAIN MENU</h6>
          <li>
            <Link to="/dashboardStaff" className="link">
              <div className="parent-icon">
                <img src="/assets/images/house.png" alt="Dashboard" />
              </div>
              <div className="menu-title">Dashboard</div>
            </Link>
          </li>
          <li>
            <Link to="/dataArsipStaff" className="link">
              <div className="parent-icon">
                <img src="/assets/images/clipboard-list.png" alt="Data Arsip" />
              </div>
              <div className="menu-title">Data Arsip</div>
            </Link>
          </li>
          <li>
            <Link to="/logPengajuanStaff" className="link">
              <div className="parent-icon">
                <img src="/assets/images/clipboard-list.png" alt="Log Pengajuan" />
              </div>
              <div className="menu-title">Log Pengajuan</div>
            </Link>
          </li>
          <li>
            <Link to="/logHistoryStaff" className="link">
              <div className="parent-icon">
                <img src="/assets/images/history.png" alt="Log History" />
              </div>
              <div className="menu-title">Log History</div>
            </Link>
          </li>
        </ul>
        {/*end navigation*/}
      </div>
      {/*end sidebar wrapper */}
      {/*start header */}
      <header>
        <div className="topbar d-flex align-items-center">
          <nav className="navbar navbar-expand">
            <div className="mobile-toggle-menu"><i className="bx bx-menu" />
            </div>
            <div className="search-bar flex-grow-1">
              <h4 className="mb-0">Selamat Datang</h4>
            </div>
            <div className="top-menu ms-auto">
              <ul className="navbar-nav align-items-center">
                <li className="nav-item dropdown dropdown-large">
                  <img src="assets/images/bell-dot.png" width="25px" height="25px" alt />
                </li>
              </ul>
            </div>
            <div className="user-box" style={{ border: 'none' }}>
              <div className="col">
                <button type="button" className="btn-avatar p-3 pt-1 pb-1">
                  <img src="assets/images/Avatar.png" alt style={{ marginRight: 10 }} />
                  Pegawai
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      {/*end header */}
      {/*start page wrapper */}
      <div className="page-wrapper" style={{ height: '500%' }}>
        <div className="page-content">
          <div className="d-flex align-items-center">
            <div className="search-bar flex-grow-1 d-flex align-items-center" style={{ marginBottom: 10 }}>
              <h4 style={{ marginBottom: 0 }}>Log Pengajuan</h4>
            </div>
          </div>
          <div className="d-flex align-items-center mb-3">
            <div className="search-bar flex-grow-1">
              <ul className="nav nav-pills mb-3" role="tablist">
                <li onClick={() => navigate("/LogPengajuanStaff")} className={`nav-item ${tab === "Arsip Fisik" ? "active" : ""}`} role="presentation" style={{ width: '50%', cursor: 'pointer' }}>
                  <div className="nav-link active" data-bs-toggle="pill" href="#primary-pills-home" role="tab" aria-selected="true">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="tab-title">Arsip Fisik</div>
                    </div>
                  </div>
                </li>
                <li onClick={() => navigate("/LogPengajuanStaff/PengajuanDigitalStaff")} className={`nav-item ${tab === "PengajuanDigitalStaff" ? "active" : ""}`} role="presentation" style={{ width: '50%', cursor: 'pointer' }}>
                  <div className="nav-link" data-bs-toggle="pill" href="#primary-pills-profile" role="tab" aria-selected="false">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="tab-title">Arsip Digital</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="dropdown bg-white my-3" style={{ height: 38 }}>
            <div className="d-flex justify-content-between">
              <a href="#" className="btn btn-white btn-sm my-3 mt-0 p-2 pe-0" style={{ border: 'none' }} data-bs-toggle="dropdown" data-display="static">Tipe<i className="bx bxs-chevron-down ms-5" /></a>
              <a href="#" className="btn btn-white btn-sm my-3 mt-0 p-2 pe-0" style={{ border: 'none' }} data-bs-toggle="dropdown" data-display="static">Kategori<i className="bx bxs-chevron-down ms-5" /></a>
              <a href="#" className="btn btn-white btn-sm my-3 mt-0 p-2 pe-0" style={{ border: 'none' }} data-bs-toggle="dropdown" data-display="static">Status<i className="bx bxs-chevron-down ms-5" /></a>
            </div>
          </div>

          <div className="customers-list mb-3">
            {pengajuanList.length === 0 ? (
              <div className="text-center py-5 bg-white">
                <p className="text-secondary">Belum ada pengajuan peminjaman</p>
              </div>
            ) : (
              pengajuanList.map((item) => (
                <div key={item.id} className="customers-list-item cursor-pointer bg-white" style={{ marginBottom: 15 }}>
                  <div className="top d-flex align-items-center justify-content-between p-3">
                    <div className="kiri" style={{ alignItems: 'center' }}>
                      <div className="d-flex align-items-center">
                        <img src="assets/images/iconpdf.png" width={60} height={60} alt />
                        <h6 className="ms-3 mb-0">{item.namaArsip}</h6>
                      </div>
                    </div>
                    <div className="kanan" style={{ display: 'flex' }}>
                      <div className="d-flex align-items-center border p-2 radius-10" style={{ marginRight: 10, background: getStatusColor(item.status), height: 35 }}>
                        <div className>
                          <p className="mb-0" style={{ color: 'white' }}>{item.status}</p>
                        </div>
                      </div>
                      {item.subStatus && (
                        <div className="d-flex align-items-center border p-2 radius-10" style={{ marginRight: 10, height: 35 }}>
                          <div className>
                            <p className="mb-0">{item.subStatus}</p>
                          </div>
                        </div>
                      )}
                      {item.sisaWaktu && (
                        <div className="d-flex align-items-center border p-2 radius-10" style={{ marginRight: 10, height: 35 }}>
                          <div className="kanan d-flex align-items-center">
                            <div className style={{ marginRight: 10 }}>
                              <p className="mb-0">{item.sisaWaktu}</p>
                            </div>
                            {getStatusIcon(item.status, item.subStatus) && (
                              <div className>
                                <img src={getStatusIcon(item.status, item.subStatus)} width={15} height={15} alt />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between pt-0 pb-1 p-3">
                    <div>
                      <div>
                        <h7 className="mb-1 font-weight-bold">Jenis</h7> : <h7 className="mb-0 text-secondary">{item.jenis}</h7>
                      </div>
                      <div>
                        <h7 className="mb-1 font-weight-bold">Tipe</h7> : <h7 className="mb-0 text-secondary">{item.tipe}</h7>
                      </div>
                      <div>
                        <h7 className="mb-1 font-weight-bold">Tujuan</h7> : <h7 className="mb-0 text-secondary">{item.tujuan}</h7>
                      </div>
                      <div>
                        <h7 className="mb-1 font-weight-bold">Petugas</h7> : <h7 className="mb-0 text-secondary">{item.namaPetugas}</h7>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h7 className="mb-1 font-weight-bold">Waktu Pengajuan</h7> : <h7 className="mb-0 text-secondary">{item.waktuPengajuan}</h7>
                      </div>
                      <div>
                        <h7 className="mb-1 font-weight-bold">Waktu Diterima</h7> : <h7 className="mb-0 text-secondary">{item.waktuDiterima || '...'}</h7>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h7 className="mb-1 font-weight-bold">Batas Peminjaman</h7> : <h7 className="mb-0 text-secondary">{item.batasPeminjaman || '...'}</h7>
                      </div>
                      <div>
                        <h7 className="mb-1 font-weight-bold">Waktu Pengembalian</h7> : <h7 className="mb-0 text-secondary">{item.waktuPengembalian || '...'}</h7>
                      </div>
                      {item.alasan && (
                        <div>
                          <h7 className="mb-1 font-weight-bold">Alasan</h7> : <h7 className="mb-0 text-secondary">{item.alasan}</h7>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex mt-1">
                    <div className="p-3 pt-0 pe-1">
                      <img src="assets/images/pin.png" width={15} height={15} alt />
                    </div>
                    <div>
                      <p className="me-1">Gedung {item.gedung}</p>
                    </div>
                    <div>
                      <img src="assets/images/Vector.png" style={{ marginRight: 5 }} width={5} height={10} alt />
                    </div>
                    <div>
                      <p className="me-1">Lantai {item.lantai}</p>
                    </div>
                    <div>
                      <img src="assets/images/Vector.png" style={{ marginRight: 5 }} width={5} height={10} alt />
                    </div>
                    <div>
                      <p className="me-1">Ruang {item.ruang}</p>
                    </div>
                    <div>
                      <img src="assets/images/Vector.png" style={{ marginRight: 5 }} width={5} height={10} alt />
                    </div>
                    <div>
                      <p className="me-1">Lemari {item.lemari}</p>
                    </div>
                    <div>
                      <img src="assets/images/Vector.png" style={{ marginRight: 5 }} width={5} height={10} alt />
                    </div>
                    <div>
                      <p className="me-1">Folder {item.folder}</p>
                    </div>
                    <div>
                      <img src="assets/images/Vector.png" style={{ marginRight: 5 }} width={5} height={10} alt />
                    </div>
                    <div>
                      <p>Nomor {item.nomor}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {item.status === "Disetujui" && item.subStatus === "Sedang Dipinjam" && (
                    <div className="d-flex justify-content-between p-3 pb-0 pt-0">
                      <div className="mb-3 me-3 w-50">
                        <button type="button" className="btn-arsip px-5 pb-2 pt-2" style={{ width: '100%' }}>Lihat Arsip</button>
                      </div>
                      <div className="mb-3 me-3 w-50">
                        <button type="button" className="btn-arsip px-5 pb-2 pt-2" style={{ width: '100%' }}>Download Arsip</button>
                      </div>
                      <div className="mb-3 w-50">
                        <button
                          type="button"
                          className="btn-arsip px-5 pb-2 pt-2"
                          onClick={() => handleKembalikan(item)}
                          style={{ width: '100%' }}
                        >
                          Kembalikan Arsip
                        </button>
                      </div>
                    </div>
                  )}

                  {item.status === "Belum Dikembalikan" && (
                    <div className="d-flex justify-content-center p-3 pb-0 pt-0">
                      <div className="mb-3 w-100">
                        <button
                          type="button"
                          className="btn-kembali px-5 pb-2 pt-2"
                          onClick={() => handleKembalikan(item)}
                          style={{ width: '100%' }}
                        >
                          Kembalikan Arsip
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            <nav aria-label="Page navigation example" style={{ display: 'flex', justifyContent: 'center' }}>
              <ul className="pagination">
                <li className="page-item">
                  <a className="page-link" href="javascript:;" aria-label="Previous"><span aria-hidden="true">«</span></a>
                </li>
                <li className="page-item"><a className="page-link" href="javascript:;">1</a></li>
                <li className="page-item"><a className="page-link" href="javascript:;">2</a></li>
                <li className="page-item"><a className="page-link" href="javascript:;">3</a></li>
                <li className="page-item">
                  <a className="page-link" href="javascript:;" aria-label="Next"><span aria-hidden="true">»</span></a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Modal Pengembalian Fisik */}
          {showKembaliModal && (
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
              <div className="modal-dialog modal-sm-2">
                <div className="modal-content">
                  <div className="modal-header" style={{ borderBottom: 'none' }}>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowKembaliModal(false)}
                    />
                  </div>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <h5 className="modal-title" style={{ marginBottom: 15 }}>Pengembalian Arsip Fisik</h5>
                    <img src="assets/images/fileIcon.png" alt="File Icon" />
                    <span className="modal-isi" style={{ marginBottom: 0, marginTop: 15, textAlign: 'center' }}>
                      Anda telah melebihi waktu peminjaman. Segera kembalikan arsip fisik yang anda pinjam pada petugas kami!
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
                  <div className="modal-footer" style={{ borderTop: 'none' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmitKembali}
                      style={{ width: '100%', borderRadius: 50 }}
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
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
              <div className="modal-dialog modal-sm">
                <div className="modal-content">
                  <div className="modal-header" style={{ borderBottom: 'none' }}>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowBerhasilKembaliModal(false)}
                    />
                  </div>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <h5 className="modal-title" style={{ marginBottom: 15 }}>Pengembalian Arsip Fisik</h5>
                    <img src="assets/images/checkmark.png" alt="Success" />
                    <span className="modal-isi" style={{ marginBottom: 0, marginTop: 15, textAlign: 'center' }}>
                      Pengembalian arsip fisik telah berhasil dan telah diterima oleh petugas kami.
                    </span>
                  </div>
                  <div className="modal-footer" style={{ borderTop: 'none' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setShowBerhasilKembaliModal(false)}
                      style={{ width: '100%', borderRadius: 50 }}
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
    </div>
  );
}