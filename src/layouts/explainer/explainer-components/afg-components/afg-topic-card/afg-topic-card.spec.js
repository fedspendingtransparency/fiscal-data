import React from 'react';
import AfgTopicCard from './afg-topic-card';
import { fireEvent, render } from '@testing-library/react';
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
    const { getByText, getByRole } = render(
      <AfgTopicCard heading={header} body={body} linkUrl="/national-deficit" linkText="Learn more about national deficit" id="national-deficit" />
    );
    expect(getByText('Deficit')).toBeInTheDocument();
    expect(getByText(header)).toBeInTheDocument();
    expect(getByText(body)).toBeInTheDocument();
    expect(getByRole('figure')).toBeInTheDocument();
  });

  it('renders the component for revenue', () => {
    const { getByText, getByRole } = render(
      <AfgTopicCard
        heading={header}
        body={body}
        linkUrl="/government-revenue"
        linkText="Learn more about government revenue"
        id="government-revenue"
      />
    );
    expect(getByText('Revenue')).toBeInTheDocument();
    expect(getByText(header)).toBeInTheDocument();
    expect(getByText(body)).toBeInTheDocument();
    expect(getByRole('figure')).toBeInTheDocument();
  });

  it('renders the component for spending', () => {
    const { getByText, getByRole } = render(
      <AfgTopicCard heading={header} body={body} linkUrl="/federal-spending" linkText="Learn more about federal spending" id="federal-spending" />
    );
    expect(getByText('Spending')).toBeInTheDocument();
    expect(getByText(header)).toBeInTheDocument();
    expect(getByText(body)).toBeInTheDocument();
    expect(getByRole('figure')).toBeInTheDocument();
  });

  it('renders the component for debt', () => {
    const { getByText, getByRole } = render(
      <AfgTopicCard heading={header} body={body} linkUrl="/national-debt" linkText="Learn more about national debt" id="national-debt" />
    );
    expect(getByText('Debt')).toBeInTheDocument();
    expect(getByText(header)).toBeInTheDocument();
    expect(getByText(body)).toBeInTheDocument();
    expect(getByRole('figure')).toBeInTheDocument();
  });

  it('renders an empty div if an id is not passed in', () => {
    const { queryByRole } = render(<AfgTopicCard />);
    expect(queryByRole('figure')).not.toBeInTheDocument();
  });

  it('calls the correct analytics event when the topic link is clicked', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const eventNumber = 4;
    const { getByText } = render(
      <AfgTopicCard
        linkUrl="/government-revenue"
        linkText="Learn more about government revenue"
        id="government-revenue"
        eventNumber={eventNumber}
        pageName="Government Revenue"
      />
    );
    const topicLink = await waitFor(() => getByText('Learn more about government revenue'));
    fireEvent.click(topicLink);
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'AFG Overview Citation Click',
      label: 'Government Revenue',
    });
  });
});
