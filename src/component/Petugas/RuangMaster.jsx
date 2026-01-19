import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";


export default function RuangMaster() {
  const navigate = useNavigate();
  const location = useLocation();
  // const [floor, setFloor] = useState({
  //   building_uuid: "",
  //   name: ""
  // })
  // const { token, gedungs, floors, rooms, getRooms } = React.useContext(PengajuanContext)

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("floor", floor)
  //   try {
  //     const response = await fetch(import.meta.env.VITE_API_URL + '/api/rooms', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(floor),
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       throw new Error(result.message || 'Login Gagal');
  //     }
  //     getFloors(token)
  //   } catch (error) {
  //     // 'error.message' akan berisi pesan dari 'throw new Error' di atas
  //     console.error('Login Gagal:', error.message);
  //   }
  // };
  let tab;
  if (location.pathname.includes("KategoriMaster")) {
    tab = "KategoriMaster";
  } else if (location.pathname.includes("SubKategoriMaster")) {
    tab = "SubKategoriMaster";
  } else if (location.pathname.includes("GedungMaster")) {
    tab = "GedungMaster";
  } else if (location.pathname.includes("LantaiMaster")) {
    tab = "LantaiMaster";
  } else if (location.pathname.includes("RuangMaster")) {
    tab = "RuangMaster";
  } else if (location.pathname.includes("LemariMaster")) {
    tab = "LemariMaster";
  } else if (location.pathname.includes("RakMaster")) {
    tab = "RakMaster";
  } else if (location.pathname.includes("FolderMaster")) {
    tab = "FolderMaster";
  } else if (location.pathname.includes("TujuanMaster")) {
    tab = "TujuanMaster";
  } else if (location.pathname.includes("KodeArsipMaster")) {
    tab = "KodeArsipMaster";
  } else {
    tab = "JenisArsipMaster";
  }

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
            <Link to="/dashboardPetugas" className="link">
              <div className="parent-icon">
                <img src="/assets/images/house.png" alt="Dashboard" />
              </div>
              <div className="menu-title">Dashboard</div>
            </Link>
          </li>
          {/* <li>
            <Link to="/dataUserPetugas" className="link">
              <div className="parent-icon">
                <img src="/assets/images/house.png" alt="Dashboard" />
              </div>
              <div className="menu-title">Data User</div>
            </Link>
          </li> */}
          <li>
            <Link to="/dataArsipPetugas" className="link">
              <div className="parent-icon">
                <img src="/assets/images/clipboard-list.png" alt="Data Arsip" />
              </div>
              <div className="menu-title">Data Arsip</div>
            </Link>
          </li>
          <li>
            <Link to="/dataMaster" className="link">
              <div className="parent-icon">
                <img src="/assets/images/clipboard-list.png" alt="Log Pengajuan" />
              </div>
              <div className="menu-title">Data Master</div>
            </Link>
          </li>
          <li>
            <Link to="/approvalPetugas" className="link">
              <div className="parent-icon">
                <img src="/assets/images/history.png" alt="Log History" />
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
                  <a className="nav-link position-relative" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="/assets/images/bell-dot.png" width="25px" height="25px" alt />
                  </a>
                </li>
              </ul>
            </div>
            <div className="user-box" style={{ border: 'none' }}>
              <div className="col">
                <button type="button" className="btn btn-primary px-5 pe-3 ps-3 radius-30">
                  <img src="/assets/images/Avatar.png" alt style={{ marginRight: 10 }} />
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
            <div className="d-flex align-items-center">
              <div className="search-bar flex-grow-1 d-flex align-items-center" style={{ marginBottom: 10 }}>
                <h4 style={{ marginBottom: 0 }}>Data Master</h4>
              </div>
            </div>
          </div>
          <div className="row-cols-xl-2 d-flex flex-nowrap">
            <div className="col-12 col-lg-2" style={{ width: '22%', marginRight: '15px' }}>
              <div className="card">
                <div className="card-body-master">
                  <div className="col d-flex justify-content-center">
                    <button type="button" className="btn-tambah px-5 mt-2 mb-3" data-bs-toggle="modal" data-bs-target="#tambahRuangMaster">Tambah <img src="/assets/images/plus.png" width={20} height={20} /></button>
                  </div>
                  <div>
                    <h6 className="my-2" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>Kategori Data Master</h6>
                  </div>
                  <div className="fm-menu mt-3">
                    <div className="list-group list-group-flush">
                      <div onClick={() => navigate("/dataMaster")} className={`list-group-item py-2 ${tab === "JenisArsipMaster" ? "" : ""}`} role="presentation"><span>Jenis Arsip</span></div>
                      <div onClick={() => navigate("/dataMaster/KategoriMaster")} className={`list-group-item py-2 ${tab === "KategoriMaster" ? "" : ""}`}><span>Kategori</span></div>
                      <div onClick={() => navigate("/dataMaster/SubKategoriMaster")} className={`list-group-item py-2 ${tab === "SubKategoriMaster" ? "" : ""}`}><span>Sub Kategori</span></div>
                      <div onClick={() => navigate("/dataMaster/GedungMaster")} className={`list-group-item py-2 ${tab === "GedungMaster" ? "" : ""}`}><span>Gedung</span></div>
                      <div onClick={() => navigate("/dataMaster/LantaiMaster")} className={`list-group-item py-2 ${tab === "LantaiMaster" ? "" : ""}`}><span>Lantai</span></div>
                      <div onClick={() => navigate("/dataMaster/RuangMaster")} className={`list-group-item active py-2 ${tab === "RuangMaster" ? "" : ""}`}><span>Ruang</span></div>
                      <div onClick={() => navigate("/dataMaster/LemariMaster")} className={`list-group-item py-2 ${tab === "LemariMaster" ? "" : ""}`}><span>Lemari</span></div>
                      <div onClick={() => navigate("/dataMaster/RakMaster")} className={`list-group-item py-2 ${tab === "RakMaster" ? "" : ""}`}><span>Rak</span></div>
                      <div onClick={() => navigate("/dataMaster/FolderMaster")} className={`list-group-item py-2 ${tab === "FolderMaster" ? "" : ""}`}><span>Folder</span></div>
                      <div onClick={() => navigate("/dataMaster/TujuanMaster")} className={`list-group-item py-2 ${tab === "TujuanMaster" ? "" : ""}`}><span>Tujuan</span></div>
                      <div onClick={() => navigate("/dataMaster/KodeArsipMaster")} className={`list-group-item py-2 ${tab === "KodeArsipMaster" ? "" : ""}`}><span>Kode Arsip</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="customers-list mb-3" style={{ width: '78%' }}>
              <div className="customers-list-item d-flex align-items-center justify-content-between p-3 cursor-pointer bg-white radius-10" style={{ marginBottom: 15 }}>
                <div className="kiri" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className>
                    <img src="/assets/images/block.png" width={40} height={50} alt />
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-1 font-14">Ruang Arsip 1</h6>
                  </div>
                </div>
                <div className="kanan" style={{ display: 'flex' }}>
                  <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                    <div className>
                      <h7 className="mb-1">Aksi:</h7>
                    </div>
                    <div className="w-45">
                      <button type="button" className="btn-edit pt-1 pb-1" style={{ width: '100%' }}><img src="/assets/images/edit.png" alt width="15px" height="15px" style={{ marginRight: 8 }} />Edit</button>
                    </div>
                    <div className="w-45">
                      <button type="button" className="btn-hapus pt-1 pb-1" style={{ width: '100%' }}><img src="/assets/images/hapus.png" width="15px" height="15px" style={{ marginRight: 8 }} alt />Hapus</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="customers-list-item d-flex align-items-center justify-content-between p-3 cursor-pointer bg-white radius-10" style={{ marginBottom: 15 }}>
                <div className="kiri" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className>
                    <img src="/assets/images/block.png" width={40} height={50} alt />
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-1 font-14">Ruang Administrasi</h6>
                  </div>
                </div>
                <div className="kanan" style={{ display: 'flex' }}>
                  <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                    <div className>
                      <h7 className="mb-1">Aksi:</h7>
                    </div>
                    <div className="w-45">
                      <button type="button" className="btn-edit pt-1 pb-1" style={{ width: '100%' }}><img src="/assets/images/edit.png" alt width="15px" height="15px" style={{ marginRight: 8 }} />Edit</button>
                    </div>
                    <div className="w-45">
                      <button type="button" className="btn-hapus pt-1 pb-1" style={{ width: '100%' }}><img src="/assets/images/hapus.png" width="15px" height="15px" style={{ marginRight: 8 }} alt />Hapus</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="customers-list-item d-flex align-items-center justify-content-between p-3 cursor-pointer bg-white radius-10" style={{ marginBottom: 15 }}>
                <div className="kiri" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className>
                    <img src="/assets/images/block.png" width={40} height={50} alt />
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-1 font-14">Ruang Perpustakaan</h6>
                  </div>
                </div>
                <div className="kanan" style={{ display: 'flex' }}>
                  <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                    <div className>
                      <h7 className="mb-1">Aksi:</h7>
                    </div>
                    <div className="w-45">
                      <button type="button" className="btn-edit pt-1 pb-1" style={{ width: '100%' }}><img src="/assets/images/edit.png" alt width="15px" height="15px" style={{ marginRight: 8 }} />Edit</button>
                    </div>
                    <div className="w-45">
                      <button type="button" className="btn-hapus pt-1 pb-1" style={{ width: '100%' }}><img src="/assets/images/hapus.png" width="15px" height="15px" style={{ marginRight: 8 }} alt />Hapus</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Modal Tambah User */}
          <div className="modal fade" id="tambahRuangMaster" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header" style={{ border: 'none' }}>
                  <div className style={{ margin: 'auto' }}>
                    <h5 className="modal-title align-items-center">Penambahan Ruang</h5>
                  </div>
                  <div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                  </div>
                </div>
                <div className="modal-body">
                  <img src="/assets/images/documents.png" alt width="90px" height="90px" style={{ display: 'block', margin: '0 auto', marginBottom: 20 }} />
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Ruang</label>
                      <input type="text" className="form-control radius-30" placeholder="Masukkan Jenis Arsip" />
                    </div>
                  </form>
                </div>
                <div className="p-3 pt-0">
                  <div className="d-flex align-items-center pb-0 pt-0 gap-3">
                    <div className="w-50">
                      <button type="button" className="btn-batal" style={{ width: '100%' }}>Batal</button>
                    </div>
                    <div className="w-50">
                      <button type="button" className="btn-tambah" style={{ width: '100%' }}>Simpan</button>
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