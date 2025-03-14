import React, { useEffect } from "react";
import SelectSeason from "../components/Stats/SelectSeason";
import useSeasonStore from "../stores/seasonStore";
// import { useLocation, useNavigate } from "react-router-dom";

const SelectSeasonPage: React.FC = () => {
  const { fetchSeasons } = useSeasonStore();
  //   const navigate = useNavigate();
  //   const location = useLocation();
  //   const fromPage = location.state?.from || "/stats";

  useEffect(() => {
    fetchSeasons();
  }, []);

  //   useEffect(() => {
  //     if (selectedSeason) {
  //       navigate(fromPage, { replace: true });
  //     }
  //   }, [selectedSeason]);

  return (
    <>
      <div>
        <SelectSeason />
      </div>
    </>
  );
};

export default SelectSeasonPage;
