import React, { useEffect } from "react";
// import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import useSeasonStore from "../stores/seasonStore";
import SelectSeason from "../components/Stats/SelectSeason";
import PersonalStats from "../components/Stats/PersonalStats";
import { useLoadingStore } from "../stores/loadingStore";
import CircularProgress from "@mui/material/CircularProgress";

const StatsPage: React.FC = () => {
  const { selectedSeason, fetchSeasons } = useSeasonStore();
  const { isLoading } = useLoadingStore();

  useEffect(() => {
    // setLoading(true);
    fetchSeasons();
    // setLoading(false);
  }, []);

  return (
    <div className="text-info-300">
      {selectedSeason ? (
        <PersonalStats />
      ) : isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : (
        <SelectSeason />
      )}
    </div>
  );
};

export default StatsPage;
