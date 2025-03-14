import React, { useEffect, useState } from "react";
import PlayerStatComparison from "../components/PlayerStatComparison";
import useSeasonStore from "../stores/seasonStore";
import { useAuthStore } from "../stores/authStore";
import { useLoadingStore } from "../stores/loadingStore";
import { useAlertStore } from "../stores/alertStore";
// import CircularProgress from "@mui/material/CircularProgress";
import api from "../services/api";
import { useParams } from "react-router-dom";

const PlayerStatsComparisonPage: React.FC = () => {
  const { friendId, friendUsername } = useParams();
  const { user, username } = useAuthStore();
  const [players, setPlayers] = useState<[]>([]);
  const playerIds = `${user.id},${friendId}`;
  const { selectedSeason } = useSeasonStore();
  const { setLoading } = useLoadingStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  const usersWithUsernames = [
    { id: `${user.id}`, username: `${username}` },
    { id: `${friendId}`, username: `${friendUsername}` },
  ];

  useEffect(() => {
    const fetchPlayerFriends = async (userId: string, retries = 3) => {
      setLoading(true);
      try {
        const response = await api.get(
          `/api/${playerIds}/${selectedSeason?.id}/stats`
        );
        const playersWithUsernames = response.data.map(
          (player: { player_id: any }) => ({
            ...player,
            username: usersWithUsernames.find(
              (u: { id: string; username: string }) => u.id === player.player_id
            )?.username,
          })
        );
        setPlayers(playersWithUsernames);
        setLoading(false);
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
