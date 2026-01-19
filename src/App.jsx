
import './App.css';

import { Routes, Route, Navigate } from "react-router-dom";
import { PengajuanProvider } from './context/PengajuanContext.jsx';


import Login from "./component/Login.jsx";
import DashboardStaff from "./component/Staff/DashboardStaff.jsx";
import DataArsipStaff from './component/Staff/DataArsipStaff.jsx';
import LogPengajuanStaff from './component/Staff/LogPengajuanStaff.jsx';
import LogHistoryStaff from './component/Staff/logHistoryStaff.jsx';
import LantaiStaff from './component/Staff/LantaiStaff.jsx';
import RuangStaff from './component/Staff/RuangStaff.jsx';
import DetailArsipFisik from './component/Staff/DetailArsipFisik.jsx';
import DetailArsipDigital from './component/Staff/DetailArsipDigital.jsx';
import LemariStaff from './component/Staff/LemariStaff.jsx';
import RakStaff from './component/Staff/RakStaff.jsx';
import ArsipDigitalStaff from './component/Staff/ArsipDigitalStaff.jsx';
import PengajuanDigitalStaff from './component/Staff/PengajuanDigitalStaff.jsx';
import HistoryDigitalStaff from './component/Staff/HistoryDigitalStaff.jsx';


import DashboardPimpinan from './component/Pimpinan/DashboardPimpinan.jsx';
// import DataUserPimpinan from './component/Pimpinan/DataUserPimpinan.jsx';
import MenuArsipPimpinan from './component/Pimpinan/MenuArsipPimpinan.jsx';
import ApprovalPimpinan from './component/Pimpinan/ApprovalPimpinan.jsx';
import DataArsipPimpinan from './component/Pimpinan/DataArsipPimpinan.jsx';
import LogHistoryPimpinan from './component/Pimpinan/LogHistoryPimpinan.jsx';
import RiwayatUnduh from './component/Pimpinan/RiwayatUnduh.jsx';
import ArsipDigitalPimpinan from './component/Pimpinan/ArsipDigitalPimpinan.jsx';
import HistoryDigitalPimpinan from './component/Pimpinan/HistoryDigitalPimpinan.jsx';
import ApprovalDigitalPimpinan from './component/Pimpinan/ApprovalDigitalPimpinan.jsx';
import FileBanyakDiaksesPim from './component/Pimpinan/FileBanyakDiakses.jsx';
import UserAksesPim from './component/Pimpinan/UserAkses.jsx';


import DashboardPetugas from './component/Petugas/DashboardPetugas.jsx';
import DataArsipPetugas from './component/Petugas/DataArsipPetugas.jsx';
import DataMaster from './component/Petugas/DataMaster.jsx';
import ApprovalPetugas from './component/Petugas/ApprovalPetugas.jsx';
// import DataUserPetugas from './component/Petugas/DataUserPetugas.jsx';
import ArsipDigitalPetugas from './component/Petugas/ArsipDigitalPetugas.jsx';
import ApprovalDigitalPetugas from './component/Petugas/ApprovalDigitalPetugas.jsx';
import FileBanyakDiakses from './component/Petugas/FileBanyakDiakses.jsx';
import UserAkses from './component/Petugas/UserAkses.jsx';
import KategoriMaster from './component/Petugas/KategoriMaster.jsx';
import SubKategoriMaster from './component/Petugas/SubKategoriMaster.jsx';
import GedungMaster from './component/Petugas/GedungMaster.jsx';
import LantaiMaster from './component/Petugas/LantaiMaster.jsx';
import RuangMaster from './component/Petugas/RuangMaster.jsx';
import LemariMaster from './component/Petugas/LemariMaster.jsx';
import RakMaster from './component/Petugas/RakMaster.jsx';
import FolderMaster from './component/Petugas/FolderMaster.jsx';
import TujuanMaster from './component/Petugas/TujuanMaster.jsx';
import KodeArsipMaster from './component/Petugas/KodeArsipMaster.jsx';



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
    <PengajuanProvider>
      <Routes>
        <Route path="/" element={<Login />} />


        <Route
          path="/dashboardStaff"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <DashboardStaff />
            </ProtectedRoute>
          }
        />

        {/* Dashboard untuk Petugas */}
        <Route
          path="/dashboardPetugas"
          element={
            <ProtectedRoute allowedRoles={["petugas"]}>
              <DashboardPetugas />
            </ProtectedRoute>
          }
        />

        {/* Dashboard untuk Pimpinan */}
        <Route
          path="/dashboardPimpinan"
          element={
            <ProtectedRoute allowedRoles={["pimpinan"]}>
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
          path="/logPengajuanStaff"
          element={
            <ProtectedRoute>
              <LogPengajuanStaff />
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
          path="/dataArsipStaff/ArsipDigitalStaff/detailDigitalStaff"
          element={
            <ProtectedRoute>
              <DetailArsipDigital />
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
          path="/dataArsipStaff/ruangStaff"
          element={
            <ProtectedRoute>
              <RuangStaff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dataArsipStaff/ruangStaff/lemariStaff"
          element={
            <ProtectedRoute>
              <LemariStaff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dataArsipStaff/lemariStaff/rakStaff"
          element={
            <ProtectedRoute>
              <RakStaff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dataArsipStaff/detailFisikStaff"
          element={
            <ProtectedRoute>
              <DetailArsipFisik />
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
          path="/logHistoryStaff/HistoryDigitalStaff"
          element={
            <ProtectedRoute>
              <HistoryDigitalStaff />
            </ProtectedRoute>
          }
        />


        {/* <Route
        path="/dataUserPimpinan"
        element={
          <ProtectedRoute>
            <DataUserPimpinan />
          </ProtectedRoute>
        }
      /> */}

        <Route
          path="/dashboardPimpinan/FileBanyakDiakses"
          element={
            <ProtectedRoute>
              <FileBanyakDiaksesPim />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboardPimpinan/UserAkses"
          element={
            <ProtectedRoute>
              <UserAksesPim />
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
          path="/dashboardPetugas/FileBanyakDiakses"
          element={
            <ProtectedRoute>
              <FileBanyakDiakses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboardPetugas/UserAkses"
          element={
            <ProtectedRoute>
              <UserAkses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dataArsipPetugas/ArsipDigitalPetugas"
          element={
            <ProtectedRoute>
              <ArsipDigitalPetugas />
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
          path="/dataMaster/KategoriMaster"
          element={
            <ProtectedRoute>
              <KategoriMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataMaster/SubKategoriMaster"
          element={
            <ProtectedRoute>
              <SubKategoriMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataMaster/GedungMaster"
          element={
            <ProtectedRoute>
              <GedungMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataMaster/LantaiMaster"
          element={
            <ProtectedRoute>
              <LantaiMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataMaster/RuangMaster"
          element={
            <ProtectedRoute>
              <RuangMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataMaster/LemariMaster"
          element={
            <ProtectedRoute>
              <LemariMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataMaster/RakMaster"
          element={
            <ProtectedRoute>
              <RakMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataMaster/FolderMaster"
          element={
            <ProtectedRoute>
              <FolderMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataMaster/TujuanMaster"
          element={
            <ProtectedRoute>
              <TujuanMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataMaster/KodeArsipMaster"
          element={
            <ProtectedRoute>
              <KodeArsipMaster />
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
          path="/approvalPetugas/approvalDigitalPetugas"
          element={
            <ProtectedRoute>
              <ApprovalDigitalPetugas />
            </ProtectedRoute>
          }
        />

        {/* <Route
        path="/dataUserPetugas"
        element={
          <ProtectedRoute>
            <DataUserPetugas />
          </ProtectedRoute>
        }
      /> */}
      </Routes>
    </PengajuanProvider>
  )
}




