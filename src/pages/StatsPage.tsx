import React, { useEffect } from "react";
import useSeasonStore from "../stores/seasonStore";
import PersonalStats from "../components/Stats/PersonalStats";
import { useNavigate, useLocation } from "react-router-dom";

const StatsPage: React.FC = () => {
  const { selectedSeason } = useSeasonStore();
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
      <PersonalStats />
    </div>
  );
};

export default StatsPage;
