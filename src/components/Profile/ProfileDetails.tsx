import React from "react";
import { useProfileStore } from "../../stores/profileStore";
import { calculateAge } from "../../utils/dateUtils";
import { useAuthStore } from "../../stores/authStore";

const ProfileDetails: React.FC = () => {
  const { isEditing, setIsEditing } = useProfileStore();
  const { user } = useAuthStore();
  let player = user;

  const fields = {
    "Full Name": player?.full_name || player?.user_metadata?.full_name,
    Email: player?.email,
    Age:
      calculateAge(player?.date_of_birth) ||
      calculateAge(player?.user_metadata?.date_of_birth),
    Position: player?.position || player?.user_metadata?.position,
    "Favorite Soccer Player":
      player?.favorite_soccer_player ||
      player?.user_metadata?.favorite_soccer_player,
  };

  if (!isEditing) {
    return (
      <div className="flex flex-col font-fredoka pt-8 px-8 text-center">
        {Object.entries(fields).map(([label, value]) =>
          value ? (
            <p key={label} className="mb-2 font-bold">
              {label}: <span className="font-nunito">{value}</span>
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
