import {render} from "@testing-library/react";
import React from "react";
import SocialShareDropdown from "./social-share-dropdown";
describe('exchange rates banner', () => {
  it('Renders the share button with the text and icon', () => {
    const {getByText, getByRole} = render(
      <SocialShareDropdown />
    )
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText('Share')).toBeInTheDocument();
    expect(getByRole('img', {hidden: true})).toBeInTheDocument();
  });

  it('opens the dropdown on click', () => {
    const {getByTestId, getByRole, queryByTestId} = render(
      <SocialShareDropdown />
    );
    const shareButton = getByRole('button');
    expect(queryByTestId('share-dropdown')).not.toBeInTheDocument();
    shareButton.click();
    expect(getByTestId('share-dropdown')).toBeInTheDocument();
  });
})
