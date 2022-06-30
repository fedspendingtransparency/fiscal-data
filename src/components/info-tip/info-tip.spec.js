import React from 'react';
import { render, act } from '@testing-library/react';
import  userEvent from '@testing-library/user-event'
import InfoTip from "./info-tip";

describe('InfoTip', () => {
  const title = 'Dataset Keyword Search';
  const body = 'Dataset Keyword Search body content.';
  const clickEvent = jest.fn();

  const InfoTipComponent = <InfoTip title={title} clickEvent={clickEvent}>{body}</InfoTip>

  it('does not render the popup without user interaction with the infographic button', () => {
    const { queryByTestId } = render(InfoTipComponent);
    expect(queryByTestId('popupContainer')).not.toBeInTheDocument();
  });

  it('provides an infographic button that has 508 accessibility features', () => {
    const { getByTestId } = render(InfoTipComponent);
    const button = getByTestId('infoTipButton');
    expect(button).toBeInTheDocument();
  });

  it('shows the popup and calls the click event passed to it when clicked on', () => {
    const { getByTestId } = render(InfoTipComponent);
    const button = getByTestId('infoTipButton');

    act(() => {
      button.click();
    });

    expect(getByTestId('popupContainer')).toBeInTheDocument();
    expect(clickEvent).toHaveBeenCalled();
  })
});

describe('InfoTip for glossary terms',  () => {
  const glossaryTitle = 'Term';
  const glossaryBody = 'Definition';
  const GlossaryInfoTipComponent = <InfoTip title={glossaryTitle} glossaryText={glossaryTitle}>{glossaryBody}</InfoTip>;

  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('shows the popup after hovering for .5 seconds', () => {
    jest.spyOn(global,'setTimeout');

    const { getByRole, getByTestId } = render(GlossaryInfoTipComponent);
    const button = getByRole('button', {name: glossaryTitle});
    act(() => {
      userEvent.hover(button);
    });
    jest.runOnlyPendingTimers();
    expect(setTimeout).toHaveBeenCalled();
    expect(getByTestId('popupContainer')).toBeInTheDocument();
  });

  it('will not render popup if mouse moves away before .5 seconds', () => {
    jest.spyOn(global,'setTimeout');
    jest.spyOn(global,'clearTimeout');
    const { getByRole, queryByTestId } = render(GlossaryInfoTipComponent);
    const button = getByRole('button', {name: glossaryTitle});
    act(() => {
      userEvent.hover(button);
      userEvent.unhover(button);
    });
    expect(setTimeout).toHaveBeenCalled();
    expect(clearTimeout).toHaveBeenCalled();
    expect(queryByTestId('popupContainer')).toBeNull();
  });

  it('opens the popup when the user tabs into the button and hits enter', () => {
    const { getByRole, queryByTestId, getByTestId } = render(GlossaryInfoTipComponent);
    const button = getByRole('button', {name: glossaryTitle});

    userEvent.tab();
    expect(button).toHaveFocus();
    act(() => {
      userEvent.keyboard('[enter]');
    });

    expect(getByTestId('popupContainer')).toBeInTheDocument();
  });
});
