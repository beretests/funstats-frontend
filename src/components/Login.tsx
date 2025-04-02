import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { useAlertStore } from "../stores/alertStore";
import { useLoadingStore } from "../stores/loadingStore";
import api from "../services/api";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import { retryFetch } from "../utils/retryFetch";

const Login: React.FC = () => {
  const showAlert = useAlertStore((state) => state.showAlert);
  const { isLoading, setLoading } = useLoadingStore();

  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");

  const [isSignUp, setIsSignUp] = useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    try {
      const successMessage = isSignUp
        ? "You've created an account! Update your profile."
        : "You're logged in!";

      if (isSignUp) {
        await retryFetch(
          async () => {
            const { error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  username,
                  email,
                },
              },
            });

            if (error) throw error;
          },
          3,
          1000
        );
        navigate("/profile");
        showAlert("success", successMessage);
      } else {
        let userEmail = identifier.includes("@") ? identifier : null;

        await retryFetch(
          async () => {
            if (!userEmail) {
              const endpoint = "/auth/login";
              const payload = { identifier, password };
              const response = await api.post(endpoint, payload);
              userEmail = response.data.email;
              setEmail(userEmail ?? "");
            } else {
              setEmail(userEmail);
            }

            if (!userEmail) {
              throw new Error("Email is not set before authentication");
            }

            const { data, error } = await supabase.auth.signInWithPassword({
              email: userEmail,
              password,
            });

            if (error) throw error;
            if (!data) console.log("No data");

            return data;
          },
          3,
          1000
        );

        navigate("/profile");
        showAlert("success", successMessage);
      }
    } catch (error) {
      showAlert("error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[90vh]">
          <CircularProgress />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-4 mt-4 p-4 bg-ok-700/80 shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-bold font-special mb-4 text-center">
            {isSignUp ? "Sign Up" : "Login"}
          </h2>
          {isSignUp ? (
            <FormControl
              sx={{ my: 1, width: "100%", fontFamily: "font-special" }}
              variant="outlined"
            >
              <InputLabel htmlFor="email" className="!text-ok-200">
                Email
              </InputLabel>
              <OutlinedInput
                className="!text-ok-100 hover:text-blue-800 hover:outline-red-700 transition-colors duration-300 ease-in-out"
                id="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          ) : (
            <FormControl
              sx={{ my: 1, width: "100%", fontFamily: "font-special" }}
              variant="outlined"
            >
              <InputLabel htmlFor="email-or-username">
                Email or Username
              </InputLabel>
              <OutlinedInput
                required
                id="email-or-username"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                label="Email or Username"
              />
            </FormControl>
          )}
          <FormControl sx={{ my: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              required
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff className="!text-ok-200" />
                    ) : (
                      <Visibility className="!text-ok-200" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          {isSignUp && (
            <FormControl
              sx={{ my: 1, width: "100%", fontFamily: "font-special" }}
              variant="outlined"
            >
              <InputLabel htmlFor="username">Username</InputLabel>
              <OutlinedInput
                required
                id="username"
                type="text"
                label="Username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormControl>
          )}
          <button type="submit" className="button w-full p-2">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
          <p className="mt-4 text-center font-special">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-accent-100 underline hover:text-accent-50"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-accent-100 underline hover:text-accent-50"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
