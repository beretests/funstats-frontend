import { useProfileStore } from "../../stores/profileStore";
import { useAuthStore } from "../../stores/authStore";
import { Avatar, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { supabase } from "../../services/supabase";
import { useAlertStore } from "../../stores/alertStore";
import LoopIcon from "@mui/icons-material/Loop";
import { useState } from "react";

const ProfileHeader = () => {
  const { isEditing, uploading, setUploading, setIsEditing } =
    useProfileStore();
  const { user, session, setUser } = useAuthStore();
  const showAlert = useAlertStore((state) => state.showAlert);
  const [file, setFile] = useState<File | null>(null);

  let player = user;

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);

    try {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
        const fileName = `${player?.id}-${Date.now()}-${
          e.target.files[0].name
        }`;

        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(fileName, e.target.files[0]);

        if (error) {
          console.error("Error uploading file:", error.message);
          showAlert("error", `Failed to upload image, ${error.message}`);
          setUploading(false);
          return;
        }

        const publicUrl = supabase.storage
          .from("avatars")
          .getPublicUrl(data.path).data;

        if (!publicUrl) {
          showAlert("error", "Failed to retrieve image URL");
          return;
        }

        const { error: dbError } = await supabase
          .from("profiles")
          .update({ avatar_url: publicUrl.publicUrl })
          .eq("id", player?.id);

        if (dbError) {
          console.error("Error updating profile:", dbError.message);
          showAlert("error", `Failed to update profile, ${dbError.message}`);
          setUploading(false);
          return;
        }

        setUser({ ...player, avatar_url: publicUrl.publicUrl });
        setIsEditing(false);
        showAlert("success", "Image uploaded successfully!");
      }

      setUploading(false);
    } catch (err) {
      console.error("Error uploading image:", err);
      showAlert("error", "An error occurred while uploading the image");
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-between flex-col items-center text-center px-4 py-8 gap-6">
      <h1 className="text-2xl font-special">
        Welcome to your profile,{" "}
        {player?.user_metadata?.username ||
          session?.user?.user_metadata.username}
      </h1>
      <Avatar
        src={
          file
            ? URL.createObjectURL(file)
            : player?.avatar_url || player?.user_metadata?.avatar_url
            ? player.avatar_url || player?.user_metadata?.avatar_url
            : undefined
        }
        alt={player?.full_name}
        className="font-special"
        sx={{ width: 216, height: 216 }}
      >
        {!player?.avatar_url && player?.user_metadata?.full_name
          ? player.user_metadata.full_name
              .split(" ")
              .map((n: any[]) => n[0])
              .join("")
          : ""}
      </Avatar>

      {isEditing && (
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={uploading ? <LoopIcon /> : <CloudUploadIcon />}
          loading={uploading}
        >
          {uploading ? "...Uploading" : "Upload Image"}
          <VisuallyHiddenInput type="file" onChange={handleImageUpload} />
        </Button>
      )}
    </div>
  );
};
export default ProfileHeader;
