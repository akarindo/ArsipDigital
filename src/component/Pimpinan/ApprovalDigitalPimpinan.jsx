import { Link, useNavigate, useLocation } from "react-router-dom";
import ApprovalDigital from "../ApprovalDigital";

export default function ApprovalDigitalPimpinan() {

   const navigate = useNavigate();
  const location = useLocation();

  const tab = location.pathname.includes("Arsip Digital") ? "Arsip Digital" : "Arsip Fisik";

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
            <Link to="/dashboardPimpinan" className="link">
              <div className="parent-icon">
                <img src="/assets/images/house.png" alt="Dashboard" />
              </div>
              <div className="menu-title">Dashboard</div>
            </Link>
          </li>
          <li>
            <Link to="/dataUserPimpinan" className="link">
              <div className="parent-icon">
                <img src="/assets/images/clipboard-list.png" alt="Data User" />
              </div>
              <div className="menu-title">Data User</div>
            </Link>
          </li>
          <li>
            <Link to="/menuArsipPimpinan" className="link">
              <div className="parent-icon">
                <img src="/assets/images/clipboard-list.png" alt="Log Pengajuan" />
              </div>
              <div className="menu-title">Menu Arsip</div>
            </Link>
          </li>
          <li>
            <Link to="/approvalPimpinan" className="link">
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
                <img src="assets/images/bell-dot.png" width="25px" height="25px" alt />
            </li>
          </ul>
        </div>
        <div className="user-box" style={{border: 'none'}}>
          <div className="col">
            <button type="button" className="btn btn-primary px-5 pe-3 ps-3 radius-30">
              <img src="assets/images/Avatar.png" alt style={{marginRight: 10}} />
              Pimpinan
            </button>
          </div>
        </div>
      </nav>
    </div>
  </header>
  {/*end header */}
  <div className="page-wrapper">
    <div className="page-content">
  <div className="d-flex align-items-center">
        <div className="search-bar flex-grow-1 d-flex align-items-center" style={{marginBottom: 10}}>
          <h4 style={{marginBottom: 0}}>Approval</h4>
        </div>
      </div>
      <div className="d-flex align-items-center mb-3">
        <div className="search-bar flex-grow-1">
          <ul className="nav nav-pills" role="tablist">
            <li className="nav-item" role="presentation" style={{width: '50%'}}>
              <a className="nav-link active" data-bs-toggle="pill" href="#primary-pills-home" role="tab" aria-selected="true">
                <div className="d-flex align-items-center justify-content-center">
                  <div onClick={() => navigate("/approvalPimpinan")} className={`tab-title ${tab === "Arsip Fisik" ? "active" : ""}`}>Arsip Fisik</div>
                </div>
              </a>
            </li>
            <li className="nav-item" role="presentation" style={{width: '50%'}}>
              <a className="nav-link" data-bs-toggle="pill" href="#primary-pills-profile" role="tab" aria-selected="false">
                <div className="d-flex align-items-center justify-content-center">
                  <div  onClick={() => navigate("/approvalDigitalPimpinan")} className={`tab-title ${tab === "Arsip Digital" ? "active" : ""}`}>Arsip Digital</div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="dropdown bg-white my-3" style={{height: 38}}> 
        <div className="d-flex justify-content-between">
          <a href="#" className="btn btn-white btn-sm my-3 mt-0 p-2 pe-0" style={{border: 'none'}} data-bs-toggle="dropdown" data-display="static">Tipe<i className="bx bxs-chevron-down ms-5" /></a>
          <a href="#" className="btn btn-white btn-sm my-3 mt-0 p-2 pe-0" style={{border: 'none'}} data-bs-toggle="dropdown" data-display="static">Kategori<i className="bx bxs-chevron-down ms-5" /></a>
          <a href="#" className="btn btn-white btn-sm my-3 mt-0 p-2 pe-0" style={{border: 'none'}} data-bs-toggle="dropdown" data-display="static">Status<i className="bx bxs-chevron-down ms-5" /></a>
        </div>
      </div>
      
   <ApprovalDigital />
  </div>
  </div>
  </div>
 
	  )
	}
