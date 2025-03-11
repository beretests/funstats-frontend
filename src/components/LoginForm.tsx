import React, { useState } from "react";
import api from "../services/api";

import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../stores/playerStore";
import { useAlertStore } from "../stores/alertStore";

const LoginForm: React.FC = () => {
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const showAlert = useAlertStore((state) => state.showAlert);

  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isSignUp ? `/auth/signup` : `/auth/login`;
      const payload = isSignUp
        ? { email, password, username }
        : { identifier, password };
      const response = await api.post(endpoint, payload);
      console.log(response.data);
      const { session, user } = response.data;
      setPlayer(user, session);
      console.log("Player:", user, "Session:", session);
      navigate("/profile");
      showAlert("success", "You are logged in!");
    } catch (error) {
      showAlert("error", (error as Error).message);
      console.error(`Error ${isSignUp ? "signing up" : "logging in"}:`, error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-4 bg-neutral-950 shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isSignUp ? "Sign Up" : "Login"}
      </h2>
      {isSignUp ? (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          required
        />
      ) : (
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email or Username"
          className="w-full p-2 mb-4 border rounded"
          required
        />
      )}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded"
        autoComplete="false"
        required
      />
      {isSignUp && (
        <input
          type="text"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded"
          required
        />
      )}
      <button
        type="submit"
        className="w-full p-2 bg-primary-200 text-neutral-50 rounded hover:bg-accent-50"
      >
        {isSignUp ? "Sign Up" : "Login"}
      </button>
      <p className="mt-4 text-center">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(false)} // Switch to login mode
              className="text-primary-400 underline hover:text-primary-300"
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className="text-primary-400 underline hover:text-primary-300"
            >
              Sign Up
            </button>
          </>
        )}
      </p>
    </form>
  );
};

export default LoginForm;
