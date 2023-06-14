import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
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

  it('shows the popup on hover when hover is true', () => {
    const { getByTestId } = render(<InfoTip title={title} hover>{body}</InfoTip>);
    const button = getByTestId('infoTipButton');

    act(() => {
      fireEvent.mouseEnter(button);
    });

    expect(getByTestId('popupContainer')).toBeInTheDocument();
  })


});

