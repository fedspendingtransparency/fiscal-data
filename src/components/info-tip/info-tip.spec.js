import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import InfoTip from './info-tip';

describe('InfoTip', () => {
  const title = 'Dataset Keyword Search';
  const body = 'Dataset Keyword Search body content.';
  const displayTitle = 'Dataset Keyword Search Display Title';
  const clickEvent = jest.fn();

  const InfoTipComponent = (
    <InfoTip title={title} clickEvent={clickEvent} displayTitle={displayTitle} hover>
      {body}
    </InfoTip>
  );

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
    fireEvent.click(button);
    expect(getByTestId('popupContainer')).toBeInTheDocument();
    expect(clickEvent).toHaveBeenCalled();
  });

  it('shows the popup when the user hovers over it', () => {
    const { getByTestId } = render(InfoTipComponent);
    const button = getByTestId('infoTipButton');
    fireEvent.mouseEnter(button);
    expect(getByTestId('popupContainer')).toBeInTheDocument();
    fireEvent.mouseLeave(button);
  });

  it('shows the pop up box when hover is true AND it shows a header if a title/displayTitle props are present', () => {
    const { getByTestId, getByRole } = render(InfoTipComponent);
    const button = getByTestId('infoTipButton');
    fireEvent.mouseEnter(button);
    expect(getByTestId('popupContainer')).toBeInTheDocument();
    const header = getByRole('heading', { level: 6 });
    expect(header).toBeInTheDocument();
  });

  it('removes the pop up box after the mouse hover ends', async () => {
    const { getByTestId } = render(InfoTipComponent);
    const button = getByTestId('infoTipButton');
    fireEvent.mouseEnter(button);
    const popup = getByTestId('popupContainer');
    expect(popup).toBeInTheDocument();
    fireEvent.mouseLeave(popup);
    await waitFor(() => {
      expect(popup).not.toBeInTheDocument();
    });
  });

  it('removes the pop up box after the user scrolls their mouse', async () => {
    const { getByTestId } = render(InfoTipComponent);
    const button = getByTestId('infoTipButton');
    fireEvent.mouseEnter(button);
    const popup = getByTestId('popupContainer');
    expect(popup).toBeInTheDocument();
    window.pageYOffset = 50;
    fireEvent.scroll(window);
    window.pageYOffset = 100;
    fireEvent.scroll(window);
    await waitFor(() => {
      expect(popup).not.toBeInTheDocument();
    });
  });
});
