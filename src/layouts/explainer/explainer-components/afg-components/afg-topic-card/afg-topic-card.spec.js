import React from 'react';
import AfgTopicCard from './afg-topic-card';
import { fireEvent, getByTestId, render, within } from '@testing-library/react';
import Analytics from '../../../../../utils/analytics/analytics';
import { waitFor } from '@testing-library/dom';
import useGAEventTracking from '../../../../../hooks/useGAEventTracking';

jest.mock('../../../../../hooks/useGAEventTracking');

describe('Topic Section Component', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  useGAEventTracking.mockReturnValue({
    gaEvent: {
      eventCategory: 'Fiscal Data - Explainers',
    },
  });

  const body = 'A budget deficit occurs when the money spent exceeds the money collected for a given period.';
  const header = 'The amount by which spending exceeds revenue, $X.X in YYYY, is referred to as deficit spending.';

  it('renders the component for deficit', () => {
    const { getByTestId } = render(
      <AfgTopicCard heading={header} body={body} linkUrl="/national-deficit" linkText="Learn more about national deficit" id="national-deficit" />
    );

    const desktopView = getByTestId('desktop-view')

    expect(within(desktopView).getByText('Deficit')).toBeInTheDocument();
    expect(within(desktopView).getByText(header)).toBeInTheDocument();
    expect(within(desktopView).getByText(body)).toBeInTheDocument();
    expect(within(desktopView).getByRole('figure')).toBeInTheDocument();
  });

  it('renders the component for revenue', () => {
    const { getByTestId } = render(
      <AfgTopicCard
        heading={header}
        body={body}
        linkUrl="/government-revenue"
        linkText="Learn more about government revenue"
        id="government-revenue"
      />
    );

    const desktopView = getByTestId('desktop-view')

    expect(within(desktopView).getByText('Revenue')).toBeInTheDocument();
    expect(within(desktopView).getByText(header)).toBeInTheDocument();
    expect(within(desktopView).getByText(body)).toBeInTheDocument();
    expect(within(desktopView).getByRole('figure')).toBeInTheDocument();
  });

  it('renders the component for spending', () => {
    const { getByTestId } = render(
      <AfgTopicCard heading={header} body={body} linkUrl="/federal-spending" linkText="Learn more about federal spending" id="federal-spending" />
    );

    const desktopView = getByTestId('desktop-view')

    expect(within(desktopView).getByText('Spending')).toBeInTheDocument();
    expect(within(desktopView).getByText(header)).toBeInTheDocument();
    expect(within(desktopView).getByText(body)).toBeInTheDocument();
    expect(within(desktopView).getByRole('figure')).toBeInTheDocument();
  });

  it('renders the component for debt', () => {
    const { getByTestId } = render(
      <AfgTopicCard heading={header} body={body} linkUrl="/national-debt" linkText="Learn more about national debt" id="national-debt" />
    );

    const desktopView = getByTestId('desktop-view')

    expect(within(desktopView).getByText('Debt')).toBeInTheDocument();
    expect(within(desktopView).getByText(header)).toBeInTheDocument();
    expect(within(desktopView).getByText(body)).toBeInTheDocument();
    expect(within(desktopView).getByRole('figure')).toBeInTheDocument();
  });

  it('renders an empty div if an id is not passed in', () => {
    const { queryByRole } = render(<AfgTopicCard />);
    expect(queryByRole('figure')).not.toBeInTheDocument();
  });

  it('calls the correct analytics event when the topic link is clicked', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const eventNumber = 4;
    const { getByTestId } = render(
      <AfgTopicCard
        linkUrl="/government-revenue"
        linkText="Learn more about government revenue"
        id="government-revenue"
        eventNumber={eventNumber}
        pageName="Government Revenue"
      />
    );

    const desktopView = getByTestId('desktop-view')

    const topicLink = await waitFor(() => within(desktopView).getByText('Learn more about government revenue'));
    fireEvent.click(topicLink);
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'AFG Overview Citation Click',
      label: 'Government Revenue',
    });
  });
});
