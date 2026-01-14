export default function ApprovalFisik() {
  return (
      <div className="customers-list mb-3">
        <div className="customers-list-item cursor-pointer bg-white" style={{marginBottom: 15}}>
          <div className="top d-flex align-items-center justify-content-between p-3">
            <div className="kiri" style={{alignItems: 'center'}}>
              <div className="d-flex align-items-center">
                <img src="assets/images/iconpdf.png" width={60} height={60} alt />
                <h6 className="ms-3 mb-0">PP Investasi</h6>
              </div>
            </div>
            <div className="kanan" style={{display: 'flex'}}>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, background: '#46D657', height: 35}}>	
                <div className>
                  <p className="mb-0" style={{color: 'white'}}>Disetujui</p>
                </div>
              </div>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, height: 35}}>	
                <div className>
                  <p className="mb-0">Sedang Dipinjam</p>
                </div>
              </div>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, height: 35}}>	
                <div className="kanan d-flex align-items-center">
                  <div className style={{marginRight: 10}}>
                    <p className="mb-0">4 jam : 24 menit : 30 detik</p>
                  </div>
                  <div className>
                    <img src="assets/images/clock.png" width={15} height={15} alt />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex  justify-content-between pt-0 pb-1 p-3">
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Jenis</h7> : <h7 className="mb-0 text-secondary">File</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tipe</h7> : <h7 className="mb-0 text-secondary">Statis</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tujuan</h7> : <h7 className="mb-0 text-secondary">Print</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Petugas</h7> : <h7 className="mb-0 text-secondary">Dafa Maulana</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Peminjam</h7> : <h7 className="mb-0 text-secondary">Citra</h7>
              </div>		
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengajuan</h7> : <h7 className="mb-0 text-secondary">1 Desember 2025 <br />| 07:00:00 wib</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Diterima</h7> : <h7 className="mb-0 text-secondary">1 November 2025 <br />| 10:30:00 wib</h7>
              </div>
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Batas Peminjaman</h7> : <h7 className="mb-0 text-secondary">1 Desember <br />2025 | 18:30:00 wib</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengembalian</h7> : <h7 className="mb-0 text-secondary">...</h7>
              </div>
            </div>
          </div>
          <div className="d-flex mt-1">
            <div className="p-3 pt-0 pe-1">
              <img src="assets/images/pin.png" width={15} height={15} alt />
            </div>
            <div>
              <p className="me-1">Gedung A</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lantai 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Ruang 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lemari 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Folder 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p>Nomor 1</p>
            </div>
          </div>
        </div>
        <div className="customers-list-item cursor-pointer bg-white" style={{marginBottom: 15}}>
          <div className="top d-flex align-items-center justify-content-between p-3">
            <div className="kiri" style={{alignItems: 'center'}}>
              <div className="d-flex align-items-center">
                <img src="assets/images/iconpdf.png" width={60} height={60} alt />
                <h6 className="ms-3 mb-0">PP Investasi</h6>
              </div>
            </div>
            <div className="kanan" style={{display: 'flex'}}>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, background: '#F83434', height: 35}}>	
                <div className>
                  <p className="mb-0" style={{color: 'white'}}>Belum Dikembalikan</p>
                </div>
              </div>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, height: 35}}>	
                <div className>
                  <p className="mb-0">Sedang Dipinjam</p>
                </div>
              </div>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, height: 35}}>	
                <div className="kanan d-flex align-items-center">
                  <div className style={{marginRight: 10}}>
                    <p className="mb-0">+4 jam : 24 menit : 30 detik</p>
                  </div>
                  <div className>
                    <img src="assets/images/alert.png" width={15} height={15} alt />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex  justify-content-between pt-0 pb-1 p-3">
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Jenis</h7> : <h7 className="mb-0 text-secondary">File</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tipe</h7> : <h7 className="mb-0 text-secondary">Statis</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tujuan</h7> : <h7 className="mb-0 text-secondary">Print</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Petugas</h7> : <h7 className="mb-0 text-secondary">Dafa Maulana</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Peminjam</h7> : <h7 className="mb-0 text-secondary">Citra</h7>
              </div>		
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengajuan</h7> : <h7 className="mb-0 text-secondary">1 Desember 2025 <br />| 07:00:00 wib</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Diterima</h7> : <h7 className="mb-0 text-secondary">1 November 2025 <br />| 10:30:00 wib</h7>
              </div>
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Batas Peminjaman</h7> : <h7 className="mb-0 text-secondary">1 Desember <br />2025 | 18:30:00 wib</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengembalian</h7> : <h7 className="mb-0 text-secondary">...</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Alasan</h7> : <h7 className="mb-0 text-secondary">...</h7>
              </div>
            </div>
          </div>
          <div className="d-flex mt-1">
            <div className="p-3 pt-0 pe-1">
              <img src="assets/images/pin.png" width={15} height={15} alt />
            </div>
            <div>
              <p className="me-1">Gedung A</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lantai 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Ruang 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lemari 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Folder 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p>Nomor 1</p>
            </div>
          </div>
          <div className="d-flex justify-content-center p-3 pb-0 pt-0">
            <div className="mb-3 w-100">
              <button type="button" className="btn btn-primary px-5 radius-30 w-100" data-bs-toggle="modal" data-bs-target="#notifikasiKembali">Ingatkan Untuk Mengembalikan</button>
            </div>
          </div>
        </div>
        <div className="customers-list-item cursor-pointer bg-white" style={{marginBottom: 15}}>
          <div className="top d-flex align-items-center justify-content-between p-3">
            <div className="kiri" style={{alignItems: 'center'}}>
              <div className="d-flex align-items-center">
                <img src="assets/images/iconpdf.png" width={60} height={60} alt />
                <h6 className="ms-3 mb-0">PP Investasi</h6>
              </div>
            </div>
            <div className="kanan" style={{display: 'flex'}}>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, background: '#F8A634', height: 35}}>	
                <div className>
                  <p className="mb-0" style={{color: 'white'}}>Menunggu Persetujuan</p>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex  justify-content-between pt-0 pb-1 p-3">
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Jenis</h7> : <h7 className="mb-0 text-secondary">File</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tipe</h7> : <h7 className="mb-0 text-secondary">Statis</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tujuan</h7> : <h7 className="mb-0 text-secondary">Print</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Petugas</h7> : <h7 className="mb-0 text-secondary">Dafa Maulana</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Peminjam</h7> : <h7 className="mb-0 text-secondary">Citra</h7>
              </div>		
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengajuan</h7> : <h7 className="mb-0 text-secondary">1 Desember 2025 <br />| 07:00:00 wib</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Diterima</h7> : <h7 className="mb-0 text-secondary">...</h7>
              </div>
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Batas Peminjaman</h7> : <h7 className="mb-0 text-secondary">...</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengembalian</h7> : <h7 className="mb-0 text-secondary">...</h7>
              </div>
            </div>
          </div>
          <div className="d-flex mt-1">
            <div className="p-3 pt-0 pe-1">
              <img src="assets/images/pin.png" width={15} height={15} alt />
            </div>
            <div>
              <p className="me-1">Gedung A</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lantai 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Ruang 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lemari 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Folder 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p>Nomor 1</p>
            </div>
          </div>
          <div className="p-3 pt-0">
            <div className="d-flex align-items-center pb-0 pt-0 gap-3">
              <div className>
                <h7 className="mb-1">Aksi</h7> 
              </div>
              <div className="w-50">
                <button type="button" className="btn btn-primary radius-30" style={{width: '100%'}}>
                  <img src="assets/images/circle-check-big.png" alt width="16px" height="16px" style={{marginRight: 10}} />Approve</button>
              </div>	
              <div className="w-50">
                <button type="button" className="btn btn-danger radius-30" style={{width: '100%'}}>
                  <img src="assets/images/circle-x.png" width="16px" height="16px" style={{marginRight: 10}} alt />Tolak</button>
              </div>
            </div>
          </div>
        </div>
        <div className="customers-list-item cursor-pointer bg-white" style={{marginBottom: 15}}>
          <div className="top d-flex align-items-center justify-content-between p-3">
            <div className="kiri" style={{alignItems: 'center'}}>
              <div className="d-flex align-items-center">
                <img src="assets/images/iconpdf.png" width={60} height={60} alt />
                <h6 className="ms-3 mb-0">PP Investasi</h6>
              </div>
            </div>
            <div className="kanan" style={{display: 'flex'}}>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, background: '#F83434', height: 35}}>	
                <div className>
                  <p className="mb-0" style={{color: 'white'}}>Ditolak</p>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex  justify-content-between pt-0 pb-1 p-3">
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Jenis</h7> : <h7 className="mb-0 text-secondary">File</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tipe</h7> : <h7 className="mb-0 text-secondary">Statis</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tujuan</h7> : <h7 className="mb-0 text-secondary">Print</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Petugas</h7> : <h7 className="mb-0 text-secondary">Dafa Maulana</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Peminjam</h7> : <h7 className="mb-0 text-secondary">Citra</h7>
              </div>		
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengajuan</h7> : <h7 className="mb-0 text-secondary">1 Desember 2025 <br />| 07:00:00 wib</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Diterima</h7> : <h7 className="mb-0 text-secondary">...</h7>
              </div>
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Batas Peminjaman</h7> : <h7 className="mb-0 text-secondary">...</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengembalian</h7> : <h7 className="mb-0 text-secondary">...</h7>
              </div>
            </div>
          </div>
          <div className="d-flex mt-1">
            <div className="p-3 pt-0 pe-1">
              <img src="assets/images/pin.png" width={15} height={15} alt />
            </div>
            <div>
              <p className="me-1">Gedung A</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lantai 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Ruang 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lemari 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Folder 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p>Nomor 1</p>
            </div>
          </div>
        </div>
        <div className="customers-list-item cursor-pointer bg-white" style={{marginBottom: 15}}>
          <div className="top d-flex align-items-center justify-content-between p-3">
            <div className="kiri" style={{alignItems: 'center'}}>
              <div className="d-flex align-items-center">
                <img src="assets/images/iconpdf.png" width={60} height={60} alt />
                <h6 className="ms-3 mb-0">PP Investasi</h6>
              </div>
            </div>
            <div className="kanan" style={{display: 'flex'}}>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, background: '#3468F8', height: 35}}>	
                <div className>
                  <p className="mb-0" style={{color: 'white'}}>Dikembalikan</p>
                </div>
              </div>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, height: 35}}>	
                <div className="kanan d-flex align-items-center">
                  <div className style={{marginRight: 10}}>
                    <p className="mb-0">Telah Dikembalikan Tepat Waktu</p>
                  </div>
                  <div className>
                    <img src="assets/images/check.png" width={15} height={15} alt />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex  justify-content-between pt-0 pb-1 p-3">
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Jenis</h7> : <h7 className="mb-0 text-secondary">File</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tipe</h7> : <h7 className="mb-0 text-secondary">Statis</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tujuan</h7> : <h7 className="mb-0 text-secondary">Print</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Petugas</h7> : <h7 className="mb-0 text-secondary">Dafa Maulana</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Peminjam</h7> : <h7 className="mb-0 text-secondary">Citra</h7>
              </div>		
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengajuan</h7> : <h7 className="mb-0 text-secondary">1 Desember 2025 <br />| 07:00:00 wib</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Diterima</h7> : <h7 className="mb-0 text-secondary">1 November 2025 <br />| 10:30:00 wib</h7>
              </div>
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Batas Peminjaman</h7> : <h7 className="mb-0 text-secondary">1 Desember <br />2025 | 18:30:00 wib</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengembalian</h7> : <h7 className="mb-0 text-secondary">...</h7>
              </div>
            </div>
          </div>
          <div className="d-flex mt-1">
            <div className="p-3 pt-0 pe-1">
              <img src="assets/images/pin.png" width={15} height={15} alt />
            </div>
            <div>
              <p className="me-1">Gedung A</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lantai 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Ruang 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lemari 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Folder 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p>Nomor 1</p>
            </div>
          </div>
        </div>
        <div className="customers-list-item cursor-pointer bg-white" style={{marginBottom: 15}}>
          <div className="top d-flex align-items-center justify-content-between p-3">
            <div className="kiri" style={{alignItems: 'center'}}>
              <div className="d-flex align-items-center">
                <img src="assets/images/iconpdf.png" width={60} height={60} alt />
                <h6 className="ms-3 mb-0">PP Investasi</h6>
              </div>
            </div>
            <div className="kanan" style={{display: 'flex'}}>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, background: '#3468F8', height: 35}}>	
                <div className>
                  <p className="mb-0" style={{color: 'white'}}>Dikembalikan</p>
                </div>
              </div>
              <div className="d-flex align-items-center border p-2 radius-10" style={{marginRight: 10, height: 35}}>	
                <div className="kanan d-flex align-items-center">
                  <div className style={{marginRight: 10}}>
                    <p className="mb-0">Telah Dikembalikan Melebihi Deadline</p>
                  </div>
                  <div className>
                    <img src="assets/images/message-warning.png" width={15} height={15} alt />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex  justify-content-between pt-0 pb-1 p-3">
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Jenis</h7> : <h7 className="mb-0 text-secondary">File</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tipe</h7> : <h7 className="mb-0 text-secondary">Statis</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Tujuan</h7> : <h7 className="mb-0 text-secondary">Print</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Petugas</h7> : <h7 className="mb-0 text-secondary">Dafa Maulana</h7>
              </div>		
              <div>
                <h7 className="mb-1 font-weight-bold">Peminjam</h7> : <h7 className="mb-0 text-secondary">Citra</h7>
              </div>		
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengajuan</h7> : <h7 className="mb-0 text-secondary">1 Desember 2025 <br />| 07:00:00 wib</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Diterima</h7> : <h7 className="mb-0 text-secondary">1 November 2025 <br />| 10:30:00 wib</h7>
              </div>
            </div>
            <div>
              <div>
                <h7 className="mb-1 font-weight-bold">Batas Peminjaman</h7> : <h7 className="mb-0 text-secondary">1 Desember <br />2025 | 18:30:00 wib</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Waktu Pengembalian</h7> : <h7 className="mb-0 text-secondary">1 November <br />2025 | 21:00:00 wib (+1 jam lebih lama)</h7>
              </div>
              <div>
                <h7 className="mb-1 font-weight-bold">Alasan</h7> : <h7 className="mb-0 text-secondary">Masih membutuhkan dokumen</h7>
              </div>
            </div>
          </div>
          <div className="d-flex mt-1">
            <div className="p-3 pt-0 pe-1">
              <img src="assets/images/pin.png" width={15} height={15} alt />
            </div>
            <div>
              <p className="me-1">Gedung A</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lantai 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Ruang 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Lemari 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p className="me-1">Folder 1</p>
            </div>
            <div>
              <img src="assets/images/Vector.png" style={{marginRight: 5}} width={5} height={10} alt />
            </div>
            <div>
              <p>Nomor 1</p>
            </div>
          </div>
        </div>
        <nav aria-label="Page navigation example" style={{display: 'flex', justifyContent: 'center'}}>
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="javascript:;" aria-label="Previous">	<span aria-hidden="true">«</span>
              </a>
            </li>
            <li className="page-item"><a className="page-link" href="javascript:;">1</a>
            </li>
            <li className="page-item"><a className="page-link" href="javascript:;">2</a>
            </li>
            <li className="page-item"><a className="page-link" href="javascript:;">3</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="javascript:;" aria-label="Next">	<span aria-hidden="true">»</span>
              </a>
            </li>
          </ul>
        </nav>
          
          {/* Modal Notifikasi Pengembalian*/}
          <div className="col">
            <div className="modal fade" id="notifikasiKembali" tabIndex={-1} aria-hidden="true">
              <div className="modal-dialog modal-sm">
                <div className="modal-content">
                  <div className="modal-header" style={{borderBottom: 'none'}}>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                  </div>
                  <div className="modal-body" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                    <h5 className="modal-title" style={{marginBottom: 15}}>Notifikasi Pengembalian</h5>
                    <img src="assets/images/bell icon.png" />
                    <h6 className="modal-isi" style={{marginBottom: 0, marginTop: 15}}>Notifikasi pengembalian kepada peminjam telah berhasil terkirim.</h6>
                  </div>
                  <div className="modal-footer" style={{borderTop: 'none'}}>
                    <button type="button" className="btn btn-primary" style={{width: '100%', borderRadius: 50}}>Oke</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
	}