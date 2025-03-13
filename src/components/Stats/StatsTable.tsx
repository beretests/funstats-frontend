// import React, { useEffect } from "react";
// import useSeasonStore from "../../stores/seasonStore";
// import { useAlertStore } from "../../stores/alertStore";
// import { useLoadingStore } from "../../stores/loadingStore";
// import { useAuthStore } from "../../stores/authStore";
// import api from "../../services/api";
// import CircularProgress from "@mui/material/CircularProgress";
// import { Card, CardContent, Typography } from "@mui/material";

// const StatsTable: React.FC = () => {
//   const { seasons, selectedSeason, setSelectedSeason } = useSeasonStore();
//   const { user } = useAuthStore();
//   const { isLoading, setLoading } = useLoadingStore();
//   const showAlert = useAlertStore((state) => state.showAlert);

//   useEffect(() => {
//     const fetchSeasonStats = async (userId: string, seasonId: string) => {
//       setLoading(true);
//       try {
//         const stats = await api.get(`/api/${userId}/${seasonId}/stats`);
//         console.log(stats);
//         setLoading(false);
//         return stats;
//       } catch (error) {
//         console.log(error);
//         showAlert("error", (error as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     console.log("Selected", selectedSeason);
//     if (selectedSeason) {
//       fetchSeasonStats(user.id, selectedSeason.id);
//     }
//   }, []);

//   return (
//     <div>
//       <h1>StatsTable</h1>{" "}
//       {isLoading ? (
//         <div className="flex justify-center items-center h-screen">
//           <CircularProgress />
//         </div>
//       ) : (
//         <p>Not loading</p>
//       )}
//     </div>
//   );
// };

// export default StatsTable;
