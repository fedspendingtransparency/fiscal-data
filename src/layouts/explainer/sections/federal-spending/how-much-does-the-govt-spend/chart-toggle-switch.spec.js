import { render } from "@testing-library/react";
import React, {useState} from "react";
import {fireEvent} from "@testing-library/dom";
import {ToggleSwitch} from "./chart-toggle-switch";

describe('spending chart toggle switch', () => {

  const setPercentDollar = () => {
    return false;
  }

  it("renders toggle switch", async() => {
    const { getByTestId } = render(
      <ToggleSwitch
        checked={false}
        handleChange={() => {
          return false;
        }}
        percentDollarToggleChecked={true}
        setPercentDollarToggleChecked={setPercentDollar}
        customStyles={{ onColor: "#00766C", offColor: "#00766C", }}
      /> );
    fireEvent.keyDown(getByTestId('switch'), {key: "Enter", code: 13, charCode: 13});
  })

})
