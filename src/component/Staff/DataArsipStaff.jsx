import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePengajuan } from "../../context/PengajuanContext";

export default function DataArsipStaff() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addPengajuan } = usePengajuan();

  const tab = location.pathname.includes("ArsipDigitalStaff") ? "ArsipDigitalStaff" : "Arsip Fisik";

  const [formData, setFormData] = useState({
    namaPetugas: "",
    namaArsip: "",
    lemari: "",
    rak: "",
    nomor: "",
    tipeArsip: "",
    jenisArsip: "Surat",
    tujuan: "",
    gedung: "A",
    lantai: "1",
    ruang: "1",
    folder: "1"
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev,
      jenisArsip: value
    }));
  };

  const handleSubmit = () => {
    // Validasi form
    if (!formData.namaPetugas || !formData.namaArsip || !formData.tujuan) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    // Tambah pengajuan ke context
    addPengajuan({
      namaArsip: formData.namaArsip,
      namaPetugas: formData.namaPetugas,
      jenis: formData.jenisArsip,
      tipe: formData.tipeArsip,
      tujuan: formData.tujuan,
      lemari: formData.lemari,
      rak: formData.rak,
      nomor: formData.nomor,
      gedung: formData.gedung,
      lantai: formData.lantai,
      ruang: formData.ruang,
      folder: formData.folder
    });

    // Reset form
    setFormData({
      namaPetugas: "",
      namaArsip: "",
      lemari: "",
      rak: "",
      nomor: "",
      tipeArsip: "",
      jenisArsip: "Surat",
      tujuan: "",
      gedung: "A",
      lantai: "1",
      ruang: "1",
      folder: "1"
    });

    // Tutup modal form menggunakan Bootstrap
    const modalElement = document.getElementById('modalFisik');
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }

    // Hapus backdrop secara manual
    setTimeout(() => {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 100);

    // Tampilkan modal sukses
    setShowSuccessModal(true);
  };

  const handleSuccessOke = () => {
    // Tutup modal sukses
    setShowSuccessModal(false);

    // Hapus semua backdrop yang mungkin masih ada
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // Navigate ke log pengajuan
    navigate("/logPengajuanStaff");
  };

  // Cleanup saat component unmount
  useEffect(() => {
    return () => {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

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
      <div className="page-wrapper">
        <div className="page-content">
          <div className="d-flex align-items-center">
            <div className="search-bar flex-grow-1">
              <h4>Data Arsip</h4>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="search-bar flex-grow-1">
              <ul className="nav nav-pills mb-3" role="tablist">
                <li onClick={() => navigate("/dataArsipStaff")} className={`nav-item ${tab === "Arsip Fisik" ? "active" : ""}`} role="presentation" style={{ width: '50%', cursor: 'pointer' }}>
                  <div className="nav-link active" data-bs-toggle="pill" href="#primary-pills-home" role="tab" aria-selected="true">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="tab-title">Arsip Fisik</div>
                    </div>
                  </div>
                </li>
                <li onClick={() => navigate("/dataArsipStaff/ArsipDigitalStaff")} className={`nav-item ${tab === "ArsipDigitalStaff" ? "active" : ""}`} role="presentation" style={{ width: '50%', cursor: 'pointer' }}>
                  <div className="nav-link" data-bs-toggle="pill" href="#primary-pills-profile" role="tab" aria-selected="false">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="tab-title">Arsip Digital</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="user-box">
              <div className="col mb-3">
                <button type="button" className="btn-pengajuan px-5 pb-2 pt-2" data-bs-toggle="modal" data-bs-target="#modalFisik">Pengajuan Peminjaman</button>
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
            <div className="col">
              <div className="card">
                <div className="gambar d-flex justify-content-center">
                  <img src="assets/images/block.png" className="card-img-top" style={{ width: 104, height: 146, marginTop: 15 }} alt="..." />
                </div>
                <div className="card-body">
                  <h5 className="card-title">Gedung A - Utama</h5>
                  <p className="card-text">Arsip Administrasi dan Keuangan</p>
                </div>
                <ul className="list-group list-group-flush" style={{ borderTop: "none" }}>
                  <Link to="/dataArsipStaff/lantaiStaff" className="link">
                    <li className="list-group-item" style={{ border: 'none' }}>
                      <div className="col">
                        <div className="card radius-10 shadow-none">
                          <div className="card-body-arsip">
                            <div className="d-flex align-items-center">
                              <div>
                                <p className="mb-0 text-secondary">Lantai</p>
                                <h4 className="my-1">5</h4>
                              </div>
                              <div className="text ms-auto font-35"><img src="assets/images/building.png" alt className="logo-arsip" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </Link>
                  <Link to="/dataArsipStaff/ruangStaff" className="link">
                    <li className="list-group-item" style={{ border: 'none' }}>
                      <div className="col">
                        <div className="card radius-10 shadow-none">
                          <div className="card-body-arsip">
                            <div className="d-flex align-items-center">
                              <div>
                                <p className="mb-0 text-secondary">Ruang</p>
                                <h4 className="my-1">10</h4>
                              </div>
                              <div className="text ms-auto font-35"><img src="assets/images/building.png" alt className="logo-arsip" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </Link>
                  <Link to="/dataArsipStaff/detailFisikStaff" className="link">
                    <li className="list-group-item" style={{ border: 'none' }}>
                      <div className="col">
                        <div className="card radius-10 shadow-none">
                          <div className="card-body-arsip">
                            <div className="d-flex align-items-center">
                              <div>
                                <p className="mb-0 text-secondary">Arsip</p>
                                <h4 className="my-1">100</h4>
                              </div>
                              <div className="text ms-auto font-35"><img src="assets/images/file-archive.png" alt className="logo-arsip" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="gambar d-flex justify-content-center">
                  <img src="assets/images/block.png" className="card-img-top" style={{ width: 104, height: 146, marginTop: 15 }} alt="..." />
                </div>
                <div className="card-body">
                  <h5 className="card-title">Gedung B - Utama</h5>
                  <p className="card-text">Arsip Administrasi dan Keuangan</p>
                </div>
                <ul className="list-group list-group-flush" style={{ borderTop: "none" }}>
                  <li className="list-group-item" style={{ border: 'none' }}>
                    <div className="col">
                      <div className="card radius-10 shadow-none">
                        <div className="card-body-arsip">
                          <div className="d-flex align-items-center">
                            <div>
                              <p className="mb-0 text-secondary">Lantai</p>
                              <h4 className="my-1">5</h4>
                            </div>
                            <div className="text ms-auto font-35"><img src="assets/images/building.png" alt className="logo-arsip" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item" style={{ border: 'none' }}>
                    <div className="col">
                      <div className="card radius-10 shadow-none">
                        <div className="card-body-arsip">
                          <div className="d-flex align-items-center">
                            <div>
                              <p className="mb-0 text-secondary">Ruang</p>
                              <h4 className="my-1">10</h4>
                            </div>
                            <div className="text ms-auto font-35"><img src="assets/images/building.png" alt className="logo-arsip" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item" style={{ border: 'none' }}>
                    <div className="col">
                      <div className="card radius-10 shadow-none">
                        <div className="card-body-arsip">
                          <div className="d-flex align-items-center">
                            <div>
                              <p className="mb-0 text-secondary">Arsip</p>
                              <h4 className="my-1">100</h4>
                            </div>
                            <div className="text ms-auto font-35"><img src="assets/images/file-archive.png" alt className="logo-arsip" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="gambar d-flex justify-content-center">
                  <img src="assets/images/block.png" className="card-img-top" style={{ width: 104, height: 146, marginTop: 15 }} alt="..." />
                </div>
                <div className="card-body">
                  <h5 className="card-title">Gedung C - Utama</h5>
                  <p className="card-text">Arsip Administrasi dan Keuangan</p>
                </div>
                <ul className="list-group list-group-flush" style={{ borderTop: "none" }}>
                  <li className="list-group-item" style={{ border: 'none' }}>
                    <div className="col">
                      <div className="card radius-10 shadow-none">
                        <div className="card-body-arsip">
                          <div className="d-flex align-items-center">
                            <div>
                              <p className="mb-0 text-secondary">Lantai</p>
                              <h4 className="my-1">5</h4>
                            </div>
                            <div className="text ms-auto font-35"><img src="assets/images/building.png" alt className="logo-arsip" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item" style={{ border: 'none' }}>
                    <div className="col">
                      <div className="card radius-10 shadow-none">
                        <div className="card-body-arsip">
                          <div className="d-flex align-items-center">
                            <div>
                              <p className="mb-0 text-secondary">Ruang</p>
                              <h4 className="my-1">10</h4>
                            </div>
                            <div className="text ms-auto font-35"><img src="assets/images/building.png" alt className="logo-arsip" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item" style={{ border: 'none' }}>
                    <div className="col">
                      <div className="card radius-10 shadow-none">
                        <div className="card-body-arsip">
                          <div className="d-flex align-items-center">
                            <div>
                              <p className="mb-0 text-secondary">Arsip</p>
                              <h4 className="my-1">100</h4>
                            </div>
                            <div className="text ms-auto font-35"><img src="assets/images/file-archive.png" alt className="logo-arsip" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modal Tombol Pengajuan Fisik */}
          <div className="modal fade" id="modalFisik" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header" style={{ border: 'none' }}>
                  <h5 className="modal-title" style={{ paddingLeft: '15%' }}>Formulir Peminjaman Arsip Fisik</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body pt-0">
                  <img src="/assets/images/documents.png" style={{ width: 100, margin: 'auto', display: 'flex' }} />
                  <form>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Nama Petugas</label>
                      <select
                        className="form-select mb-3"
                        style={{ borderRadius: 30 }}
                        name="namaPetugas"
                        value={formData.namaPetugas}
                        onChange={handleInputChange}
                      >
                        <option value="">Nama Petugas</option>
                        <option value="Dafa Maulana">Dafa Maulana</option>
                        <option value="Anjani Rima">Anjani Rima</option>
                        <option value="Tono Hardani">Tono Hardani</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nama Arsip</label>
                      <select
                        className="form-select mb-3"
                        style={{ borderRadius: 30 }}
                        name="namaArsip"
                        value={formData.namaArsip}
                        onChange={handleInputChange}
                      >
                        <option value="">Nama Arsip</option>
                        <option value="PP Investasi">PP Investasi</option>
                        <option value="QC">QC</option>
                        <option value="Pedoman Audit">Pedoman Audit</option>
                        <option value="Aturan Pajak">Aturan Pajak</option>
                      </select>
                    </div>
                    <div className="line" style={{ display: 'flex' }}>
                      <div className="mb-3" style={{ width: '100%', marginRight: 10 }}>
                        <label className="form-label">Lemari</label>
                        <select
                          className="form-select"
                          style={{ borderRadius: 30 }}
                          name="lemari"
                          value={formData.lemari}
                          onChange={handleInputChange}
                        >
                          <option value=""></option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>
                      <div className="mb-3" style={{ width: '100%', marginRight: 10 }}>
                        <label className="form-label">Rak</label>
                        <select
                          className="form-select"
                          style={{ borderRadius: 30 }}
                          name="rak"
                          value={formData.rak}
                          onChange={handleInputChange}
                        >
                          <option value=""></option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>
                      <div className="mb-3" style={{ width: '100%' }}>
                        <label className="form-label">Nomor</label>
                        <select
                          className="form-select"
                          style={{ borderRadius: 30 }}
                          name="nomor"
                          value={formData.nomor}
                          onChange={handleInputChange}
                        >
                          <option value=""></option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3" style={{ width: '100%' }}>
                      <label className="form-label">Tipe Arsip</label>
                      <select
                        className="form-select"
                        style={{ borderRadius: 30 }}
                        name="tipeArsip"
                        value={formData.tipeArsip}
                        onChange={handleInputChange}
                      >
                        <option value=""></option>
                        <option value="Statis">Statis</option>
                        <option value="Dinamis">Dinamis</option>
                      </select>
                    </div>
                    <label className="form-label">Jenis Arsip</label>
                    <div className="line-check" style={{ display: 'flex' }}>
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="jenisArsip"
                          checked={formData.jenisArsip === "Surat"}
                          onChange={() => handleCheckboxChange("Surat")}
                        />
                        <label className="form-check-label">Surat</label>
                      </div>
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="jenisArsip"
                          checked={formData.jenisArsip === "Laporan"}
                          onChange={() => handleCheckboxChange("Laporan")}
                        />
                        <label className="form-check-label">Laporan</label>
                      </div>
                      <div className="form-check" style={{ marginRight: 10 }}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="jenisArsip"
                          checked={formData.jenisArsip === "File"}
                          onChange={() => handleCheckboxChange("File")}
                        />
                        <label className="form-check-label">File</label>
                      </div>
                    </div>
                    <label className="form-label">Jenis Arsip otomatis muncul setelah memilih arsip</label>
                    <div>
                      <label className="form-label">Pilih Tujuan</label>
                      <select
                        className="form-select"
                        style={{ borderRadius: 30 }}
                        name="tujuan"
                        value={formData.tujuan}
                        onChange={handleInputChange}
                      >
                        <option value="">Pilih Tujuan</option>
                        <option value="Rapat">Rapat</option>
                        <option value="Audit">Audit</option>
                        <option value="Print">Print</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer" style={{ border: 'none' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    style={{ width: '100%', borderRadius: 30 }}
                  >
                    Ajukan Peminjaman
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Berhasil Ajukan Fisik - Menggunakan React State */}
        {showSuccessModal && (
          <div
            className="modal fade show"
            style={{
              display: 'block',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 9999
            }}
            tabIndex={-1}
            onClick={(e) => {
              // Tutup modal jika klik di luar modal content
              if (e.target.classList.contains('modal')) {
                handleSuccessOke();
              }
            }}
          >
            <div className="modal-dialog modal-cols-lg-2">
              <div className="modal-content">
                <div className="modal-header" style={{ borderBottom: 'none' }}>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleSuccessOke}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <h5 className="modal-title" style={{ marginBottom: 15 }}>Peminjaman Arsip Fisik Berhasil</h5>
                  <img src="assets/images/checkmark.png" alt="Success" />
                  <h6 className="modal-isi" style={{ marginBottom: 0, marginTop: 15, textAlign: 'center' }}>
                    Pengajuan peminjaman arsip fisik telah berhasil. Harap menunggu persetujuan.
                  </h6>
                </div>
                <div className="modal-footer" style={{ borderTop: 'none' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSuccessOke}
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
  );
}