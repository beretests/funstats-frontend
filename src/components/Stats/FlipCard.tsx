import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import StatCard from "./StatCard";
import StatCardBack from "./StatCardBack";
import { motion } from "framer-motion";

interface FlipCardProps {
  card: {
    icon: React.ReactNode;
    stat: string;
    label: string;
    color: string;
  };
  index: number;
}

const FlipCard: React.FC<FlipCardProps> = ({
  card: { icon, stat, label, color },
  index,
}) => {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const handleCardClick = (index: number) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Grid size={{ xs: 12, md: 4, sm: 6, lg: 3 }} sx={{ cursor: "pointer" }}>
      <div
        className="relative w-full min-h-40 perspective"
        onClick={() => handleCardClick(index)}
      >
        <motion.div
          className="absolute w-full h-full"
          animate={{ rotateY: flippedCards[index] ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <StatCard icon={icon} stat={stat} label={label} color={color} />
          <StatCardBack />
        </motion.div>
      </div>
    </Grid>
  );
};

export default FlipCard;
