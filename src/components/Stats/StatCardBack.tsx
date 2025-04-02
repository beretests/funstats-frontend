import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatCardBack: React.FC = () => {
  return (
    <Card
      raised
      className={`absolute !bg-neutral-800/85 w-full h-full shadow-lg hover:shadow-xl transition-shadow duration-300 !rounded-xl border-l-4 border-accent-100 backface-hidden`}
      style={{ transform: "rotateY(180deg)" }}
    >
      <CardContent className="flex flex-col items-center p-4">
        <div className={`text-ok-500 mb-2 font-special`}>Stat Details</div>
        <Typography
          variant="h4"
          className={`font-bold !text-blue-700`}
        ></Typography>
        <Typography
          variant="body2"
          className={`!text-ok-600 !font-nunito !font-bold text-center !text-lg`}
        ></Typography>
      </CardContent>
    </Card>
  );
};

export default StatCardBack;
