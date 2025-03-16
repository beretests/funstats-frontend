import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadingStore } from "../stores/loadingStore";
import { useAlertStore } from "../stores/alertStore";
import { useAuthStore } from "../stores/authStore";
import api from "../services/api";
// import { calculateAge } from "../utils/dateUtils";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Modal,
  Box,
  TextField,
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
  const [modalOpen, setModalOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const { setLoading } = useLoadingStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  // const [error, setError] = useState("");
  const [friendUsername, setFriendUsername] = useState("");

  const positionGroups = {
    Goalkeeper: ["Goalkeeper", "GK"],
    Defender: ["Defender", "CB", "RB", "RWB", "LB", "LWB"],
    Midfielder: ["Midfielder", "CAM", "CDM", "CM"],
    Forward: ["Forward", "ST", "LW", "RW"],
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => {
    setModalOpen(false);
    setFriendUsername("");
    // setError("");
  };

  const handleAddFriend = async (friendUsername: string) => {
    try {
      const response = await api.post(`/api/${user.id}/friends/add`, {
        friendUsername,
      });
      if (response.data) {
        setFriends([...friends, response.data.friend]);
        handleClose();
        showAlert("success", "Successfully added friend.");
      } else {
        showAlert("error", "Failed to fetch profile. Please try again.");
      }
    } catch (err) {
      showAlert("error", "An error occurred. Please try again.");
    }
  };

  // const handleRemoveFriend = async (friendUsername: string) => {
  //   try {
  //     const response = await api.delete(`/api/${user.id}/friends/remove`, {
  //       params: { friendUsername },
  //     });
  //     if (response.data) {
  //       setFriends(
  //         friends.filter((friend) => friend.username === friendUsername)
  //       );
  //       handleClose();
  //       showAlert("success", "Successfully added friend.");
  //     } else {
  //       showAlert("error", "Failed to fetch profile. Please try again.");
  //     }
  //   } catch (err) {
  //     showAlert("error", "An error occurred. Please try again.");
  //   }
  // };

  const getPositionCategory = (position: string) => {
    for (const [category, positions] of Object.entries(positionGroups)) {
      if (positions.includes(position)) return category;
    }
    return "Unknown"; // Default case
  };
  const colors = {
    Goalkeeper: "!bg-green-500/80 !text-white",
    Defender: "!bg-blue-500/80 !text-white",
    Midfielder: "!bg-yellow-500/70 !text-info-300",
    Forward: "!bg-red-500/80 !text-white",
  };

  const getPositionColor = (positionCategory: keyof typeof colors) => {
    return colors[positionCategory] || "bg-gray-500"; // Default fallback
  };

  useEffect(() => {
    const fetchPlayerFriends = async (userId: string, retries = 3) => {
      setLoading(true);
      try {
        const friends = await api.get(`/api/${userId}/friends`);
        console.log(friends);
        setFriends(friends.data);
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
    fetchPlayerFriends(user.id);
  }, []);

  const handleCompareStats = (friendId: string, friendUsername: string) => {
    navigate(`/compare-stats/${friendId}/${friendUsername}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-4">
      <h1 className="text-center text-info-300 text-4xl font-bold mb-6">
        My Soccer Buddies
      </h1>
      <div className="p-4 text-center mb-4">
        <p className="text-neutral-50 text-sm font-fredoka mb-4">
          Each buddy card is color-coded based on their position.
        </p>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          <p className="bg-green-500/80 text-white px-2 py-1 font-bold rounded-md inline-block text-xs">
            🟢 Goalkeepers – Protect the net
          </p>
          <p className="bg-blue-500/80 text-white px-2 py-1 font-bold rounded-md inline-block text-xs">
            🔵 Defenders – Hold the backline
          </p>
          <p className="bg-yellow-500/70 text-info-300 font-bold px-2 py-1 rounded-md inline-block text-xs">
            🟡 Midfielders – Control the game
          </p>
          <p className="bg-red-500/80 text-white font-bold px-2 py-1 rounded-md inline-block text-xs">
            🔴 Forwards – Lead the attack
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card
          raised
          sx={{ height: 300, minWidth: 300, alignContent: "center" }}
          className="!rounded-xl"
        >
          <CardActions className="!justify-center ">
            <Button
              size="large"
              className="!text-info-500 !bg-primary-200/80 !rounded-lg !normal-case !shadow-lg !justify-self-center"
              onClick={handleOpen}
            >
              Add New Buddy
            </Button>
          </CardActions>
        </Card>

        <Modal open={modalOpen} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: "10px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" mb={2}>
              Enter Friend's Username
            </Typography>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
            />
            {/* {error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )} */}
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                onClick={() => handleAddFriend(friendUsername)}
              >
                Add Buddy
              </Button>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        {friends.map((friend, index) => {
          const positionCategory = getPositionCategory(friend.position);
          const bgColor = getPositionColor(
            positionCategory as keyof typeof colors
          );
          return (
            <Card
              key={index}
              raised
              sx={{ maxHeight: 300, maxWidth: 300 }}
              className={`${bgColor} !rounded-xl`}
            >
              <CardMedia
                sx={{ height: 170, objectFit: "auto" }}
                image={friend.avatar_url}
                title={friend.username}
                className="bg-neutral-300"
              />
              <CardContent
                className="flex flex-col items-center !pt-1"
                sx={{ height: 90 }}
              >
                <Typography
                  variant="h6"
                  className={`mt-4 font-bold ${bgColor} drop-shadow-2xl`}
                  sx={{ fontFamily: "BubblegumSans" }}
                >
                  {friend.username}
                </Typography>
                <Typography
                  variant="body1"
                  className={`${bgColor} text-2xl !font-bold`}
                  sx={{ fontFamily: "Fredoka" }}
                >
                  {friend.full_name}
                </Typography>
                <Typography
                  variant="body2"
                  className={`${bgColor} font-special !font-bold`}
                  sx={{ fontFamily: "Nunito" }}
                >
                  Friends Since:{" "}
                  {new Date(friend?.friendship_date).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions className="!pt-0 !px-6 !justify-between">
                <Button
                  size="small"
                  className="!text-info-500 !bg-primary-200/80 !rounded-lg !normal-case !shadow-lg !px-2"
                  onClick={() => handleCompareStats(friend.id, friend.username)}
                >
                  Compare Stats
                </Button>
                <Button
                  size="small"
                  className="!text-info-500 !bg-primary-200/80 !rounded-lg !normal-case !shadow-lg !px-2"
                  onClick={() => navigate("/friends")}
                >
                  Remove Friend
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FriendsPage;
