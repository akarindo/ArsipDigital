import { useState } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";


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

export default function DashboardStaff() {
  return (
    <div className="wrapper">
      {/* sidebar wrapper */}
      <div className="sidebar-wrapper" data-simplebar="true">
        <div className="sidebar-header" style={{border: 'none', justifyContent: 'center'}}>
          <div>
            <h4 className="logo-text" style={{fontWeight: 600, fontSize: 20, marginLeft: 0}}>
              Arsip Digital Bank
            </h4>
          </div>
        </div>
        
        {/* navigation */}
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
        {/* end navigation */}
      </div>
      {/* end sidebar wrapper */}
      
      {/* start header */}
      <header>
        <div className="topbar d-flex align-items-center">
          <nav className="navbar navbar-expand">
            <div className="mobile-toggle-menu">
              <i className="bx bx-menu" />
            </div>
            <div className="search-bar">
              <h4 className="mb-0">Selamat Datang</h4>
            </div>
            <div className="top-menu ms-auto">
              <ul className="navbar-nav align-items-center">
                <li className="nav-item dropdown dropdown-large">
                  <img src="/assets/images/bell-dot.png" width="25px" height="25px" alt="Notifikasi" />
                </li>
              </ul>
            </div>
            <div className="user-box" style={{border: 'none'}}>
              <div className="col">
                <button type="button" className="btn btn-primary px-5 pe-3 ps-3 radius-30">
                  <img src="/assets/images/Avatar.png" alt="Avatar" style={{marginRight: 10}} />
                  Pegawai
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      {/* end header */}
      
      {/* start page wrapper */}
      <div className="page-wrapper">
        <div className="page-content">
          <div className="d-flex align-items-center mb-3">
            <div className="search-bar">
              <h4>Selamat Datang</h4>
            </div>
            <div className="top-menu ms-auto">
              <ul className="navbar-nav align-items-center">
                <li className="nav-item dropdown dropdown-large">
                </li>
              </ul>
            </div>
            <img src="/assets/images/Frame 14.png" className="user-img" alt="user avatar" />
            <div className="user-info ps-3">
              <p className="user-name mb-0">Rabu</p>
              <p className="designattion mb-0">November 2025</p>
            </div>
            <Link to='/dataArsipStaff'>
            <div className="user-box">
              <div className="col">
                <button type="button" className="btn btn-primary px-5 radius-30">
                  Pengajuan Peminjaman
                </button>
              </div>
            </div>
            </Link>
          </div>
          
          <div className="search-bar">
            <h6>Rekap Per bulan</h6>
          </div>
          
          <div className="row row-cols-1 row-cols-md-3 row-cols-xl-5 mb-4">
            <div className="col">
              <div className="card radius-10" style={{height: '100%'}}>
                <div className="card-body">
                  <div className="text-center">
                    <div className="widgets-icons rounded-circle mx-auto bg-light-primary text-primary mb-3">
                      <img src="/assets/images/file-archive.png" className="logo-item" alt="Total Arsip" />
                    </div>
                    <h4 className="my-1">20</h4>
                    <p className="rekap-text-secondary">Total Arsip</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card radius-10" style={{height: '100%'}}>
                <div className="card-body">
                  <div className="text-center">
                    <div className="widgets-icons rounded-circle mx-auto bg-light-success text-success mb-3">
                      <img src="/assets/images/circle-check.png" className="logo-item" alt="Total Setujui" />
                    </div>
                    <h4 className="my-1">12</h4>
                    <p className="rekap-text-secondary">Total Setujui</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card radius-10">
                <div className="card-body">
                  <div className="text-center">
                    <div className="widgets-icons rounded-circle mx-auto bg-light-primary text-primary mb-3">
                      <img src="/assets/images/file-archive.png" className="logo-item" alt="Peminjaman Digital" />
                    </div>
                    <h4 className="my-1">11</h4>
                    <p className="rekap-text-secondary">Peminjaman Arsip Digital</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card radius-10" style={{height: '100%'}}>
                <div className="card-body">
                  <div className="text-center">
                    <div className="widgets-icons rounded-circle mx-auto bg-light-primary text-primary mb-3">
                      <img src="/assets/images/file-archive.png" className="logo-item" alt="Peminjaman Fisik" />
                    </div>
                    <h4 className="my-1">8</h4>
                    <p className="rekap-text-secondary">Peminjaman Arsip Fisik</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card radius-10" style={{height: '100%'}}>
                <div className="card-body">
                  <div className="text-center">
                    <div className="widgets-icons rounded-circle mx-auto bg-light-danger text-danger mb-3">
                      <img src="/assets/images/file-warning.png" className="logo-item" alt="Deadline" />
                    </div>
                    <h4 className="my-1">2</h4>
                    <p className="rekap-text-secondary">Deadline Hari ini</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <MyLineChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}