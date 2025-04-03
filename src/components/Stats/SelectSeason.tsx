import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import useSeasonStore from "../../stores/seasonStore";
import { useLoadingStore } from "../../stores/loadingStore";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const SelectSeason: React.FC = () => {
  const { seasons, selectedSeason, setSelectedSeason } = useSeasonStore();
  const { isLoading } = useLoadingStore();
  const navigate = useNavigate();

  const handleChange = (event: SelectChangeEvent) => {
    const season = seasons.find((s) => s.id === event.target.value);
    if (season) setSelectedSeason(season);
  };

  return (
    <div className="flex flex-col justify-center gap-4 min-h-[90vh] mt-0 py-0 px-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-[90vh]">
          <CircularProgress />
        </div>
      ) : (
        <>
          <h1 className="text-info-300">Select a season to view your stats </h1>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="season-list-label">Season</InputLabel>
            <Select
              labelId="season-list-label"
              id="season-list"
              value={selectedSeason ? selectedSeason.id : ""}
              label="Season"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Select a season</em>
              </MenuItem>
              {seasons.map((season) => (
                <MenuItem key={season.id} value={season.id}>
                  {season.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedSeason && (
            <>
              <p className="text-center">
                You have selected the <strong>{selectedSeason.name}</strong>{" "}
                season
              </p>
              <button className="button" onClick={() => navigate("/stats")}>
                View your stats
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SelectSeason;
