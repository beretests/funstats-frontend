import React, { useEffect } from "react";
// import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import useSeasonStore from "../stores/seasonStore";
// import SelectSeason from "../components/Stats/SelectSeason";
import PersonalStats from "../components/Stats/PersonalStats";
import { useLoadingStore } from "../stores/loadingStore";
// import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useLocation } from "react-router-dom";

const StatsPage: React.FC = () => {
  const { selectedSeason } = useSeasonStore();
  // const { isLoading } = useLoadingStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!selectedSeason) {
      navigate("/select-season", {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, []);

  return (
    <div className="text-info-300">
      {/* {isLoading ? ( */}
      {/* <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : ( */}
      <PersonalStats />
      {/* )} */}
    </div>
  );
};

export default StatsPage;
