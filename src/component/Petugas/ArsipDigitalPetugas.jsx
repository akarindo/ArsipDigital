import { Link, useNavigate, useLocation } from "react-router-dom";

export default function ArsipDigitalPetugas() {
    const navigate = useNavigate();
    const location = useLocation();

    const tab = location.pathname.includes("ArsipDigitalPetugas") ? "ArsipDigitalPetugas" : "Arsip Fisik";

  return (

<div className="wrapper">
  {/*sidebar wrapper */}
  <div className="sidebar-wrapper" data-simplebar="true">
    <div className="sidebar-header" style={{border: 'none', justifyContent: 'center'}}>
      <div className>
        <h4 className="logo-text" style={{fontWeight: 600, fontSize: 20, marginLeft: 0}}>Arsip Digital Bank</h4>
      </div>
    </div>
    {/*navigation*/}
   <ul className="metismenu p-3" id="menu">
      <h6 className="ms-3 mb-3">MAIN MENU</h6>
          <li>
            <Link to="/dashboardPetugas" className="link">
              <div className="parent-icon">
                <img src="/assets/images/house.png" alt="Dashboard" />
              </div>
              <div className="menu-title">Dashboard</div>
            </Link>
          </li>
          <li>
            <Link to="/dataUserPetugas" className="link">
              <div className="parent-icon">
                <img src="/assets/images/house.png" alt="Dashboard" />
              </div>
              <div className="menu-title">Data User</div>
            </Link>
          </li>
          <li>
            <Link to="/dataArsipPetugas" className="link">
              <div className="parent-icon">
                <img src="/assets/images/clipboard-list.png" alt="Data Arsip Petugas" />
              </div>
              <div className="menu-title">Data Arsip</div>
            </Link>
          </li>
          <li>
            <Link to="/dataMaster" className="link">
              <div className="parent-icon">
                <img src="/assets/images/clipboard-list.png" alt="Data Master" />
              </div>
              <div className="menu-title">Data Master</div>
            </Link>
          </li>
          <li>
            <Link to="/approvalPetugas" className="link">
              <div className="parent-icon">
                <img src="/assets/images/history.png" alt="Approval" />
              </div>
              <div className="menu-title">Approval</div>
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
              <div className="nav-link position-relative" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="assets/images/bell-dot.png" width="25px" height="25px" alt />
              </div>
            </li>
          </ul>
        </div>
        <div className="user-box" style={{border: 'none'}}>
          <div className="col">
            <button type="button" className="btn btn-primary px-5 pe-3 ps-3 radius-30">
              <img src="assets/images/Avatar.png" alt style={{marginRight: 10}} />
              Petugas
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
            <li onClick={() => navigate("/dataArsipPetugas")} className={`nav-item ${tab === "Arsip Fisik" ? "active" : ""}`} role="presentation" style={{width: '50%', cursor: 'pointer'}}>
              <div className="nav-link" data-bs-toggle="pill" href="#primary-pills-home" role="tab" aria-selected="false">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="tab-title">Arsip Fisik</div>
                </div>
              </div>
            </li>
            <li onClick={() => navigate("/dataArsipPetugas/ArsipDigitalPetugas")} className={`nav-item ${tab === "ArsipDigitalPetugas" ? "active" : ""}`} role="presentation" style={{width: '50%', cursor: 'pointer'}}>
              <div className="nav-link active" data-bs-toggle="pill" href="#primary-pills-profile" role="tab" aria-selected="true">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="tab-title">Arsip Digital</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="user-box">
          <div className="col mb-3">
            <button type="button" className="btn-tambah px-5" data-bs-toggle="modal" data-bs-target="#modaltambahDigital">Tambah</button>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
        <div className="col mb-4">
          <div className="card">
            <div className="gambar d-flex justify-content-center">
              <img src="assets/images/Frame 139.png" className="card-img-top" style={{width: 170, height: 138, marginTop: 15}} alt="..." />
            </div>
            <div className="card-body">
              <h5 className="card-title">Bank Indonesia</h5>
            </div>
            <ul className="list-group list-group-flush" style={{borderTop: "none"}}>
              <li className="list-group-item" style={{border: 'none'}}>
                <div className="col">
                  <div className="card radius-10 shadow-none">
                    <div className="card-body-arsip">
                      <div className="d-flex align-items-center">
                        <div>
                          <p className="mb-0 text-secondary">Arsip</p>
                          <h4 className="my-1">100</h4>
                        </div>
                        <div className="text ms-auto font-35"><img src="assets/images/file-archive.png" alt className="logo-arsip"/>
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
              <img src="assets/images/Frame 139.png" className="card-img-top" style={{width: 170, height: 138, marginTop: 15}} alt="..." />
            </div>
            <div className="card-body">
              <h5 className="card-title">OJK</h5>
            </div>
            <ul className="list-group list-group-flush" style={{borderTop: "none"}}>
              <li className="list-group-item" style={{border: 'none'}}>
                <div className="col">
                  <div className="card radius-10 shadow-none">
                    <div className="card-body-arsip">
                      <div className="d-flex align-items-center">
                        <div>
                          <p className="mb-0 text-secondary">Arsip</p>
                          <h4 className="my-1">100</h4>
                        </div>
                        <div className="text ms-auto font-35"><img src="assets/images/file-archive.png" alt className="logo-arsip"/>
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
              <img src="assets/images/Frame 139.png" className="card-img-top" style={{width: 170, height: 138, marginTop: 15}} alt="..." />
            </div>
            <div className="card-body">
              <h5 className="card-title">BPR</h5>
            </div>
            <ul className="list-group list-group-flush" style={{borderTop: "none"}}>
              <li className="list-group-item" style={{border: 'none'}}>
                <div className="col">
                  <div className="card radius-10 shadow-none">
                    <div className="card-body-arsip">
                      <div className="d-flex align-items-center">
                        <div>
                          <p className="mb-0 text-secondary">Arsip</p>
                          <h4 className="my-1">100</h4>
                        </div>
                        <div className="text ms-auto font-35"><img src="assets/images/file-archive.png" alt className="logo-arsip"/>
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
              <img src="assets/images/Frame 139.png" className="card-img-top" style={{width: 170, height: 138, marginTop: 15}} alt="..." />
            </div>
            <div className="card-body">
              <h5 className="card-title">Kemenkeu</h5>
            </div>
            <ul className="list-group list-group-flush" style={{borderTop: "none"}}>
              <li className="list-group-item" style={{border: 'none'}}>
                <div className="col">
                  <div className="card radius-10 shadow-none">
                    <div className="card-body-arsip">
                      <div className="d-flex align-items-center">
                        <div>
                          <p className="mb-0 text-secondary">Arsip</p>
                          <h4 className="my-1">100</h4>
                        </div>
                        <div className="text ms-auto font-35"><img src="assets/images/file-archive.png" alt className="logo-arsip"/>
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
              <img src="assets/images/Frame 139.png" className="card-img-top" style={{width: 170, height: 138, marginTop: 15}} alt="..." />
            </div>
            <div className="card-body">
              <h5 className="card-title">Bank Indonesia</h5>
            </div>
            <ul className="list-group list-group-flush" style={{borderTop: "none"}}>
              <li className="list-group-item" style={{border: 'none'}}>
                <div className="col">
                  <div className="card radius-10 shadow-none">
                    <div className="card-body-arsip">
                      <div className="d-flex align-items-center">
                        <div>
                          <p className="mb-0 text-secondary">Arsip</p>
                          <h4 className="my-1">100</h4>
                        </div>
                        <div className="text ms-auto font-35"><img src="assets/images/file-archive.png" alt className="logo-arsip"/>
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
              <img src="assets/images/Frame 139.png" className="card-img-top" style={{width: 170, height: 138, marginTop: 15}} alt="..." />
            </div>
            <div className="card-body">
              <h5 className="card-title">OJK</h5>
            </div>
            <ul className="list-group list-group-flush" style={{borderTop: "none"}}>
              <li className="list-group-item" style={{border: 'none'}}>
                <div className="col">
                  <div className="card radius-10 shadow-none">
                    <div className="card-body-arsip">
                      <div className="d-flex align-items-center">
                        <div>
                          <p className="mb-0 text-secondary">Arsip</p>
                          <h4 className="my-1">100</h4>
                        </div>
                        <div className="text ms-auto font-35"><img src="assets/images/file-archive.png" alt className="logo-arsip"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
      {/* Modal Tambah Digital */}
      <div className="modal fade" id="modaltambahDigital" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header" style={{border: 'none'}}>
              <h5 className="modal-title">Formulir Penambahan Data Arsip Digital</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <img src="assets/images/documents.png" />
              <form>
                <div className="mb-3">
                  <label className="form-label">Unduh File(Hanya PDF)</label>
                  <input type="file" id="unggah_file" name="unggah_file" accept=".pdf" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Size File(Mb)</label>
                  <input type="number" id="jumlah_item" name="jumlah_item" min={1} max={10} placeholder="Masukkan dalam bentuk MB" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nama Arsip</label>
                  <select className="form-select mb-3 radius-30" aria-label="Default select example">
                    <option selected>Pilih Arsip</option>
                    <option value={1}>One</option>
                    <option value={2}>Two</option>
                    <option value={3}>Three</option>
                  </select>
                </div>
                <label className="form-label">Jenis Arsip</label>
                <div className="line-check" style={{display: 'flex'}}>
                  <div className="form-check" style={{marginRight: 10}}>
                    <input className="form-check-input" type="checkbox" defaultValue id="flexCheckDefault" />
                    <label className="form-check-label" htmlFor="flexCheckDefault">Surat</label>
                  </div>
                  <div className="form-check" style={{marginRight: 10}}>
                    <input className="form-check-input" type="checkbox" defaultValue id="flexCheckDefault" />
                    <label className="form-check-label" htmlFor="flexCheckDefault">Laporan</label>
                  </div>
                  <div className="form-check" style={{marginRight: 10}}>
                    <input className="form-check-input" type="checkbox" defaultValue id="flexCheckDefault" />
                    <label className="form-check-label" htmlFor="flexCheckDefault">File</label>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Kode Arsip</label>
                  <input type className="form-control radius-30" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Kategori</label>
                  <select className="form-select mb-3 radius-30" aria-label="Default select example">
                    <option selected>Pilih Kategori</option>
                    <option value={1}>One</option>
                    <option value={2}>Two</option>
                    <option value={3}>Three</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Keterangan</label>
                  <input type="text" className="form-control radius-30" />
                </div>
              </form>
            </div>
            <div className="p-3 pt-0">
              <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                <div className="w-50">
                  <button type="button" className="btn btn-outline-primary radius-30" style={{width: '100%'}}>Batal</button>
                </div>	
                <div className="w-50">
                  <button type="button" className="btn btn-primary radius-30" style={{width: '100%'}} data-bs-toggle="modal" data-bs-target="#berhasilTambahDigital">Tambah</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col">
      {/* Modal Berhasil Tambah Digital*/}
      <div className="col">
        <div className="modal fade" id="berhasilTambahDigital" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header" style={{borderBottom: 'none'}}>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                <h5 className="modal-title" style={{marginBottom: 15}}>Penambahan Data Arsip Digital</h5>
                <img src="assets/images/pharmacy.png" />
                <h6 className="modal-isi" style={{marginBottom: 0, marginTop: 15}}>Data arsip digital berhasil ditambahkan.</h6>
              </div>
              <div className="modal-footer" style={{borderTop: 'none'}}>
                <button type="button" className="btn btn-primary" style={{width: '100%', borderRadius: 50}}>Oke</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
  )
}