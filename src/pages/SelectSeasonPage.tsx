import React, { useEffect } from "react";
import SelectSeason from "../components/Stats/SelectSeason";
import useSeasonStore from "../stores/seasonStore";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const SelectSeasonPage: React.FC = () => {
  const { fetchSeasons } = useSeasonStore();

  useEffect(() => {
    fetchSeasons();
  }, []);

  const cardBgColor =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "var(--color-ok-200)"
      : "var(--color-ok-700)";

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Card
        sx={{
          minWidth: 300,
          maxWidth: 500,
          width: { xs: "50%", sm: "80%", md: "60%", lg: "50%" },
          p: 2,
          my: 4,
          bgcolor: cardBgColor,
          boxShadow: 3,
          borderRadius: 2,
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContent>
          <SelectSeason />
        </CardContent>
      </Card>
    </Box>
  );
};

export default SelectSeasonPage;
