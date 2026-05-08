import { Link, useParams } from "react-router-dom";
import React from "react";
import AdminLayout from "./layouts/AdminLayout";
import { PengajuanContext } from "../context/PengajuanContext";
import DataArsip from "./Petugas/DataArsip";
import SkeletonItem from "./SkeletonItem";
import ArchiveFisicalCard from "./base/ArchiveFisicalCard";

export default function DetailArsip() {
  // const { uuid } = useParams();
  const {
    arsips,
    handleDelete,
    isLoading,
    refreshData,
    role,
    handleEdit,
    gedungs,
    floors,
    rooms,
    cabinets,
    shelves,
    folders,
  } = React.useContext(PengajuanContext);

  const [param, setParam] = React.useState("fisik");
  const arsipFisik = arsips?.filter((arsip) => arsip.file == null);
  const arsipDigital = arsips?.filter((arsip) => arsip.file != null);
  const filterArsip = param == "fisik" ? arsipFisik : arsipDigital;
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .format(date)
      .replace(".", ":"); // Mengganti titik pemisah jam menjadi titik dua jika perlu
  };
  React.useEffect(() => {
    refreshData();
  }, []);
  return (
    <DataArsip>
      <div className="dropdown">
        <div className="customers-list mb-3">
          {isLoading ? (
            <div className="customers-list mb-3">
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
            </div>
          ) : filterArsip.length === 0 ? (
            <div className="text-center py-5 bg-white">
              <p className="text-secondary">Belum ada Data Arsip</p>
            </div>
          ) : (
            filterArsip?.map((arsip) => {
              const filterGedung = gedungs?.filter(
                (gedung) => gedung.uuid == arsip?.gedung_uuid,
              );
              const filterLantai = floors?.filter(
                (floor) => floor.uuid == arsip?.lantai_uuid,
              );
              const filterRuang = rooms?.filter(
                (room) => room.uuid == arsip?.ruang_uuid,
              );
              const filterLemari = cabinets?.filter(
                (cabinet) => cabinet.uuid == arsip?.lemari_uuid,
              );
              const filterRak = shelves?.filter(
                (shelf) => shelf.uuid == arsip?.rak_uuid,
              );
              const filterFolder = folders?.filter(
                (folder) => folder.uuid == arsip?.folder_uuid,
              );
              // console.log("arsip", arsip);
              return (
                <ArchiveFisicalCard
                  arsip={arsip}
                  formatDate={formatDate}
                  filterGedung={filterGedung}
                  filterLantai={filterLantai}
                  filterRuang={filterRuang}
                  filterLemari={filterLemari}
                  filterRak={filterRak}
                  filterFolder={filterFolder}
                  handleEdit={handleEdit}
                  role={role}
                  handleDelete={handleDelete}
                />
              );
            })
          )}
        </div>
      </div>
    </DataArsip>
  );
}
