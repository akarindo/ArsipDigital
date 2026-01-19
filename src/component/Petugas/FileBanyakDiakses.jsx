import { Link, useNavigate, useLocation } from "react-router-dom";
import Chart from "react-apexcharts";
import { useState } from "react";

export default function FileBanyakDiakses () {
    const navigate = useNavigate();
  const location = useLocation();

  const tab = location.pathname.includes("UserAkses") ? "UserAkses" 
              : location.pathname.includes("FileBanyakDiakses") ? "FileBanyakDiakses"
              : "FileTerbesar";
  const MyLineChart = () => {
      const [options] = useState({
        chart: {
          id: 'spline-bar',
          type: 'area',
          height: 350,
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 90, 100]
          }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
        },
        title: {
          text: 'Grafik Total Peminjaman Data Per Bulan'
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right'
        }
      });
    
      // State for the chart series (data)
      const [series] = useState([
        {
          name: "Arsip Digital",
          data: [31, 40, 28, 51, 42, 109, 100, 91, 125, 90, 110, 95]
        }
      ]);
    
      return (
        <div>
          <Chart
            options={options}
            series={series}
            type="area"
            height={350}
          />
        </div>
      );
    };

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
        <div className="search-bar">
          <h4 className="mb-0">Selamat Datang</h4>
        </div>
        <div className="top-menu ms-auto">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item dropdown dropdown-large">
                <img src="assets/images/bell-dot.png" width="25px" height="25px" alt />
            </li>
          </ul>
        </div>
        <div className="user-box" style={{border: 'none'}}>
          <div className="col">
            <button type="button" className="btn btn-primary px-5 pe-3 ps-3 radius-10">
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
  <div className="page-content ml-0">
    <div className="d-flex align-items-center">
      <div className="search-bar flex-grow-1">
        <h4>Selamat Datang</h4>
      </div>
      <div className="top-menu ms-auto">
        <ul className="navbar-nav align-items-center">
          <li className="nav-item dropdown dropdown-large">
          </li>
        </ul>
      </div>
      <img src="assets/images/Frame 14.png" className="user-img" alt="user avatar" />
      <div className="user-info ps-3">
        <p className="user-name mb-0">Rabu</p>
        <p className="designattion mb-0">November 2025</p>
      </div>
      <Link to="/approvalPimpinan">
      <div className="user-box">
        <div className="col">
          <button type="button" className="btn btn-primary px-5 radius-30">Pengajuan Peminjaman</button>
        </div>
      </div>
      </Link>
    </div>
    <div className="search-bar flex-grow-1">
      <h6>Rekap Per bulan</h6>
    </div>
    <div className="pim-row d-flex row-cols-xl-2 justify-content-between">
      <div className="row row-cols-xl-4 me-0 g-3" style={{width: '80%'}}>
        <div className="col">
          <div className="card radius-10" style={{height: '100%'}}>
            <div className="card-body">
              <div className="text-center">
                <div className="widgets-icons rounded-circle mx-auto bg-light-primary text-primary mb-3"><img src="assets/images/file-archive.png" className="logo-item" alt />
                </div>
                <h4 className="my-1">20</h4>
                <p className="mb-0 text-secondary">Total Arsip</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card radius-10" style={{height: '100%'}}>
            <div className="card-body">
              <div className="text-center">
                <div className="widgets-icons rounded-circle mx-auto bg-light-primary text-primary mb-3"><img src="assets/images/list.png" className="logo-item" alt />
                </div>
                <h4 className="my-1">12</h4>
                <p className="mb-0 text-secondary">Total Kategori</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card radius-10" style={{height: '100%'}}>
            <div className="card-body">
              <div className="text-center">
                <div className="widgets-icons rounded-circle mx-auto bg-light-primary text-primary mb-3"><img src="assets/images/users.png" className="logo-item" alt />
                </div>
                <h4 className="my-1">11</h4>
                <p className="mb-0 text-secondary">Total Petugas</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card radius-10" style={{height: '100%'}}>
            <div className="card-body">
              <div className="text-center">
                <div className="widgets-icons rounded-circle mx-auto bg-light-primary text-primary mb-3"><img src="assets/images/users.png" className="logo-item" alt />
                </div>
                <h4 className="my-1">8</h4>
                <p className="mb-0 text-secondary">Total User</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card radius-10" style={{height: '100%'}}>
            <div className="card-body">
              <div className="text-center">
                <div className="widgets-icons rounded-circle mx-auto bg-light-success text-success mb-3"><img src="assets/images/circle-check.png" className="logo-item" alt />
                </div>
                <h4 className="my-1">2</h4>
                <p className="mb-0 text-secondary">Permintaan Disetujui</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card radius-10" style={{height: '100%'}}>
            <div className="card-body">
              <div className="text-center">
                <div className="widgets-icons rounded-circle mx-auto bg-light-danger text-danger mb-3"><img src="assets/images/circle-x.png" className="logo-item" alt />
                </div>
                <h4 className="my-1">2</h4>
                <p className="mb-0 text-secondary">Permintaan Ditolak</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card radius-10" style={{height: '100%'}}>
            <div className="card-body">
              <div className="text-center">
                <div className="widgets-icons rounded-circle mx-auto bg-light-primary text-primary mb-3"><img src="assets/images/file-archive.png" className="logo-item" alt />
                </div>
                <h4 className="my-1">2</h4>
                <p className="mb-0 text-secondary">File <br />Dipinjam</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card radius-10" style={{height: '100%'}}>
            <div className="card-body">
              <div className="text-center">
                <div className="widgets-icons rounded-circle mx-auto bg-light-primary text-primary mb-3"><img src="assets/images/file-archive.png" className="logo-item" alt />
                </div>
                <h4 className="my-1">2</h4>
                <p className="mb-0 text-secondary">File Belum Dikembalikan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col" style={{width: '20%'}}>
        <div className="card" style={{height: '100%', backgroundColor: '#3468F8', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className="text-center">
              <div className="widgets-icons rounded-circle mx-auto bg-white text-white mb-3"><img src="assets/images/file-clock.png" className="logo-item" alt />
              </div>
              <h4 className="my-1 text-white">2</h4>
              <p className="mb-0 text-white">Permintaan Peminjaman</p>
            </div>
        </div>
      </div>
    </div>
    <div className="row row-cols-1 row-cols-xl-2 mt-3">
      <div className="col d-flex">
        <div className="card radius-10 w-100">
          <div className="card-body">
            <MyLineChart />
          </div>
        </div>
      </div>
      <div className="col d-flex">
        <div className="card radius-10 w-100" style={{backgroundColor: '#3468F8'}}>
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div>
                <h5 className="mb-1 text-white">Nama Arsip</h5>
                <p className="mb-0 font-13 text-white">OJK</p>
              </div>
              <div className="font-22 ms-auto">
                <button type="button" className="btn-tindakan p-2 pe-3 ps-3">Tindakan <img src="assets/images/arrow-up-right.png" alt /></button>
              </div>
            </div>
          </div>
          <div className>
            <div className="row">
              <div className="d-flex justify-content-center align-items-center" style={{width: '100%'}}>
                <div className>
                  <img src="assets/images/stackfiles.png" width={148} height={120} alt />
                </div>
              </div>
              <div className="colom d-flex p-4" style={{flexDirection: 'column'}}>
                <div className="kolom d-flex mb-3">
                  <div className>
                    <h6 className="mb-1 text-white">Nama Pengguna</h6>
                    <p className="mb-0 text-white">Citra</p>
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-1 text-white">Hak Akses</h6>
                    <p className="mb-0 text-white">2</p>
                  </div>
                </div>
                <div className="kolom d-flex">
                  <div className>
                    <h6 className="mb-1 text-white">Tipe Arsip</h6>
                    <p className="mb-0 text-white">Digital</p>
                  </div>
                  <div className style={{marginLeft: 65}}>
                    <h6 className="mb-1 text-white">Waktu Permintaan</h6>
                    <p className="mb-0 text-white">21 November 2026 | <br />15:32</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* File Yang Banyak Diakses */}
    <div className="col d-flex mt-3">
      <div className="card radius-10 w-100">
        <div className="card-body-pim">
          <ul className="nav nav-pills mb-3 d-flex justify-content-between" role="tablist">
            <li onClick={() => navigate("/dashboardPetugas")} className={`nav-item ${tab === "FileTerbesar" ? "active" : ""}`} role="presentation" style={{width: '33%'}}>
              <a className="nav-link" data-bs-toggle="pill" href="#primary-pills-home" role="tab" aria-selected="true">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="tab-title">File Terbesar</div>
                </div>
              </a>
            </li>
            <li onClick={() => navigate("/dashboardPetugas/FileBanyakDiakses")} className={`nav-item ${tab === "FileBanyakAkses" ? "active" : ""}`} role="presentation" style={{width: '33%'}}>
              <a className="nav-link active" data-bs-toggle="pill" href="#primary-pills-profile" role="tab" aria-selected="false">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="tab-title">File Yang Banyak Di Akses</div>
                </div>
              </a>
            </li>
            <li onClick={() => navigate("/dashboardPetugas/UserAkses")} className={`nav-item ${tab === "UserAkses" ? "active" : ""}`} role="presentation" style={{width: '33%'}}>
              <a className="nav-link" data-bs-toggle="pill" href="#primary-pills-profile" role="tab" aria-selected="false">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="tab-title">User Yang Sering Akses</div>
                </div>
              </a>
            </li>
          </ul>
          
          <div className="kotak-file p-3 pt-0 pb-0">
            <div className="row border 1 mb-3 radius-10 pt-3 pb-3">
              <div className="col-md-2 text-end d-flex align-items-center justify-content-center">
                <img src="assets/images/iconpdf.png" className="img-pim" alt />
              </div>
              <div className="col-md-10">
                <div className="kanan pe-0" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                  <h6 className="ms-3 mb-0">OJK</h6>
                  <div className="d-flex align-items-center border p-2  radius-10" style={{marginRight: 10, background: '#3468F8', height: 35}}>	
                    <div className>
                      <p className="mb-0" style={{color: 'white'}}>Digital</p>
                    </div>
                  </div>
                </div>
                <div className="d-flex  justify-content-between pt-0 pb-1 p-3">
                  <div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Kategori</h7> : <h7 className="mb-0 text-secondary">OJK</h7>
                    </div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Sub Kategori</h7> : <h7 className="mb-0 text-secondary">PP</h7>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Ukuran</h7> : <h7 className="mb-0 text-secondary">80 MB</h7>
                    </div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Waktu Upload</h7> : <h7 className="mb-0 text-secondary">1 November 2025 | 10:30:00</h7>
                    </div>
                  </div>
                </div>
              </div>
            </div>           
            <div className="row border 1 mb-3 radius-10 pt-3 pb-3">
              <div className="col-md-2 text-end d-flex align-items-center justify-content-center">
                <img src="assets/images/iconpdf.png" className="img-pim" alt />
              </div>
              <div className="col-md-10">
                <div className="kanan pe-0" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                  <h6 className="ms-3 mb-0">OJK</h6>
                  <div className="d-flex align-items-center border p-2  radius-10" style={{marginRight: 10, background: '#3468F8', height: 35}}>	
                    <div className>
                      <p className="mb-0" style={{color: 'white'}}>Fisik</p>
                    </div>
                  </div>
                </div>
                <div className="d-flex  justify-content-between pt-0 pb-1 p-3">
                  <div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Kategori</h7> : <h7 className="mb-0 text-secondary">OJK</h7>
                    </div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Sub Kategori</h7> : <h7 className="mb-0 text-secondary">PP</h7>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Ukuran</h7> : <h7 className="mb-0 text-secondary">80 MB</h7>
                    </div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Waktu Upload</h7> : <h7 className="mb-0 text-secondary">1 November 2025 | 10:30:00</h7>
                    </div>
                  </div>
                </div>
              </div>
            </div>            
            <div className="row border 1 mb-3 radius-10 pt-3 pb-3">
              <div className="col-md-2 text-end d-flex align-items-center justify-content-center">
                <img src="assets/images/iconpdf.png" className="img-pim" alt />
              </div>
              <div className="col-md-10">
                <div className="kanan pe-0" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                  <h6 className="ms-3 mb-0">OJK</h6>
                  <div className="d-flex align-items-center border p-2  radius-10" style={{marginRight: 10, background: '#3468F8', height: 35}}>	
                    <div className>
                      <p className="mb-0" style={{color: 'white'}}>Fisik</p>
                    </div>
                  </div>
                </div>
                <div className="d-flex  justify-content-between pt-0 pb-1 p-3">
                  <div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Kategori</h7> : <h7 className="mb-0 text-secondary">OJK</h7>
                    </div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Sub Kategori</h7> : <h7 className="mb-0 text-secondary">PP</h7>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Ukuran</h7> : <h7 className="mb-0 text-secondary">80 MB</h7>
                    </div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Waktu Upload</h7> : <h7 className="mb-0 text-secondary">1 November 2025 | 10:30:00</h7>
                    </div>
                  </div>
                </div>
              </div>
            </div> 
            <div className="row border 1 radius-10 pt-3 pb-3 mb-1">
              <div className="col-md-2 text-end d-flex align-items-center justify-content-center">
                <img src="assets/images/iconpdf.png" className="img-pim" alt />
              </div>
              <div className="col-md-10">
                <div className="kanan pe-0" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                  <h6 className="ms-3 mb-0">OJK</h6>
                  <div className="d-flex align-items-center border p-2  radius-10" style={{marginRight: 10, background: '#3468F8', height: 35}}>	
                    <div className>
                      <p className="mb-0" style={{color: 'white'}}>Digital</p>
                    </div>
                  </div>
                </div>
                <div className="d-flex  justify-content-between pt-0 pb-1 p-3">
                  <div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Kategori</h7> : <h7 className="mb-0 text-secondary">OJK</h7>
                    </div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Sub Kategori</h7> : <h7 className="mb-0 text-secondary">PP</h7>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Ukuran</h7> : <h7 className="mb-0 text-secondary">80 MB</h7>
                    </div>
                    <div>
                      <h7 className="mb-1 font-weight-bold">Waktu Upload</h7> : <h7 className="mb-0 text-secondary">1 November 2025 | 10:30:00</h7>
                    </div>
                  </div>
                </div>
              </div>
            </div>      
          </div>    
        </div>
      </div>
    </div>
    
        </div></div></div>

    )
  
}

