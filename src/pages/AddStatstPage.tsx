import React, { useEffect, useState } from "react";
import useSeasonStore from "../stores/seasonStore";
import { useAlertStore } from "../stores/alertStore";
import { useLoadingStore } from "../stores/loadingStore";
import { useAuthStore } from "../stores/authStore";
import api from "../services/api";
import StatsAutocomplete from "../components/Stats/StatsAutocomplete";
import Grid from "@mui/material/Grid2";
import { TextField } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";

interface FormSubmissionPayload {
  date: string | dayjs.Dayjs;
  playerId: string;
  homeTeamId: string;
  seasonId: string;
  awayTeamId: string;
  teamId: string;
  stats: {
    goalsScored: number;
    assists: number;
    shotsOnTarget: number;
    tackles: number;
    interceptions: number;
    saves: number;
    yellowCards: number;
    redCards: number;
    fouls: number;
    headersWon: number;
    offsides: number;
  };
  awardId?: string;
  tournamentId?: string; // Optional if an award is given to the player
}

const initialStats = {
  goalsScored: 0,
  assists: 0,
  shotsOnTarget: 0,
  tackles: 0,
  interceptions: 0,
  saves: 0,
  yellowCards: 0,
  redCards: 0,
  fouls: 0,
  headersWon: 0,
  offsides: 0,
};

const AddStatstPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [formPayload, setFormPayload] = useState<FormSubmissionPayload>({
    date: dayjs(),
    playerId: user.id,
    homeTeamId: "",
    seasonId: "",
    awayTeamId: "",
    teamId: "",
    stats: initialStats,
    awardId: undefined,
    tournamentId: undefined,
  });

  const [formOptions, setFormOptions] = useState<
    { option: string; label: string; data: any }[]
  >([]);

  const { selectedSeason } = useSeasonStore();
  const { setLoading } = useLoadingStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  const optionLabels = [
    { option: "awards", label: "Select Award", submit: "awardId" },
    { option: "clubs", label: "Select Club", submit: "clubId" },
    { option: "away_teams", label: "Select Away Team", submit: "awayTeamId" },
    { option: "seasons", label: "Select Season", submit: "seasonId" },
    { option: "home_teams", label: "Select Home Team", submit: "homeTeamId" },
    {
      option: "tournaments",
      label: "Select Tournament",
      submit: "tournamentId",
    },
  ];

  interface Option {
    id: string;
    label: string;
  }

  const [homeTeamValue, setHomeTeamValue] = useState<Option | null>(null);
  const [awayTeamValue, setAwayTeamValue] = useState<Option | null>(null);

  const [isHomeTeamChecked, setIsHomeTeamChecked] = useState(false);
  const [isAwayTeamChecked, setIsAwayTeamChecked] = useState(false);

  const handleOptionChange = (
    fieldName: keyof FormSubmissionPayload,
    value?: any
  ) => {
    setFormPayload((prev) => ({
      ...prev,
      [fieldName]: value?.id || "",
    }));

    if (fieldName === "homeTeamId") setHomeTeamValue(value || null);
    if (fieldName === "awayTeamId") setAwayTeamValue(value || null);
  };

  const handleCheckboxChange = (
    teamType: "home" | "away",
    checked: boolean
  ) => {
    if (teamType === "home") {
      setIsHomeTeamChecked(checked);
      setIsAwayTeamChecked(false); // Uncheck away team checkbox if home team is checked
      setFormPayload((prev) => ({
        ...prev,
        teamId: checked ? prev.homeTeamId : "",
      }));
    } else if (teamType === "away") {
      setIsAwayTeamChecked(checked);
      setIsHomeTeamChecked(false); // Uncheck home team checkbox if away team is checked
      setFormPayload((prev) => ({
        ...prev,
        teamId: checked ? prev.awayTeamId : "",
      }));
    }
  };

  const handleStatChange =
    (field: keyof typeof initialStats) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormPayload((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          [field]: Number(event.target.value),
        },
      }));
    };

  const handleDateChange = (newDate: Dayjs | null) => {
    setFormPayload((prev) => ({
      ...prev,
      date: newDate?.format("YYYY-MM-DD") || dayjs(),
    }));
  };

  const handleSubmit = async (retries = 3) => {
    console.log("Form Submission Payload:", formPayload);
    setLoading(true);
    try {
      const submitted = await api.post("/api/stats/add", formPayload);
      console.log("Submitted:", submitted);
      navigate("/stats");
      showAlert("success", `${submitted.data.message}`);
    } catch (error) {
      console.log(error);
      if (retries > 0) {
        console.log(`Retrying... Attempts left: ${retries - 1}`);
        return handleSubmit(retries - 1);
      } else {
        showAlert("error", `${(error as Error).message} Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFormOptions = async (
      userId: string,
      seasonId: string,
      retries = 3
    ) => {
      setLoading(true);
      try {
        const response = await api.get(`/api/stats/add/options`, {
          params: {
            userId,
            seasonId,
          },
        });

        const options = Object.keys(response.data).map((key) => ({
          option: optionLabels.find((o) => o.option === key)?.submit || key,
          label: optionLabels.find((o) => o.option === key)?.label || key,
          data: response.data[key],
        }));
        console.log(options);
        setFormOptions(options);
        setLoading(false);
      } catch (error) {
        console.log(error);
        if (retries > 0) {
          console.log(`Retrying... Attempts left: ${retries - 1}`);
          return fetchFormOptions(userId, seasonId, retries - 1);
        } else {
          showAlert("error", `${(error as Error).message} Please try again.`);
        }
      } finally {
        setLoading(false);
      }
    };
    if (selectedSeason) {
      fetchFormOptions(user.id, selectedSeason.id);
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-info-300">Add new game stats</h1>
      <div className="p-4">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4, sm: 6, lg: 3 }}>
            <DatePicker
              label="Game Date"
              value={dayjs(formPayload.date)}
              onChange={handleDateChange}
              slotProps={{
                textField: { fullWidth: true },
                layout: {
                  sx: { color: "#bbdefb", backgroundColor: "#0d47a1" },
                },
              }}
              disableFuture
            />
          </Grid>
          {formOptions.map((item, index) => (
            <Grid key={index} size={{ xs: 12, md: 4, sm: 6, lg: 3 }}>
              <StatsAutocomplete
                label={item.label}
                options={item.data}
                checkbox={item.option}
                onChange={(value) =>
                  handleOptionChange(
                    item.option as keyof FormSubmissionPayload,
                    value
                  )
                }
                onCheckboxChange={(checked) =>
                  handleCheckboxChange(
                    item.option === "homeTeamId" ? "home" : "away",
                    checked
                  )
                }
                isCheckboxDisabled={
                  item.option === "homeTeamId"
                    ? !homeTeamValue
                    : item.option === "awayTeamId"
                    ? !awayTeamValue
                    : true
                }
                isCheckboxChecked={
                  item.option === "homeTeamId"
                    ? isHomeTeamChecked
                    : item.option === "awayTeamId"
                    ? isAwayTeamChecked
                    : false
                }
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <div className="p-4 flex flex-col justify-center items-center gap-4">
        <Grid container spacing={2}>
          {Object.keys(initialStats).map((key) => (
            <Grid size={{ xs: 6, md: 3, sm: 4, lg: 2 }} key={key}>
              <TextField
                label={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                value={formPayload.stats[key as keyof typeof initialStats]}
                onChange={handleStatChange(key as keyof typeof initialStats)}
                type="number"
                fullWidth
                variant="outlined"
                slotProps={{
                  htmlInput: {
                    min: 0,
                    onKeyDown: (e: {
                      key: string;
                      preventDefault: () => void;
                    }) => {
                      if (e.key === "-" || e.key === "e" || e.key === ".")
                        e.preventDefault();
                    },
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
        <button className="button md:w-50" onClick={() => handleSubmit()}>
          Add New Game Stat
        </button>
      </div>
    </div>
  );
};

export default AddStatstPage;
