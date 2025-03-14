import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadingStore } from "../stores/loadingStore";
import { useAlertStore } from "../stores/alertStore";
import { useAuthStore } from "../stores/authStore";
import api from "../services/api";
import { calculateAge } from "../utils/dateUtils";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

interface Friend {
  id: string;
  avatar_url: string;
  username: string;
  full_name: string;
  date_of_birth: number;
  friendship_date: number;
  position: string;
}

const FriendsPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [friends, setFriends] = useState<Friend[]>([]);
  const { isLoading, setLoading } = useLoadingStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  useEffect(() => {
    const fetchPlayerFriends = async (userId: string, retries = 3) => {
      setLoading(true);
      try {
        const friends = await api.get(`/api/${userId}/friends`);
        console.log(friends);
        setFriends(friends.data);
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
    fetchPlayerFriends(user.id);
  }, []);

  const handleCompareStats = (friendId: string) => {
    navigate(`/compare-stats/${friendId}`);
  };

  return (
    <div className="bg-soccerGreen min-h-screen p-6">
      <h1 className="text-center text-soccerYellow text-4xl font-bold mb-6">
        Soccer Buddies
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {friends.map((friend, index) => (
          <Card
            key={index}
            raised
            sx={{ maxHeight: 300, maxWidth: 290 }}
            className="!bg-accent-200/40 !rounded-xl"
          >
            <CardMedia
              sx={{ height: 170, objectFit: "auto" }}
              image={friend.avatar_url}
              title={friend.username}
            />
            <CardContent
              className="flex flex-col items-center !pt-2"
              sx={{ maxHeight: 90 }}
            >
              <Typography
                variant="h6"
                className="mt-4 font-bold bg-primary-50 bg-clip-text text-transparent drop-shadow-2xl"
                sx={{ fontFamily: "Fredoka" }}
              >
                {friend.username}
              </Typography>
              <Typography
                variant="body1"
                className="text-info-300 text-2xl"
                sx={{ fontFamily: "BubblegumSans" }}
              >
                {friend.full_name}
              </Typography>
              <Typography
                variant="body2"
                className="text-info-300 font-special"
                sx={{ fontFamily: "BubblegumSans" }}
              >
                Age: {calculateAge(friend.date_of_birth)}
              </Typography>
              <Typography
                variant="body2"
                className="text-info-300 font-special"
                sx={{ fontFamily: "BubblegumSans" }}
              >
                Friends Since:{" "}
                {new Date(friend.friendship_date).toISOString().split("T")[0]}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifySelf: "center" }} className="!pt-0">
              <Button
                size="small"
                className="!text-info-500 !bg-primary-200/80 !rounded-lg !normal-case !shadow-lg !px-2"
                onClick={() => handleCompareStats(friend.id)}
              >
                Compare Stats
              </Button>
            </CardActions>
          </Card>
        ))}
        <Card
          raised
          sx={{ maxHeight: 300, maxWidth: 290, alignContent: "center" }}
          className="!rounded-xl"
        >
          <CardActions sx={{ justifySelf: "center", my: "auto" }}>
            <Button
              size="large"
              className="!text-info-500 !bg-primary-200/80 !rounded-lg !normal-case !shadow-lg"
            >
              Add New Buddy
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

export default FriendsPage;
