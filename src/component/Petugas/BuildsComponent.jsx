import React from "react";
import DataArsip from "./DataArsip";
import BuildCard from "../base/BuildCard";
import { usePengajuan } from "../../context/PengajuanContext";
import { useNavigate } from "react-router-dom";

const BuildsComponent = () => {
  const { gedungs } = usePengajuan();
  const navigate = useNavigate();
  return (
    <DataArsip>
      <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
        {gedungs?.map((gedung) => {
          return (
            <div className="col" key={gedung.uuid}>
              <BuildCard
                name={gedung.name}
                uuid={`/dataArsipStaff/lantaiStaff/${gedung.uuid}`}
                elemen={"Lantai"}
                totalRuang={gedung.floors?.length}
                image={"building.png"}
              />
            </div>
          );
        })}
      </div>
      <div className="my-2">
        <button
          onClick={() => navigate("/dataArsipStaff/detailFisikStaff")}
          className="w-100 btn btn-info"
          style={{
            background: "#0d6efd",
            color: "white",
            borderRadius: "30px",
            padding: "10px 0px",
          }}
        >
          Daftar Arsip
        </button>
      </div>
    </DataArsip>
  );
};

export default BuildsComponent;
