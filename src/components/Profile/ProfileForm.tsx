import { useReducer } from "react";
import { useProfileStore } from "../../stores/profileStore";
import { useAuthStore } from "../../stores/authStore";
import { Avatar, TextField, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAlertStore } from "../../stores/alertStore";
import dayjs from "dayjs";

const ProfileForm: React.FC = () => {
  const { user } = useAuthStore();
  const { isEditing, setIsEditing } = useProfileStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  const positions = [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward",
    "CAM",
    "CDM",
    "GK",
    "CB",
    "RB",
    "RWB",
    "LB",
    "LWB",
    "CM",
    "ST",
    "LW",
    "RW",
  ];

  // Define the initial form state
  const initialState = {
    formData: {
      full_name: user?.full_name || "",
      email: user?.email || "",
      dateOfBirth: dayjs(),
      date_of_birth: 0,
      favorite_soccer_player: "",
      position: "",
    },
    errors: {
      full_name: "",
      email: "",
      dateOfBirth: "",
      favorite_soccer_player: "",
      position: "",
    },
  };

  // Define action types
  type Action =
    | {
        type: "SET_FIELD";
        field: keyof typeof initialState.formData;
        value: any;
      }
    | { type: "SET_DATE"; value: dayjs.Dayjs }
    | { type: "VALIDATE" }
    | { type: "RESET"; payload?: typeof initialState };

  // Reducer function for managing form state and errors
  const reducer = (state: typeof initialState, action: Action) => {
    switch (action.type) {
      case "SET_FIELD":
        return {
          ...state,
          formData: {
            ...state.formData,
            [action.field]: action.value,
          },
          errors: {
            ...state.errors,
            [action.field]: "", // Clear error when user starts typing
          },
        };
      case "SET_DATE":
        return {
          ...state,
          formData: {
            ...state.formData,
            dateOfBirth: action.value,
            date_of_birth: action.value.valueOf(),
          },
          errors: {
            ...state.errors,
            dateOfBirth: "", // Clear error when valid date is selected
          },
        };
      case "VALIDATE":
        const errors = {} as typeof initialState.errors;
        if (!state.formData.full_name.trim())
          errors.full_name = "Name is required.";
        if (!state.formData.email.trim()) errors.email = "Email is required.";
        if (
          !state.formData.dateOfBirth ||
          !dayjs(state.formData.dateOfBirth).isValid()
        )
          errors.dateOfBirth = "Valid date of birth is required.";
        if (!state.formData.position.trim())
          errors.position = "Position is required.";
        return { ...state, errors };
      case "RESET":
        return action.payload || initialState;
      default:
        return state;
    }
  };

  // Use the reducer to manage form state
  const [state, dispatch] = useReducer(reducer, initialState);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: "SET_FIELD",
      field: name as keyof typeof initialState.formData,
      value,
    });
  };

  // Handle date changes
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      dispatch({ type: "SET_DATE", value: date });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "VALIDATE" });

    // Check if there are any validation errors
    const hasErrors = Object.values(state.errors).some((error) => error);
    if (!hasErrors) {
      console.log("Updated Profile Data:", state.formData);
      setIsEditing(false);
      showAlert("success", "Profile successfully updated!");
      dispatch({ type: "RESET" });
    }
  };

  if (isEditing) {
    return (
      <div className="min-h-screen p-6 pt-8 max-w-lg mx-auto text-neutral-200 text-center flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-700 text-neutral-200 font-special p-4 rounded shadow-md mt-4 space-y-4 flex flex-col gap-4"
        >
          {/* Name Field */}
          <TextField
            label="Name"
            name="full_name"
            value={state.formData.full_name}
            onChange={handleInputChange}
            fullWidth
            error={!!state.errors.full_name}
            helperText={state.errors.full_name}
          />

          {/* Email Field */}
          <TextField
            label="Email"
            name="email"
            value={state.formData.email}
            onChange={handleInputChange}
            fullWidth
            disabled
          />

          {/* Date of Birth Field */}
          <DatePicker
            label="Date of Birth"
            value={state.formData.dateOfBirth}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!state.errors.dateOfBirth,
                helperText: state.errors.dateOfBirth,
              },
            }}
            disableFuture
          />

          {/* Favorite Soccer Player Field */}
          <TextField
            label="Favorite Soccer Player"
            name="favorite_soccer_player"
            value={state.formData.favorite_soccer_player}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Position Field */}
          <TextField
            select
            label="Position"
            name="position"
            value={state.formData.position}
            onChange={handleInputChange}
            fullWidth
            error={!!state.errors.position}
            helperText={state.errors.position}
          >
            {positions.map((pos) => (
              <MenuItem key={pos} value={pos}>
                {pos}
              </MenuItem>
            ))}
          </TextField>

          {/* Buttons */}
          <div className="flex items-center justify-between font-special">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button type="submit" className="button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }
};

export default ProfileForm;
