import { Link, useParams } from "react-router-dom";
import React from "react";
import { PengajuanContext } from "../../context/PengajuanContext";
import DataArsip from "../Petugas/DataArsip";

export default function LantaiStaff() {
  const { uuid } = useParams();
  const { floors } = React.useContext(PengajuanContext);
  const [floorBuild, setFloorBuild] = React.useState([]);

  React.useEffect(() => {
    if (floors) {
      const filtered = floors.filter((floor) => floor.building_uuid === uuid);
      setFloorBuild(filtered);
    }
  }, [floors]);
  return (
    <DataArsip>
      <div className="customers-list mb-3">
        {floorBuild?.map((floor) => (
          <div
            key={floor.uuid}
            className="customers-list-item d-flex align-items-center justify-content-between p-3 cursor-pointer bg-white"
            style={{ marginBottom: 15 }}
          >
            <div
              className="kiri"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div className>
                <img
                  src="/assets/images/block.png"
                  width={60}
                  height={80}
                  alt
                />
              </div>
              <div className="ms-2">
                <h6 className="mb-1 font-14">{floor.name}</h6>
                {/* <p className="mb-0 font-13 text-secondary">Training &amp; Development</p> */}
              </div>
            </div>
            <div className="kanan" style={{ display: "flex" }}>
              <Link
                to={`/dataArsipStaff/ruangStaff/${floor.uuid}`}
                className="link"
              >
                <div
                  className="list-inline d-flex customers-contacts ms-auto align-items-center border p-3 radius-10"
                  style={{ marginRight: 10 }}
                >
                  <div className="kanan d-flex align-items-center">
                    <div className style={{ marginRight: 10 }}>
                      <p className="mb-0 text-secondary fw-normal">Ruang</p>
                      <p className="mb-0 text-secondary font-18">
                        {floor.rooms.length}
                      </p>
                    </div>
                    <div className>
                      <img
                        src="/assets/images/building.png"
                        width={24}
                        height={24}
                        alt
                      />
                    </div>
                  </div>
                </div>
              </Link>
              <div className="kanan d-flex align-items-center">
                <img
                  src="/assets/images/Vector.png"
                  width={10}
                  height={10}
                  alt
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </DataArsip>
  );
}
