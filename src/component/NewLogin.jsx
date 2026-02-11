import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PengajuanContext } from "../context/PengajuanContext";

export default function NewLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const { refreshData } = useContext(PengajuanContext);

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Email atau Password Salah");
      }

      const { token, user } = result.data;

      setCurrentUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      refreshData();
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    if (currentUser) {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userRole", currentUser.role);

      const rolePath = {
        pegawai: "/disposisistaff",
        hrd: "/disposisistaff",
        "staff umum": "/surat",
        direksi: "/disposisi",
      };

      navigate(rolePath[currentUser.role.toLowerCase()] || "/");
    }
    setShowSuccess(false);
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            {/* Logo atau Judul Sistem */}
            <div className="text-center mb-4">
              <div className="bg-primary d-inline-block p-3 rounded-circle mb-3 shadow-sm">
                <i className="bx bxs-envelope text-white fs-2"></i>
              </div>
              <h3 className="fw-bold text-dark">E-SURAT</h3>
              <p className="text-muted">Sistem Manajemen Surat Digital</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-sm-5">
                <h4 className="fw-bold mb-1">Sign In</h4>
                <p className="text-muted small mb-4">
                  Silakan masukkan akun Anda untuk melanjutkan
                </p>

                <form onSubmit={handleLogin}>
                  {/* Input Email */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bx bx-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control bg-light border-start-0 ps-0"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Input Password */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bx bx-lock-alt text-muted"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control bg-light border-start-0 border-end-0 ps-0"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        className="input-group-text bg-light border-start-0"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`bx ${showPassword ? "bx-show" : "bx-hide"} text-muted`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                      />
                      <label
                        className="form-check-label small text-muted"
                        htmlFor="remember"
                      >
                        Ingat saya
                      </label>
                    </div>
                    <a href="#" className="small text-decoration-none">
                      Lupa password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sedang Memproses..." : "Masuk ke Dashboard"}
                  </button>
                </form>
              </div>
            </div>

            <p className="text-center mt-4 text-muted small">
              &copy; 2026 Admin Panel Manajemen Surat
            </p>
          </div>
        </div>
      </div>

      {/* MODAL ERROR */}
      {showError && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-body text-center p-4">
                <div className="text-danger mb-3">
                  <i className="bx bx-error-circle display-4"></i>
                </div>
                <h5 className="fw-bold">Login Gagal</h5>
                <p className="text-muted small">{errorMessage}</p>
                <button
                  className="btn btn-dark w-100 rounded-pill"
                  onClick={() => setShowError(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUKSES */}
      {showSuccess && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-body text-center p-4">
                <div className="text-success mb-3">
                  <i className="bx bx-check-circle display-4"></i>
                </div>
                <h5 className="fw-bold">Berhasil!</h5>
                <p className="text-muted small">Anda akan segera dialihkan.</p>
                <button
                  className="btn btn-success w-100 rounded-pill"
                  onClick={handleSuccess}
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
