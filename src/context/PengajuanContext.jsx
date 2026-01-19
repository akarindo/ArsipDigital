import { createContext, useContext, useEffect, useState } from 'react';

export const PengajuanContext = createContext();

export const usePengajuan = () => {
  const context = useContext(PengajuanContext);
  if (!context) {
    throw new Error('usePengajuan must be used within PengajuanProvider');
  }
  return context;
};

export const PengajuanProvider = ({ children }) => {
  const [pengajuanList, setPengajuanList] = useState([
    // Data dummy untuk demo
    {
      id: 1,
      namaArsip: "PP Investasi",
      namaPetugas: "Dafa Maulana",
      jenis: "File",
      tipe: "Statis",
      tujuan: "Print",
      lemari: "1",
      rak: "1",
      nomor: "1",
      gedung: "A",
      lantai: "1",
      ruang: "1",
      folder: "1",
      waktuPengajuan: "1 Desember 2025 | 07:00:00 wib",
      waktuDiterima: "1 November 2025 | 10:30:00 wib",
      batasPeminjaman: "1 Desember 2025 | 18:30:00 wib",
      waktuPengembalian: null,
      status: "Disetujui",
      subStatus: "Sedang Dipinjam",
      sisaWaktu: "4 jam : 24 menit : 30 detik",
      alasan: null
    },
    {
      id: 2,
      namaArsip: "PP Investasi",
      namaPetugas: "Dafa Maulana",
      jenis: "File",
      tipe: "Statis",
      tujuan: "Print",
      lemari: "1",
      rak: "1",
      nomor: "1",
      gedung: "A",
      lantai: "1",
      ruang: "1",
      folder: "1",
      waktuPengajuan: "1 Desember 2025 | 07:00:00 wib",
      waktuDiterima: "1 November 2025 | 10:30:00 wib",
      batasPeminjaman: "1 Desember 2025 | 18:30:00 wib",
      waktuPengembalian: null,
      status: "Belum Dikembalikan",
      subStatus: "Sedang Dipinjam",
      sisaWaktu: "+4 jam : 24 menit : 30 detik",
      alasan: null
    },
    {
      id: 3,
      namaArsip: "PP Investasi",
      namaPetugas: "Dafa Maulana",
      jenis: "File",
      tipe: "Statis",
      tujuan: "Print",
      lemari: "1",
      rak: "1",
      nomor: "1",
      gedung: "A",
      lantai: "1",
      ruang: "1",
      folder: "1",
      waktuPengajuan: "1 Desember 2025 | 07:00:00 wib",
      waktuDiterima: null,
      batasPeminjaman: null,
      waktuPengembalian: null,
      status: "Menunggu Persetujuan",
      subStatus: null,
      sisaWaktu: null,
      alasan: null
    }
  ]);

  const [gedungs, setGedungs] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [token, setToken] = useState('')
  async function getGedung(token) {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/buildings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const result = await response.json();
      console.log("result", result)
      if (!response.ok) {
        throw new Error(result.message || 'Login Gagal');
      }
      setGedungs(result);
    } catch (error) {
      // 'error.message' akan berisi pesan dari 'throw new Error' di atas
      console.error('Login Gagal:', error.message);
    }
  }
  async function getFloors(token) {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/floors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const result = await response.json();
      console.log("result", result)
      if (!response.ok) {
        throw new Error(result.message || 'Login Gagal');
      }
      setFloors(result);
    } catch (error) {
      // 'error.message' akan berisi pesan dari 'throw new Error' di atas
      console.error('Login Gagal:', error.message);
    }
  }
  async function getRooms(token) {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/rooms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const result = await response.json();
      console.log("result", result)
      if (!response.ok) {
        throw new Error(result.message || 'Login Gagal');
      }
      setRooms(result);
    } catch (error) {
      // 'error.message' akan berisi pesan dari 'throw new Error' di atas
      console.error('Login Gagal:', error.message);
    }
  }
  const addPengajuan = (data) => {
    const newPengajuan = {
      id: Date.now(),
      ...data,
      waktuPengajuan: new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(',', '|') + ' wib',
      waktuDiterima: null,
      batasPeminjaman: null,
      waktuPengembalian: null,
      status: "Menunggu Persetujuan",
      subStatus: null,
      sisaWaktu: null,
      alasan: null
    };
    setPengajuanList(prev => [...prev, newPengajuan]);
    return newPengajuan;
  };

  const updatePengajuan = (id, updates) => {
    setPengajuanList(prev =>
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const deletePengajuan = (id) => {
    setPengajuanList(prev => prev.filter(item => item.id !== id));
  };
  useEffect(() => {
    const auth = localStorage.getItem("token");
    if (auth) {
      setToken(auth)
      getGedung(auth)
      getFloors(auth)
      getRooms(auth)
    }
  }, [])
  return (
    <PengajuanContext.Provider value={{
      pengajuanList,
      addPengajuan,
      updatePengajuan,
      deletePengajuan,
      gedungs,
      token,
      getGedung,
      floors,
      getFloors,
      rooms, getRooms
    }}>
      {children}
    </PengajuanContext.Provider>
  );
};