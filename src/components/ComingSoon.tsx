// import { motion } from "framer-motion";
// import { Box, Typography } from "@mui/material";

// const ComingSoon = () => {
//   return (
//     <Box
//       className="flex items-center justify-center h-[85vh] bg-gray-100"
//       sx={{ textAlign: "center" }}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1.5, ease: "easeInOut" }}
//       >
//         <Typography variant="h3" component="h1" className="text-gray-800">
//           Coming Soon...
//         </Typography>
//       </motion.div>
//     </Box>
//   );
// };

// export default ComingSoon;

import React from "react";
import { motion } from "framer-motion";
import Typography from "@mui/material/Typography";

const ComingSoon: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[80vh] bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="text-center"
      >
        <Typography
          variant="h3"
          component="h1"
          className="text-gray-800 font-bold"
        >
          Coming Soon...
        </Typography>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
