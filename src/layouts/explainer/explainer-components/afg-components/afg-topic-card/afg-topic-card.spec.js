import React from 'react';
import AfgTopicCard from './afg-topic-card';
import { render } from '@testing-library/react';

describe('Topic Section Component', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
  it('renders the component for deficit', () => {
    const body = 'A budget deficit occurs when the money spent exceeds the money collected for a given period.';
    const header = 'The amount by which spending exceeds revenue, $X.X in YYYY, is referred to as deficit spending.';
    const { getByText, getByRole } = render(
      <AfgTopicCard heading={header} body={body} linkUrl="/national-deficit" linkText="Learn more about national deficit" id="national-deficit" />
    );
    expect(getByText('Deficit')).toBeInTheDocument();
    expect(getByText(header)).toBeInTheDocument();
    expect(getByText(body)).toBeInTheDocument();
    expect(getByRole('figure')).toBeInTheDocument();
  });
  it('renders the component for revenue', () => {
    const body = 'A budget deficit occurs when the money spent exceeds the money collected for a given period.';
    const header = 'The amount by which spending exceeds revenue, $X.X in YYYY, is referred to as deficit spending.';
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
    const body = 'A budget deficit occurs when the money spent exceeds the money collected for a given period.';
    const header = 'The amount by which spending exceeds revenue, $X.X in YYYY, is referred to as deficit spending.';
    const { getByText, getByRole } = render(
      <AfgTopicCard heading={header} body={body} linkUrl="/federal-spending" linkText="Learn more about federal spending" id="federal-spending" />
    );
    expect(getByText('Spending')).toBeInTheDocument();
    expect(getByText(header)).toBeInTheDocument();
    expect(getByText(body)).toBeInTheDocument();
    expect(getByRole('figure')).toBeInTheDocument();
  });
});
