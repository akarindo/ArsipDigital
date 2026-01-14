
import './App.css'

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/Login.jsx";
import DashboardStaff from "./component/Staff/DashboardStaff.jsx";
import DataArsipStaff from './component/Staff/DataArsipStaff.jsx';
import LogPengajuanStaff from './component/Staff/LogPengajuanStaff.jsx';
import LogHistoryStaff from './component/Staff/logHistoryStaff.jsx';
import LantaiStaff from './component/Staff/LantaiStaff.jsx';
import ArsipDigitalStaff from './component/Staff/ArsipDigitalStaff.jsx';
import PengajuanDigitalStaff from './component/Staff/PengajuanDigitalStaff.jsx';


import DashboardPimpinan from './component/Pimpinan/DashboardPimpinan.jsx';
import DataUserPimpinan from './component/Pimpinan/DataUserPimpinan.jsx';
import MenuArsipPimpinan from './component/Pimpinan/MenuArsipPimpinan.jsx';
import ApprovalPimpinan from './component/Pimpinan/ApprovalPimpinan.jsx';
import DataArsipPimpinan from './component/Pimpinan/DataArsipPimpinan.jsx';
import LogHistoryPimpinan from './component/Pimpinan/LogHistoryPimpinan.jsx';
import RiwayatUnduh from './component/Pimpinan/RiwayatUnduh.jsx';
import ArsipDigitalPimpinan from './component/Pimpinan/ArsipDigitalPimpinan.jsx';
import HistoryDigitalPimpinan from './component/Pimpinan/HistoryDigitalPimpinan.jsx';
import ApprovalDigitalPimpinan from './component/Pimpinan/ApprovalDigitalPimpinan.jsx';


import DashboardPetugas from './component/Petugas/DashboardPetugas.jsx';
import DataArsipPetugas from './component/Petugas/DataArsipPetugas.jsx';
import DataMaster from './component/Petugas/DataMaster.jsx';
import ApprovalPetugas from './component/Petugas/ApprovalPetugas.jsx';
import DataUserPetugas from './component/Petugas/DataUserPetugas.jsx';



function ProtectedRoute({ children, allowedRoles }) {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const userRole = sessionStorage.getItem("userRole");

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  // Jika allowedRoles didefinisikan, cek apakah user role sesuai
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect ke dashboard sesuai role jika akses ditolak
    return <Navigate to={`/dashboard${userRole}`} />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
    
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboardStaff"
        element={
          <ProtectedRoute allowedRoles={["Staff"]}>
            <DashboardStaff />
          </ProtectedRoute>
        }
      />

      {/* Dashboard untuk Petugas */}
      <Route
        path="/dashboardPetugas"
        element={
          <ProtectedRoute allowedRoles={["Petugas"]}>
            <DashboardPetugas />
          </ProtectedRoute>
        }
      />

      {/* Dashboard untuk Pimpinan */}
      <Route
        path="/dashboardPimpinan"
        element={
          <ProtectedRoute allowedRoles={["Pimpinan"]}>
            <DashboardPimpinan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dataArsipStaff"
        element={
          <ProtectedRoute>
            <DataArsipStaff />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dataArsipStaff/ArsipDigitalStaff"
        element={
          <ProtectedRoute>
            <ArsipDigitalStaff />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dataArsipStaff/lantaiStaff"
        element={
          <ProtectedRoute>
            <LantaiStaff />
          </ProtectedRoute>
        }
      />

      <Route
        path="/logPengajuanStaff"
        element={
          <ProtectedRoute>
            <LogPengajuanStaff />
          </ProtectedRoute>
        }
      />

      <Route
        path="/logPengajuanStaff/PengajuanDigitalStaff"
        element={
          <ProtectedRoute>
            <PengajuanDigitalStaff />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/logHistoryStaff"
        element={
          <ProtectedRoute>
            <LogHistoryStaff />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dataUserPimpinan"
        element={
          <ProtectedRoute>
            <DataUserPimpinan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/menuArsipPimpinan"
        element={
          <ProtectedRoute>
            <MenuArsipPimpinan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/menuArsipPimpinan/dataArsipPimpinan"
        element={
          <ProtectedRoute>
            <DataArsipPimpinan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/menuArsipPimpinan/dataArsipPimpinan/ArsipDigitalPimpinan"
        element={
          <ProtectedRoute>
            <ArsipDigitalPimpinan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/menuArsipPimpinan/logHistoryPimpinan"
        element={
          <ProtectedRoute>
            <LogHistoryPimpinan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/menuArsipPimpinan/logHistoryPimpinan/HistoryDigitalPimpinan"
        element={
          <ProtectedRoute>
            <HistoryDigitalPimpinan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/menuArsipPimpinan/riwayatUnduh"
        element={
          <ProtectedRoute>
            <RiwayatUnduh />
          </ProtectedRoute>
        }
      />

      <Route
        path="/approvalPimpinan"
        element={
          <ProtectedRoute>
            <ApprovalPimpinan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/approvalDigitalPimpinan"
        element={
          <ProtectedRoute>
            <ApprovalDigitalPimpinan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dataArsipPetugas"
        element={
          <ProtectedRoute>
            <DataArsipPetugas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dataMaster"
        element={
          <ProtectedRoute>
            <DataMaster />
          </ProtectedRoute>
        }
      />

      <Route
        path="/approvalPetugas"
        element={
          <ProtectedRoute>
            <ApprovalPetugas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dataUserPetugas"
        element={
          <ProtectedRoute>
            <DataUserPetugas />
          </ProtectedRoute>
        }
      />

      </Routes>
    
  );
}




