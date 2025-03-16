import React, { useEffect, useState } from "react";
import useSeasonStore from "../../stores/seasonStore";
import { useAlertStore } from "../../stores/alertStore";
import { useLoadingStore } from "../../stores/loadingStore";
import { useAuthStore } from "../../stores/authStore";
import api from "../../services/api";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import StatCard from "./StatCard";
import {
  // SportsScore,
  // AssistantPhoto,
  // SportsHockey,
  Shield,
  // Block,
  // Save,
  Flag,
  Celebration,
  SportsKabaddi,
  SportsSoccer,
  // EmojiEvents,
  // SportsVolleyball,
  TrackChanges,
  FontDownload,
  Fence,
} from "@mui/icons-material";
import YellowCardIcon from "../YellowCardIcon";
import RedCardIcon from "../RedCardIcon";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import { useNavigate } from "react-router-dom";
import { Card, CardActions } from "@mui/material";

interface GameStats {
  player_id: string;
  total_goals: string;
  total_assists: string;
  total_shots_on_target: string;
  total_tackles: string;
  total_interceptions: string;
  total_saves: string;
  total_yellow_cards: string;
  total_red_cards: string;
  total_fouls: string;
  total_headers_won: string;
  total_offsides: string;
  total_games_played: string;
}

const PersonalStats: React.FC = () => {
  const navigate = useNavigate();
  const { selectedSeason } = useSeasonStore();
  const { user } = useAuthStore();
  const { isLoading, setLoading } = useLoadingStore();
  const showAlert = useAlertStore((state) => state.showAlert);
  const [stats, setStats] = useState<GameStats>({
    player_id: "",
    total_goals: "",
    total_assists: "",
    total_shots_on_target: "",
    total_tackles: "",
    total_interceptions: "",
    total_saves: "",
    total_yellow_cards: "",
    total_red_cards: "",
    total_fouls: "",
    total_headers_won: "",
    total_offsides: "",
    total_games_played: "",
  });

  // const [isExpanded, setIsExpanded] = useState(false);

  const statItems = [
    {
      icon: <Celebration />,
      stat: stats?.total_goals || "0",
      label: "Goals",
      color: "fail",
    },
    {
      icon: <FontDownload />,
      stat: stats?.total_assists || "0",
      label: "Assists",
      color: "green",
    },
    {
      icon: <TrackChanges />,
      stat: stats?.total_shots_on_target || "0",
      label: "Shots on Target",
      color: "blue",
    },
    {
      icon: <Shield />,
      stat: stats?.total_tackles || "0",
      label: "Tackles",
      color: "yellow",
    },
    {
      icon: <Fence />,
      stat: stats?.total_interceptions || "0",
      label: "Interceptions",
      color: "purple",
    },
    {
      icon: <SportsMmaIcon />,
      stat: stats?.total_saves || "0",
      label: "Saves",
      color: "cyan",
    },
    {
      icon: <SportsKabaddi />,
      stat: stats?.total_fouls || "0",
      label: "Fouls",
      color: "orange",
    },
    {
      icon: <SportsSoccer />,
      stat: stats?.total_headers_won || "0",
      label: "Headers Won",
      color: "indigo",
    },
    {
      icon: <YellowCardIcon />,
      stat: stats?.total_yellow_cards || "0",
      label: "Yellow Cards",
      color: "amber",
    },
    {
      icon: <RedCardIcon />,
      stat: stats?.total_red_cards || "0",
      label: "Red Cards",
      color: "amber",
    },
    {
      icon: <Flag />,
      stat: stats?.total_offsides || "0",
      label: "Offsides",
      color: "teal",
    },
  ];

  useEffect(() => {
    const fetchSeasonStats = async (
      playerIds: string,
      seasonId: string,
      retries = 3
    ) => {
      setLoading(true);
      try {
        const stats = await api.get(`/api/stats`, {
          params: {
            playerIds,
            seasonId,
          },
        });
        console.log(stats);
        setStats(stats.data[0]);
        setLoading(false);
        return stats;
      } catch (error) {
        console.log(error);
        if (retries > 0) {
          console.log(`Retrying... Attempts left: ${retries - 1}`);
          return fetchSeasonStats(playerIds, seasonId, retries - 1);
        } else {
          showAlert("error", `${(error as Error).message} Please try again.`);
        }
      } finally {
        setLoading(false);
      }
    };
    if (selectedSeason) {
      fetchSeasonStats(user.id, selectedSeason.id);
    }
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : (
        <div className="min-h-screen p-8 bg-gradient-to-br from-primary-50 to-accent-100  text-info-300 flex flex-col justify-center items-center transition ease-in-out duration-300">
          <h1 className="bg-info-200 bg-clip-text text-transparent drop-shadow-xl md:text-3xl mb-4">
            My Stats for the {selectedSeason?.name} season
          </h1>
          <div className="w-full text-center mb-4">
            <button
              onClick={() => navigate("/select-season")}
              className="button shadow-md hover:bg-accent-300 transition"
            >
              Select New Season
            </button>
          </div>
          <h4 className="text-center font-fredoka text-xl my-4 text-accent-50">
            Total games played: {stats?.total_games_played || "0"}
          </h4>

          <Grid container spacing={4}>
            <Grid
              display="flex"
              justifyContent="center"
              alignItems="center"
              size="grow"
            >
              <Card
                raised
                className={`bg-neutral-100 h-full w-full flex !justify-center !rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 py-[43px]`}
              >
                <CardActions>
                  <button
                    className="button"
                    onClick={() => navigate("/stats/add")}
                  >
                    Add New Stat
                  </button>
                </CardActions>
              </Card>
            </Grid>
            {/* <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
                <StatCard
                  icon={<Celebration />}
                  stat={stats?.total_goals || "0"}
                  label="Goals"
                  color="fail"
                />
              </Grid> */}
            {statItems.map((item, index) => (
              <Grid key={index} size={{ xs: 12, md: 4, sm: 6, lg: 3 }}>
                <StatCard
                  icon={item.icon}
                  stat={item.stat}
                  label={item.label}
                  color={item.color}
                />
              </Grid>
            ))}
          </Grid>
          {/* )} */}
        </div>
      )}
    </div>
  );
};

export default PersonalStats;
