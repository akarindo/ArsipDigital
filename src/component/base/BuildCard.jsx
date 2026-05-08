import React from "react";
import { Link } from "react-router-dom";

const BuildCard = ({ name, uuid, totalRuang, elemen, image }) => {
  return (
    // <Link to={`/dataArsipStaff/lantaiStaff/${gedung.uuid}`} className="link">
    <div className="card">
      <div className="gambar d-flex justify-content-center">
        <img
          src="/assets/images/block.png"
          className="card-img-top"
          style={{ width: 104, height: 146, marginTop: 15 }}
          alt="..."
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
      </div>
      <ul className="list-group list-group-flush" style={{ borderTop: "none" }}>
        <Link to={uuid} className="link">
          <li className="list-group-item" style={{ border: "none" }}>
            <div className="col">
              <div className="card radius-10 shadow-none">
                <div className="card-body-arsip">
                  <div className="d-flex align-items-center">
                    <div>
                      <p className="mb-0 text-secondary">{elemen}</p>
                      <h4 className="my-1">{totalRuang}</h4>
                    </div>
                    <div className="text ms-auto font-35">
                      <img
                        src={`assets/images/${image}`}
                        alt
                        className="logo-arsip"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default BuildCard;
