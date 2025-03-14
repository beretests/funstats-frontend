import React, { useEffect, useState } from "react";
import PlayerStatComparison from "../components/PlayerStatComparison";
import useSeasonStore from "../stores/seasonStore";
import { useAuthStore } from "../stores/authStore";
import { useLoadingStore } from "../stores/loadingStore";
import { useAlertStore } from "../stores/alertStore";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../services/api";
import { useParams } from "react-router-dom";

const PlayerStatsComparisonPage: React.FC = () => {
  const { friendId } = useParams();
  const { user } = useAuthStore();
  const [players, setPlayers] = useState<[]>([]);
  const playerIds = `${user.id},${friendId}`;
  const { selectedSeason } = useSeasonStore();
  const { isLoading, setLoading } = useLoadingStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  useEffect(() => {
    const fetchPlayerFriends = async (userId: string, retries = 3) => {
      setLoading(true);
      try {
        const players = await api.get(
          `/api/${playerIds}/${selectedSeason?.id}/stats`
        );
        console.log(players);
        setPlayers(players.data);
        setLoading(false);

        // return friends;
      } catch (error) {
        console.log(error);
        if (retries > 0) {
          console.log(`Retrying... Attempts left: ${retries - 1}`);
          return fetchPlayerFriends(userId, retries - 1);
        } else {
          showAlert("error", `${(error as Error).message} Please try again.`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPlayerFriends(playerIds);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <PlayerStatComparison playersData={players} />
    </div>
  );
};

export default PlayerStatsComparisonPage;
