import React from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";

interface Option {
  id: string;
  name: string;
}

interface AutocompleteProps {
  label: string;
  options: Option[];
  checkbox: string;
  onChange: (value: Option | null) => void;
  onCheckboxChange?: (checked: boolean) => void; // Add callback for checkbox changes
  isCheckboxDisabled?: boolean; // Add prop to disable checkbox
  isCheckboxChecked?: boolean; // Add prop to track if checkbox is checked
}

const StatsAutocomplete: React.FC<AutocompleteProps> = ({
  label,
  options,
  checkbox,
  onChange,
  onCheckboxChange,
  isCheckboxDisabled = true,
  isCheckboxChecked = false,
}) => {
  return (
    <div className="flex justify-evenly">
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" />
        )}
        onChange={(_event, newValue) => onChange(newValue)}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgb(209, 213, 219)", // Tailwind's gray-300
            },
            "&:hover fieldset": {
              borderColor: "rgb(156, 163, 175)", // Tailwind's gray-500
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgb(59, 130, 246)",
            },
          },
        }}
      />
      {(checkbox === "homeTeamId" || checkbox === "awayTeamId") && (
        <Checkbox
          id={checkbox}
          checked={isCheckboxChecked} // Bind checked state
          disabled={isCheckboxDisabled} // Disable if no value selected
          onChange={(_event, checked) => onCheckboxChange?.(checked)} // Trigger callback when checked/unchecked
          color="primary"
          className="justify-self-end pr-0 mr-0"
        />
      )}
    </div>
  );
};

export default StatsAutocomplete;
