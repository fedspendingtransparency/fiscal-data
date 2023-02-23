import {render} from "@testing-library/react";
import React from "react";
import SocialShareDropdown from "./social-share-dropdown";
describe('exchange rates banner', () => {
  const testCopy = {
    title: 'test',
    description: 'test',
    body: 'test',
    emailSubject: 'test',
    emailBody: 'test',
    url: 'test',
    image: 'test',
  }

  it('Renders the share button with the text and icon', () => {
    const {getByText, getByRole} = render(
      <SocialShareDropdown copy={testCopy} pageName={''} />
    )
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText('Share')).toBeInTheDocument();
    expect(getByRole('img', {hidden: true})).toBeInTheDocument();
  });

  it('opens the dropdown on click', () => {
    const {getByText, getByRole, queryByText} = render(
      <SocialShareDropdown copy={testCopy} pageName={''} />
    );
    const shareButton = getByRole('button');
    expect(queryByText('Facebook')).not.toBeInTheDocument();
    shareButton.click();
    expect(getByText('Facebook')).toBeInTheDocument();
  });
})
