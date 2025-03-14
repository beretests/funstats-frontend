import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  icon: React.ReactNode;
  stat: string;
  label: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, stat, label, color }) => {
  return (
    <Card
      raised
      className={`bg-${color}-100 shadow-lg hover:shadow-xl transition-shadow duration-300 !rounded-xl`}
    >
      <CardContent className="flex flex-col items-center p-4">
        <div className={`text-${color}-500 text-4xl mb-2`}>{icon}</div>
        <Typography variant="h4" className={`font-bold text-ok-700`}>
          {stat}
        </Typography>
        <Typography variant="body2" className={`text-${color}-600 text-center`}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
