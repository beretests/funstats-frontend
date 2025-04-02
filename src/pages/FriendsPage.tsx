import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadingStore } from "../stores/loadingStore";
import { useAlertStore } from "../stores/alertStore";
import { useAuthStore } from "../stores/authStore";
import api from "../services/api";
import CustomModal from "../components/CustomModal";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  CircularProgress,
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
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const { isLoading, setLoading } = useLoadingStore();
  const showAlert = useAlertStore((state) => state.showAlert);
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);

  const [error, setError] = useState("");

  const positionGroups = {
    Goalkeeper: ["Goalkeeper", "GK"],
    Defender: ["Defender", "CB", "RB", "RWB", "LB", "LWB"],
    Midfielder: ["Midfielder", "CAM", "CDM", "CM"],
    Forward: ["Forward", "ST", "LW", "RW"],
  };

  const handleClose = () => {
    setModalAddOpen(false);
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
        showAlert("error", "Failed to add friend. Please try again.");
      }
    } catch (err) {
      setError((err as Error).message);
      showAlert("error", "An error occurred. Please try again.");
    }
  };

  const handleRemoveFriend = async (friendUsername: string) => {
    try {
      const response = await api.delete(`/api/${user.id}/friends/`, {
        params: { friendUsername },
      });
      if (response.data) {
        setFriends(
          friends.filter((friend) => friend.username !== friendUsername)
        );
        handleClose();
        showAlert("success", "Successfully removed friend.");
      } else {
        showAlert("error", "Failed to remove friend. Please try again.");
      }
    } catch (err) {
      console.log(err);
      showAlert("error", "An error occurred. Please try again.");
    }
  };

  const getPositionCategory = (position: string) => {
    for (const [category, positions] of Object.entries(positionGroups)) {
      if (positions.includes(position)) return category;
    }
    return "Unknown";
  };
  const colors = {
    Goalkeeper: "!bg-green-500/80",
    Defender: "!bg-blue-500/80",
    Midfielder: "!bg-purple-500/70",
    Forward: "!bg-red-500/80",
  };

  const getPositionColor = (positionCategory: keyof typeof colors) => {
    return colors[positionCategory] || "bg-gray-500";
  };

  useEffect(() => {
    const fetchPlayerFriends = async (userId: string) => {
      setLoading(true);
      try {
        const friends = await api.get(`/api/${userId}/friends`);
        console.log(friends);
        setFriends(friends.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        showAlert("error", `${(error as Error).message} Please try again.`);
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
      {isLoading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="p-2 md:px-20 p text-center mb-4">
            <p className="text-neutral-50 text-sm font-fredoka mb-4">
              Each buddy card is color-coded based on the position they play.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <p className="bg-green-500/80 text-white px-2 py-1 font-bold rounded-md inline-block text-sm drop-shadow-md">
                🟢 Goalkeepers – Protect the net
              </p>
              <p className="bg-blue-500/80 text-white px-2 py-1 font-bold rounded-md inline-block text-sm drop-shadow-md">
                🔵 Defenders – Hold the backline
              </p>
              <p className="bg-purple-500/70 text-white font-bold px-2 py-1 rounded-md inline-block text-sm drop-shadow-md">
                🟣 Midfielders – Control the game
              </p>
              <p className="bg-red-500/80 text-white font-bold px-2 py-1 rounded-md inline-block text-sm drop-shadow-md">
                🔴 Forwards – Lead the attack
              </p>
              <p className="bg-white font-bold px-2 py-1 rounded-md inline-block text-xs sm:text-sm drop-shadow-md">
                <span>⚪</span> Invite your buddy to update his/her position in
                their profile
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
                  onClick={() => setModalAddOpen(true)}
                >
                  Add New Buddy
                </Button>
              </CardActions>
            </Card>

            <CustomModal
              title="Enter New Buddy's Username"
              modalOpen={modalAddOpen}
              handleAddFriend={handleAddFriend}
              handleClose={handleClose}
              error={error}
              buttonText="Add Buddy"
            />

            {friends.map((friend, index) => {
              const positionCategory = getPositionCategory(friend.position);
              const bgColor = getPositionColor(
                positionCategory as keyof typeof colors
              );
              return (
                <div key={index}>
                  <Card
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
                        className="mt-4 font-bold text-white"
                        sx={{ fontFamily: "BubblegumSans" }}
                      >
                        {friend.username}
                      </Typography>
                      <Typography
                        variant="body1"
                        className="text-white text-2xl !font-bold"
                        sx={{ fontFamily: "Fredoka" }}
                      >
                        {friend.full_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-white font-special !font-bold"
                        sx={{ fontFamily: "Nunito" }}
                      >
                        Friends Since:{" "}
                        {new Date(friend?.friendship_date).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions className="!pt-0 !px-6 !justify-between">
                      <Button
                        size="small"
                        className="!text-info-500 !bg-primary-200 !rounded-lg !normal-case !shadow-lg !px-2"
                        onClick={() =>
                          handleCompareStats(friend.id, friend.username)
                        }
                      >
                        Compare Stats
                      </Button>
                      <Button
                        size="small"
                        className="!text-info-500 !bg-primary-200 !rounded-lg !normal-case !shadow-lg !px-2"
                        onClick={() => setFriendToRemove(friend)}
                      >
                        Remove Friend
                      </Button>
                    </CardActions>
                  </Card>
                  {friendToRemove && (
                    <CustomModal
                      title={`Are you sure you no longer want to view or compare ${friendToRemove.username}'s stats`}
                      modalOpen={!!friendToRemove}
                      handleRemoveFriend={() => {
                        handleRemoveFriend(friendToRemove.username);
                        setFriendToRemove(null);
                      }}
                      handleClose={() => setFriendToRemove(null)}
                      error={error}
                      buttonText="Remove Buddy"
                      username={friendToRemove.username}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default FriendsPage;
