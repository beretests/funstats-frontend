import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAlertStore } from "../stores/alertStore";

const AlertSnackbar = () => {
  const { open, message, type, closeAlert } = useAlertStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={closeAlert}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <MuiAlert
        onClose={closeAlert}
        severity={type}
        elevation={6}
        variant="filled"
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default AlertSnackbar;
