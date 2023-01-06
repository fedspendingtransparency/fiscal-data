import Switch from "react-switch";
import React from "react";

export const ToggleSwitch = ({
  checked,
  handleChange,
  customStyles,
  setPercentDollarToggleChecked,
  percentDollarToggleChecked,
}) => {
  return (
    <label htmlFor="material-switch">
      <Switch
        checked={checked}
        onChange={handleChange}
        onColor={customStyles.onColor}
        offColor={customStyles.offColor}
        handleDiameter={15}
        uncheckedIcon={false}
        checkedIcon={false}
        height={20}
        width={48}
        id="material-switch"
        onKeyDown={e => {
          if (e.key === "Enter") {
            setPercentDollarToggleChecked(!percentDollarToggleChecked)
          }
        }}
        data-testid={'switch'}
      />
    </label>
  )
}
