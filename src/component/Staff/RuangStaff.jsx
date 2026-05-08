import React from "react";
import { Link, useParams } from "react-router-dom";
import { PengajuanContext } from "../../context/PengajuanContext";
import Navigation from "../Navigation";
import AdminLayout from "../layouts/AdminLayout";
import DataArsip from "../Petugas/DataArsip";
import BuildCard from "../base/BuildCard";

export default function RuangStaff() {
  const { uuid } = useParams();
  const { rooms } = React.useContext(PengajuanContext);
  const [roomBuild, setRoomBuild] = React.useState([]);

  React.useEffect(() => {
    if (rooms) {
      const filtered = rooms.filter((room) => room.floor_uuid === uuid);
      setRoomBuild(filtered);
    }
  }, [rooms]);
  return (
    <DataArsip>
      <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
        {roomBuild?.map((room) => (
          <div className="col">
            <BuildCard
              name={room.name}
              uuid={`/dataArsipStaff/ruangStaff/lemariStaff/${room.uuid}`}
              elemen={"Lemari"}
              totalRuang={room.cabinets?.length}
              image={"building.png"}
            />
          </div>
        ))}
      </div>
    </DataArsip>
  );
}
