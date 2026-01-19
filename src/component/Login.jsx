import { use, useState } from "react";
import { useNavigate } from "react-router-dom";


const USERS = {
  staff: { email: 'staff@gmail.com', password: '123456', role: 'Staff', name: 'Staff' },
  petugas: { email: 'petugas@gmail.com', password: '123456', role: 'Petugas', name: 'Petugas' },
  pimpinan: { email: 'pimpinan@gmail.com', password: '123456', role: 'Pimpinan', name: 'Pimpinan' }
};

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login Gagal');
      }

      const { token, user } = result.data;

      setCurrentUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      setShowSuccess(true)

    } catch (error) {
      // 'error.message' akan berisi pesan dari 'throw new Error' di atas
      console.error('Login Gagal:', error.message);
      alert(error.message);
    }
  };

  const handleSuccess = () => {
    if (currentUser) {
      // Simpan data user ke sessionStorage
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userRole", currentUser.role);
      sessionStorage.setItem("userName", currentUser.name);
      sessionStorage.setItem("userEmail", currentUser.email);

      switch (currentUser.role) {
        case 'staff':
          navigate("/dashboardStaff");
          break;
        case 'petugas':
          navigate("/dashboardPetugas");
          break;
        case 'pimpinan':
          navigate("/dashboardPimpinan");
          break;
      }
    }
    setShowSuccess(false);

  };

  return (
    <div>
      <div className="wrapper">
        <div className="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0 bg-white" style={{height: '100%'}}>
          <div className="container-fluid" style={{marginTop: '5%'}}>
            <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
              <div className="col mx-auto">
                <div className="mb-4 text-center">
                  <h3 style={{ color: 'blue', fontWeight: 'bold' }}>Arsip Digital Bank</h3>
                </div>
                <div className="card border p-2" style={{ boxShadow: 'none' }}>
                  <div className="card-body">
                    <div className="border p-2">
                      <div className="text-center mb-5">
                        <h3>Sign In</h3>
                      </div>
                      <div className="form-body">
                        <form className="row g-3" onSubmit={handleLogin}>
                          <div className="col-12">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control font-13"
                              placeholder="Ketik Disini"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="col-12">
                            <label htmlFor="inputChoosePassword" className="form-label">Password</label>

                            <div className="input-group">

                              <input
                                type="password"
                                className="form-control border-end-0 font-13"
                                id="inputChoosePassword"
                                placeholder="Ketik Disini"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <a href="javascript:;" className="input-group-text bg-transparent">
                                <i className="bx bx-hide" />
                              </a>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-check form-switch">
                              <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" defaultChecked />
                              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Ingat Saya</label>
                            </div>
                          </div>
                          <div className="col-md-6 text-end">
                            <a href="authentication-forgot-password.html">Lupa Password ?</a>
                          </div>
                          <div className="col-12">
                            <div className="d-grid">
                              <button type="submit" className="btn btn-primary">
                                <i className="bx bxs-lock-open" />Masuk
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Gagal */}
      {showError && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: 'none' }}>
                <button type="button" className="btn-close" onClick={() => setShowError(false)} />
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <h5 className="modal-title" style={{ marginBottom: 15 }}>Email / Password Salah</h5>
                <img src="assets/images/warning.png" alt="Warning" />
                <h6 className="modal-isi" style={{ marginBottom: 0, marginTop: 15 }}>Pastikan email dan password Anda benar!</h6>
              </div>
              <div className="modal-footer" style={{ borderTop: 'none' }}>
                <button type="button" className="btn btn-primary" style={{ width: '100%', borderRadius: 50 }} onClick={() => setShowError(false)}>Oke</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sukses */}
      {showSuccess && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: 'none' }}>
                <button type="button" className="btn-close" onClick={() => setShowSuccess(false)} />
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <h5 className="modal-title" style={{ marginBottom: 15 }}>Anda Berhasil Masuk</h5>
                <img src="assets/images/success.png" alt="Success" />
              </div>
              <div className="modal-footer" style={{ borderTop: 'none' }}>
                <button type="button" className="btn btn-primary" style={{ width: '100%', borderRadius: 50 }} onClick={handleSuccess}>Oke</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}