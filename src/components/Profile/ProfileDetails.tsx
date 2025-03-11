import React from "react";
import { useProfileStore } from "../../stores/profileStore";
import { calculateAge } from "../../utils/dateUtils";
import { useAuthStore } from "../../stores/authStore";

const ProfileDetails = () => {
  const { isEditing, setIsEditing } = useProfileStore();
  const { user } = useAuthStore();
  let player = user;

  const fields = {
    "Full Name": player?.full_name,
    Email: player?.email,
    Age: calculateAge(player?.date_of_birth),
    Position: player?.position,
    "Favorite Soccer Player": player?.favorite_soccer_player,
  };

  if (!isEditing) {
    return (
      <div className="flex flex-col font-special pt-8 px-8 text-center">
        {/* <p className="mb-2">Email: {player?.email}</p>
        <p className="mb-2">Age: {calculateAge(player?.date_of_birth)}</p>
        <p className="mb-2">Position: {player?.position}</p>
        <p className="mb-2">
          Favorite Soccer Player: {player?.favorite_soccer_player}
        </p> */}
        {Object.entries(fields).map(([label, value]) =>
          value ? (
            <p key={label} className="mb-2">
              {label}: {value}
            </p>
          ) : null
        )}
        <button className="button" onClick={() => setIsEditing(true)}>
          Update Profile
        </button>
      </div>
    );
  }
};

export default ProfileDetails;
