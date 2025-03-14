import React from "react";
import { CircularProgress, Box } from "@mui/material";
import { useLoadingStore } from "../stores/loadingStore"; // Adjust path as needed

const LoadingComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const loading = useLoadingStore((state) => state.isLoading);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Take full viewport height
          width: "100vw", // Take full viewport width
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return <>{children}</>;
};

export default LoadingComponent;
