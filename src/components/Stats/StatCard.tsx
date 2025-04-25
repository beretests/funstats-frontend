import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  icon: React.ReactNode;
  stat: string;
  label: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, stat, label }) => {
  return (
    <Card
      raised
      className={`absolute !bg-ok-800/90 shadow-lg hover:shadow-xl transition-shadow w-full h-full duration-300 !rounded-xl border-l-4 border-accent-100 backface-hidden`}
    >
      <CardContent className="flex flex-col items-center p-4">
        <div className={`text-ok-300 text-4xl mb-2`}>{icon}</div>
        <Typography
          variant="h4"
          className={`font-bold !text-blue-700 dark:!text-blue-300`}
        >
          {stat}
        </Typography>
        <Typography
          variant="body2"
          className={`dark:!text-ok-300 text-ok-300 !font-nunito !font-bold text-center !text-lg`}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
