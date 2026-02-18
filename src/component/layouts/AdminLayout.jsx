import React, { useEffect } from "react";
import Navigation from "../Navigation";
import { usePengajuan } from "../../context/PengajuanContext";

const AdminLayout = ({ children }) => {
  const { role } = usePengajuan();
  const [user, setUser] = React.useState(null);
  useEffect(() => {
    const data = localStorage.getItem("user");
    setUser(JSON.parse(data));
  }, []);
  // console.log("role", role);
  // const user = localStorage.getItem("user");
  return (
    <div className="wrapper">
      {/*sidebar wrapper */}
      <div className="sidebar-wrapper" data-simplebar="true">
        <div
          className="sidebar-header"
          style={{ border: "none", justifyContent: "center" }}
        >
          <div className>
            <h4
              className="logo-text"
              style={{ fontWeight: 600, fontSize: 20, marginLeft: 0 }}
            >
              Manajemen Surat
            </h4>
          </div>
        </div>
        <Navigation />
      </div>
      <header>
        <div className="topbar d-flex align-items-center">
          <nav className="navbar navbar-expand">
            <div className="mobile-toggle-menu">
              <i className="bx bx-menu" />
            </div>
            <div className="search-bar flex-grow-1">
              <h4 className="mb-0">Selamat Datang</h4>
            </div>
            <div className="top-menu ms-auto">
              <ul className="navbar-nav align-items-center">
                <li className="nav-item dropdown dropdown-large">
                  <a
                    className="nav-link position-relative"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src="/assets/images/bell-dot.png"
                      width="25px"
                      height="25px"
                      alt
                    />
                  </a>
                </li>
              </ul>
            </div>
            <div className="user-box" style={{ border: "none" }}>
              <div className="col">
                <button type="button" className="btn-avatar p-3 pt-1 pb-1">
                  <img
                    src="/assets/images/Avatar.png"
                    alt
                    style={{ marginRight: 10 }}
                  />
                  {user?.name}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
