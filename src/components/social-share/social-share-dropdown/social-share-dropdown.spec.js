import {render} from "@testing-library/react";
import React from "react";
import SocialShareDropdown from "./social-share-dropdown";
describe('exchange rates banner', () => {
  it('Displays the share text and icon', () => {
    const {getByText, getByRole} = render(
      <SocialShareDropdown />
    )
    expect(getByText('Share')).toBeInTheDocument();
    expect(getByRole('img', {hidden: true})).toBeInTheDocument();
  })
})
