import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";
import { PengajuanProvider } from "./context/PengajuanContext.jsx";

import Login from "./component/Login.jsx";
import DashboardStaff from "./component/Staff/DashboardStaff.jsx";
import LogPengajuanStaff from "./component/Staff/LogPengajuanStaff.jsx";
import LantaiStaff from "./component/Staff/LantaiStaff.jsx";
import RuangStaff from "./component/Staff/RuangStaff.jsx";
import DetailArsipFisik from "./component/Staff/DetailArsipFisik.jsx";
import DetailArsipDigital from "./component/Staff/DetailArsipDigital.jsx";
import LemariStaff from "./component/Staff/LemariStaff.jsx";
import RakStaff from "./component/Staff/RakStaff.jsx";
import ArsipDigitalStaff from "./component/Staff/ArsipDigitalStaff.jsx";

import FileBanyakDiaksesPim from "./component/Pimpinan/FileBanyakDiakses.jsx";

import DashboardPetugas from "./component/Petugas/DashboardPetugas.jsx";
import DataMaster from "./component/Petugas/DataMaster.jsx";
import ApprovalPetugas from "./component/Petugas/ApprovalPetugas.jsx";
import KodeArsipDigital from "./component/Petugas/KodeArsipDigital.jsx";
import FileBanyakDiakses from "./component/Petugas/FileBanyakDiakses.jsx";
import UserAkses from "./component/Petugas/UserAkses.jsx";
import KategoriMaster from "./component/Petugas/KategoriMaster.jsx";
import SubKategoriMaster from "./component/Petugas/SubKategoriMaster.jsx";
import GedungMaster from "./component/Petugas/GedungMaster.jsx";
import LantaiMaster from "./component/Petugas/LantaiMaster.jsx";
import RuangMaster from "./component/Petugas/RuangMaster.jsx";
import LemariMaster from "./component/Petugas/LemariMaster.jsx";
import RakMaster from "./component/Petugas/RakMaster.jsx";
import FolderMaster from "./component/Petugas/FolderMaster.jsx";
import TujuanMaster from "./component/Petugas/TujuanMaster.jsx";
import KodeArsipMaster from "./component/Petugas/KodeArsipMaster.jsx";
import DataJenisArsip from "./component/Petugas/DataJenisArsip.jsx";
import NamaMaster from "./component/Petugas/NamaMaster.jsx";
import DetailArsip from "./component/DetailArsip.jsx";
import BuildsComponent from "./component/Petugas/BuildsComponent.jsx";
import DisposisiSurat from "./component/Pimpinan/DisposisiSurat.jsx";
import Disposisi from "./component/Staff/Disposisi.jsx";
import ManajemenSurat from "./component/Petugas/ManajemenSurat.jsx";
import CorporateMaster from "./component/Petugas/CorporateMaster.jsx";
import RiwayatDisposisi from "./component/Pimpinan/RiwayatDisposisi.jsx";
import NewLogin from "./component/NewLogin.jsx";

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
        <Route path="/" element={<NewLogin />} />

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
            <ProtectedRoute allowedRoles={["staff umum"]}>
              <DashboardPetugas />
            </ProtectedRoute>
          }
        />

        {/* Dashboard untuk Pimpinan */}
        <Route
          path="/dashboardPimpinan"
          element={
            <ProtectedRoute allowedRoles={["pimpinan"]}>
              <DashboardPetugas />
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
          path="/dataArsipStaff/lantaiStaff/:uuid"
          element={
            <ProtectedRoute>
              <LantaiStaff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dataArsipStaff/ruangStaff/:uuid"
          element={
            <ProtectedRoute>
              <RuangStaff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dataArsipStaff/ruangStaff/lemariStaff/:uuid"
          element={
            <ProtectedRoute>
              <LemariStaff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dataArsipStaff/lemariStaff/rakStaff/:uuid"
          element={
            <ProtectedRoute>
              <RakStaff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dataArsipStaff/detailFisikStaff/:uuid"
          element={
            <ProtectedRoute>
              <DetailArsipFisik />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataArsipStaff/detailArsipDigital/:uuid"
          element={
            <ProtectedRoute>
              <DetailArsipDigital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataArsipStaff/detailFisikStaff"
          element={
            <ProtectedRoute>
              <DetailArsip />
            </ProtectedRoute>
          }
        />

        <Route
          path="/logHistoryStaff"
          element={
            <ProtectedRoute>
              <LogPengajuanStaff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboardPimpinan/FileBanyakDiakses"
          element={
            <ProtectedRoute>
              <FileBanyakDiaksesPim />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dataArsip"
          element={
            <ProtectedRoute>
              <BuildsComponent />
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
              <KodeArsipDigital />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dataMaster/main"
          element={
            <ProtectedRoute>
              <DataMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataMaster/jenis"
          element={
            <ProtectedRoute>
              <DataJenisArsip />
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
          path="/dataMaster/nama"
          element={
            <ProtectedRoute>
              <NamaMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instansi"
          element={
            <ProtectedRoute>
              <CorporateMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/surat"
          element={
            <ProtectedRoute>
              <ManajemenSurat />
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
          path="/disposisi"
          element={
            <ProtectedRoute>
              <DisposisiSurat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat"
          element={
            <ProtectedRoute>
              <RiwayatDisposisi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/disposisistaff"
          element={
            <ProtectedRoute>
              <Disposisi />
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
      </Routes>
    </PengajuanProvider>
  );
}
