import React from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ThemeToggle } from "./ThemeToggle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import PeopleIcon from "@mui/icons-material/People";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { useAlertStore } from "../stores/alertStore";
import { supabase } from "../services/supabase";

export const Header: React.FC = () => {
  const { isAuthenticated, username } = useAuthStore();
  const showAlert = useAlertStore((state) => state.showAlert);
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // removeSession();
    navigate("/", { replace: true });
    showAlert("success", "You have successfully logged out!");
  };

  const [state, setState] = React.useState({
    right: false,
    top: false,
    menuOpen: false,
  });

  const toggleDrawer =
    (anchor: string, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open, menuOpen: !state.menuOpen });
    };

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List className="w-full bg-accent-200">
        <ListItem component={NavLink} to="/profile">
          <ListItemButton>
            <ListItemIcon>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        <ListItem component={NavLink} to="/stats">
          <ListItemButton>
            <ListItemIcon>
              <QueryStatsIcon />
            </ListItemIcon>
            <ListItemText primary="Stats" />
          </ListItemButton>
        </ListItem>
        <ListItem component={NavLink} to="/friends">
          <ListItemButton>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Friends" />
          </ListItemButton>
        </ListItem>
        <ListItem component={NavLink} to="/leaderboard">
          <ListItemButton>
            <ListItemIcon>
              <LeaderboardIcon />
            </ListItemIcon>
            <ListItemText primary="Leaderboard" />
          </ListItemButton>
        </ListItem>
        <ListItem component={NavLink} to="/" onClick={handleLogout}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const anchor = "top";

  return (
    <header className="bg-primary-100 min-h-12 flex justify-between px-2 py-2 items-center shadow-md md:px-8">
      <div className="flex items-center gap-1 md:gap-2">
        <Link to="/">
          <img
            src={
              theme === "dark"
                ? "/funstats-logo-dark.png"
                : "/funstats-logo-light.png"
            }
            alt="FunStats Logo"
            width={30}
            height={30}
            className="rounded-full shadow-xs hover:scale-110 transition-transform duration-300 ease-in-out drop-shadow-2xl"
          />
        </Link>
        <h1 className="drop-shadow-3xl font-special bg-gradient-to-r from-accent-100 to-primary-200 bg-clip-text text-2xl text-transparent pt-2 ">
          FunStats
        </h1>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex gap-1">
        <ThemeToggle
          darkIcon={<DarkModeIcon className="w-4 h-4" />}
          lightIcon={<LightModeIcon className="w-4 h-4" />}
        />

        {isAuthenticated ? (
          <>
            <button
              onClick={toggleDrawer(anchor, true)}
              className="bg-accent-100 rounded-full p-1"
            >
              {state.menuOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </button>

            <SwipeableDrawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
              className=""
              ModalProps={{
                keepMounted: false,
              }}
            >
              {list()}
            </SwipeableDrawer>
          </>
        ) : (
          <NavLink to="/login" className="p-1 bg-accent-100 rounded-full">
            <LoginIcon className="bg-accent-100 rounded-full" />
          </NavLink>
        )}
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-2 items-center font-special ">
        <ThemeToggle
          darkIcon={<DarkModeIcon className="w-4 h-4" />}
          lightIcon={<LightModeIcon className="w-4 h-4" />}
        />
        {isAuthenticated ? (
          <div className="flex items-center gap-4 bg-warn-100 bg-clip-text text-transparent drop-shadow-2xl text-lg font-bold font-special">
            <span className="text-fail-500/50 mr-4 font-bold font-nunito">
              Hi, {username}
            </span>
            <>
              <NavLink
                to={`/profile`}
                className={(isActive) =>
                  "header__item" + (isActive ? "header__item--active" : "")
                }
              >
                Profile
              </NavLink>
              <NavLink
                to={`/stats`}
                className={(isActive) =>
                  "header__item" + (isActive ? "header__item--active" : "")
                }
              >
                Stats
              </NavLink>
              <NavLink
                to={`/friends`}
                className={(isActive) =>
                  "header__item" + (isActive ? "header__item--active" : "")
                }
              >
                Friends
              </NavLink>
              <NavLink
                to={`/leaderboard`}
                className={(isActive) =>
                  "header__item" + (isActive ? "header__item--active" : "")
                }
              >
                Leaderboard
              </NavLink>
              <NavLink
                to={"/"}
                className={(isActive) =>
                  "header__item" + (isActive ? "header__item--active" : "")
                }
                onClick={handleLogout}
              >
                Logout
              </NavLink>
            </>
          </div>
        ) : (
          <div className="text-accent-100">
            <NavLink
              to={"/login"}
              className={(isActive) =>
                "header__item" + (isActive ? "header__item--active" : "")
              }
              onClick={() => navigate("/login")}
            >
              Login
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
