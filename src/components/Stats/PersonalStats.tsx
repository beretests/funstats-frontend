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

  useEffect(() => {
    const fetchSeasonStats = async (
      userId: string,
      seasonId: string,
      retries = 3
    ) => {
      setLoading(true);
      try {
        const stats = await api.get(`/api/${userId}/${seasonId}/stats`);
        console.log(stats);
        setStats(stats.data[0]);
        setLoading(false);
        return stats;
      } catch (error) {
        console.log(error);
        if (retries > 0) {
          console.log(`Retrying... Attempts left: ${retries - 1}`);
          return fetchSeasonStats(userId, seasonId, retries - 1);
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
        <div className="p-8 bg-gradient-to-br from-primary-50 to-accent-100  text-info-300">
          <h1 className="bg-info-200 bg-clip-text text-transparent drop-shadow-xl text-3xl mb-4">
            Stats for the {selectedSeason?.name} season
          </h1>
          <h4 className="text-center font-fredoka text-xl my-4 text-accent-50">
            Total games played: {stats.total_games_played}
          </h4>
          <Grid container spacing={4}>
            <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
              <StatCard
                icon={<Celebration />}
                stat={stats.total_goals}
                label="Goals"
                color="red"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
              <StatCard
                icon={<FontDownload />}
                stat={stats.total_assists}
                label="Assists"
                color="green"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
              <StatCard
                icon={<TrackChanges />}
                stat={stats.total_shots_on_target}
                label="Shots on Target"
                color="blue"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
              <StatCard
                icon={<Shield />}
                stat={stats.total_tackles}
                label="Tackles"
                color="yellow"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
              <StatCard
                icon={<Fence />}
                stat={stats.total_interceptions}
                label="Interceptions"
                color="purple"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
              <StatCard
                icon={<SportsMmaIcon />}
                stat={stats.total_saves}
                label="Saves"
                color="cyan"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
              <StatCard
                icon={<SportsKabaddi />}
                stat={stats.total_fouls}
                label="Fouls"
                color="orange"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
              <StatCard
                icon={<SportsSoccer />}
                stat={stats.total_headers_won}
                label="Headers Won"
                color="indigo"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
              <StatCard
                // icon={<EmojiEvents />}
                icon={<YellowCardIcon />}
                stat={stats.total_yellow_cards}
                label="Yellow Cards"
                color="amber"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
              <StatCard
                icon={<RedCardIcon />}
                stat={stats.total_red_cards}
                label="Red Cards"
                color="amber"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4, sm: 6, lg: 3 }}>
              <StatCard
                icon={<Flag />}
                stat={stats.total_offsides}
                label="Offsides"
                color="teal"
              />
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default PersonalStats;
