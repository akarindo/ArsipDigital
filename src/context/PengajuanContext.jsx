import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const PengajuanContext = createContext();

export const usePengajuan = () => {
  const context = useContext(PengajuanContext);
  if (!context) {
    throw new Error("usePengajuan must be used within PengajuanProvider");
  }
  return context;
};

export const PengajuanProvider = ({ children }) => {
  // --- States ---
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const [floorBuild, setFloorBuild] = useState([]);
  const [roomBuild, setRoomBuild] = useState([]);
  const [folderBuild, setFolderBuild] = useState([]);
  const [shelfBuild, setShelfBuild] = useState([]);
  const [cabinetBuild, setCabinetBuild] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [masterData, setMasterData] = useState({
    gedungs: [],
    types: [],
    semuaJenis: [],
    codes: [],
    categories: [],
    names: [],
    users: [],
    tujuans: [],
    pinjamans: [],
    arsips: [],
  });

  const [isEdit, setIsEdit] = useState(false);
  const [currentUuid, setCurrentUuid] = useState(null);
  const [formDataArsip, setFormDataArsip] = useState({
    file: null,
    name_uuid: null,
    tipe_arsip: null,
    judul_arsip: null,
    jenis_arsip: null,
    kategori_arsip: null,
    gedung_uuid: null,
    lantai_uuid: null,
    ruang_uuid: null,
    lemari_uuid: null,
    rak_uuid: null,
    folder_uuid: null,
    kode_arsip: null,
    keterangan: null,
  });
  const apiFetch = useCallback(async (endpoint, authToken) => {
    setIsLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/${endpoint}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    const result = await response.json();

    if (!response.ok)
      throw new Error(result.message || `Fetch ${endpoint} Gagal`);
    return result;
  }, []);

  // --- Core Fetch Function (Parallel) ---
  const getAllMasterData = useCallback(
    async (authToken) => {
      if (!authToken) return;

      try {
        // Menjalankan semua request secara paralel (Jauh lebih cepat)
        const [
          gedungs,
          types,
          jenis,
          codes,
          categories,
          names,
          users,
          tujuans,
          pinjamans,
          arsips,
        ] = await Promise.all([
          apiFetch("buildings", authToken),
          apiFetch("tipe", authToken),
          apiFetch("jenis", authToken),
          apiFetch("kode", authToken),
          apiFetch("kategori", authToken),
          apiFetch("names", authToken),
          apiFetch("users", authToken),
          apiFetch("tujuans", authToken),
          apiFetch("peminjamans", authToken),
          apiFetch("arsips", authToken),
        ]);

        setMasterData({
          gedungs,
          types,
          semuaJenis: jenis,
          codes,
          categories,
          names,
          users,
          tujuans,
          pinjamans,
          arsips,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching master data:", error.message);
      }
    },
    [apiFetch],
  );

  // --- Derived State (Flattening Data) ---
  // Menggunakan useMemo agar proses looping gedung hanya jalan jika masterData.gedungs berubah
  const flattenedGedung = useMemo(() => {
    const data = {
      floors: [],
      rooms: [],
      cabinets: [],
      shelves: [],
      folders: [],
    };

    masterData.gedungs.forEach((g) => {
      g.floors?.forEach((f) => {
        data.floors.push(f);
        f.rooms?.forEach((r) => {
          data.rooms.push(r);
          r.cabinets?.forEach((c) => {
            data.cabinets.push(c);
            c.shelves?.forEach((s) => {
              data.shelves.push(s);
              s.folders?.forEach((fold) => data.folders.push(fold));
            });
          });
        });
      });
    });
    return data;
  }, [masterData.gedungs]);
  function handleChangeBuild(uuid) {
    const filterFloor = flattenedGedung?.floors?.filter(
      (floor) => floor.building_uuid == uuid,
    );
    setFloorBuild(filterFloor);
  }
  function handleChangeFloor(uuid) {
    const filterRoom = flattenedGedung.rooms?.filter(
      (room) => room.floor_uuid == uuid,
    );
    setRoomBuild(filterRoom);
  }
  function handleChangeRoom(uuid) {
    const filterCabinet = flattenedGedung.cabinets?.filter(
      (cabinet) => cabinet.room_uuid == uuid,
    );
    setCabinetBuild(filterCabinet);
  }
  function handleChangeCabinet(uuid) {
    const filterShelf = flattenedGedung.shelves?.filter(
      (shelf) => shelf.cabinet_uuid == uuid,
    );
    setShelfBuild(filterShelf);
  }
  function handleChangeShelf(uuid) {
    const filterFolder = flattenedGedung.folders?.filter(
      (folder) => folder.shelf_uuid == uuid,
    );
    setFolderBuild(filterFolder);
  }
  // --- Handlers ---
  const handleEdit = (item) => {
    setIsEdit(true);
    setCurrentUuid(item.uuid);
    setFormDataArsip({
      file: item.file,
      name_uuid: item?.names?.name,
      tipe_arsip: item.tipe_arsip,
      judul_arsip: item.judul_arsip,
      jenis_arsip: item.jenis_arsip,
      kategori_arsip: item.kategori_arsip,
      gedung_uuid: item?.gedung?.name,
      lantai_uuid: item?.lantai?.name,
      ruang_uuid: item?.ruang?.name,
      lemari_uuid: item?.lemari?.name,
      rak_uuid: item?.shelf?.name,
      folder_uuid: item?.folder?.name,
      kode_arsip: item.kode_arsip,
      keterangan: item.keterangan,
    });
    // setFormDataArsip({ ...item });
  };

  const handleDelete = async (item) => {
    if (
      !window.confirm(
        "Peringatan: Menghapus item ini akan menghapus semua sub-item!",
      )
    )
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/arsips/${item.uuid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error("Gagal menghapus");
      alert("Berhasil menghapus data arsip");
      getAllMasterData(token); // Refresh data
    } catch (error) {
      console.error("Delete Gagal:", error.message);
    }
  };
  // --- Effects ---
  useEffect(() => {
    const auth = localStorage.getItem("token");
    if (auth && !token) {
      setToken(auth);
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }

    if (token) {
      getAllMasterData(token);
    }
  }, [token, getAllMasterData]);

  // --- Context Value ---
  const contextValue = useMemo(
    () => ({
      ...masterData,
      ...flattenedGedung,
      role,
      user,
      token,
      isEdit,
      isLoading,
      setIsEdit,
      floorBuild,
      folderBuild,
      roomBuild,
      cabinetBuild,
      shelfBuild,
      setToken,
      setRole,
      setUser,
      handleChangeBuild: (uuid) => handleChangeBuild(uuid),
      handleChangeFloor: (uuid) => handleChangeFloor(uuid),
      handleChangeRoom: (uuid) => handleChangeRoom(uuid),
      handleChangeCabinet: (uuid) => handleChangeCabinet(uuid),
      handleChangeShelf: (uuid) => handleChangeShelf(uuid),
      currentUuid,
      formDataArsip,
      setFormDataArsip,
      handleEdit,
      handleDelete,
      refreshData: () => getAllMasterData(token),
    }),
    [
      masterData,
      flattenedGedung,
      role,
      user,
      floorBuild,
      folderBuild,
      roomBuild,
      cabinetBuild,
      shelfBuild,
      handleChangeBuild,
      handleChangeFloor,
      handleChangeRoom,
      handleChangeCabinet,
      handleChangeShelf,
      isLoading,
      token,
      isEdit,
      setToken,
      setRole,
      setUser,
      currentUuid,
      formDataArsip,
      getAllMasterData,
    ],
  );

  return (
    <PengajuanContext.Provider value={contextValue}>
      {children}
    </PengajuanContext.Provider>
  );
};
