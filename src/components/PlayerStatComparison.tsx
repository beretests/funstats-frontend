import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

type PlayerStats = {
  player_id: string;
  total_goals: string;
  total_assists: string;
  total_shots_on_target: string;
  total_tackles: string;
  total_interceptions: string;
  total_saves: string;
  total_yellow_cards: string;
  total_red_cards: string;
  total_fouls: string;
  total_headers_won: string;
  total_offsides: string;
  total_games_played: string;
};

interface Props {
  playersData: PlayerStats[];
}

const PlayerStatComparison: React.FC<Props> = ({ playersData }) => {
  const getHighestValue = (statKey: keyof PlayerStats): string | null => {
    const values = playersData.map((player) => parseInt(player[statKey], 10));
    const maxValue = Math.max(...values);
    return maxValue.toString();
  };

  return (
    <div className="flex flex-col md:flex-row  gap-4 md:gap-8 justify-center ">
      {playersData.map((player) => (
        <Card
          raised
          key={player.player_id}
          sx={{ maxWidth: 300 }}
          className="!w-80 md:w-full hover:!bg-warn-100/30 !transition-all !duration-300  !rounded-xl mx"
        >
          <CardContent>
            <Typography
              variant="h6"
              className="text-center text-info-300 !font-special !text-2xl mb-2"
            >
              Username
            </Typography>
            <div className="grid gap-2 text-sm pt-4">
              {Object.keys(player).map((key) => {
                if (key === "player_id") return null;

                const isHighest =
                  player[key as keyof PlayerStats] ===
                  getHighestValue(key as keyof PlayerStats);

                const emojiMap = {
                  total_goals: "⚽️",
                  total_assists: "🅰️",
                  total_shots_on_target: "🎯",
                  total_tackles: "🛡️",
                  total_interceptions: "🚧",
                  total_saves: "🥅",
                  total_yellow_cards: "🟨",
                  total_red_cards: "🟥",
                  total_fouls: "🚫",
                  total_headers_won: "🤾‍♂️",
                  total_offsides: "🚩",
                  total_games_played: "🏆",
                };

                return (
                  <div
                    key={key}
                    className={`flex justify-between items-center px-4  rounded-2xl ${
                      isHighest
                        ? "text-ok-300 font-bold bg-info-300"
                        : "text-neutral-400"
                    }`}
                  >
                    <span className="font-fredoka font-bold capitalize">
                      {key.replace(/_/g, " ").replace(/total /g, "")}
                      {"  "}
                      <span className="hover:!animate-bounce">
                        {"  "}
                        {emojiMap[key as keyof typeof emojiMap]}
                      </span>
                      :
                    </span>{" "}
                    <span
                      className={`text-lg ${
                        isHighest
                          ? "text-info-500 font-bold"
                          : "text-neutral-400"
                      }`}
                    >
                      {player[key as keyof PlayerStats]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlayerStatComparison;
