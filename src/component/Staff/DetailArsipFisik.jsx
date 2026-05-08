import { Link, useParams } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
import React, { use } from "react";
import DataArsip from "../Petugas/DataArsip";
import ArchiveFisicalCard from "../base/ArchiveFisicalCard";
import SkeletonItem from "../SkeletonItem";

export default function DetailArsipFisik() {
  const { uuid } = useParams();
  const {
    arsips,
    folders,
    handleDelete,
    role,
    handleEdit,
    gedungs,
    refreshData,
    floors,
    rooms,
    isLoading,
    cabinets,
    shelves,
  } = React.useContext(PengajuanContext);
  const filterArsip = arsips?.filter((arsip) => arsip.folder_uuid == uuid);
  const filterFolder = folders?.filter((folder) => folder.uuid == uuid);
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
