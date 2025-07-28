import React from 'react';
import { render, within } from '@testing-library/react';
import Topic, { topicIconAnalyticsEvent } from './topic';
import Analytics from '../../../../utils/analytics/analytics';
import userEvent from '@testing-library/user-event';

jest.useFakeTimers();
describe('Topics component', () => {
  const label = 'Debt';
  const slug = 'debt';

  const clickFn = jest.fn();

  it('creates a button', () => {
    const { getByRole } = render(<Topic active onChange={clickFn} label={label} filterKey={slug} slug={slug} />);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('shows the label for the button', () => {
    const { getByTestId } = render(<Topic active onChange={clickFn} label={label} filterKey={slug} slug={slug} />);
    expect(within(getByTestId('topic-selector-label')).getByText(label)).toBeInTheDocument();
  });

  it('adds the active class when button is selected', () => {
    const { getByTestId } = render(<Topic active onChange={clickFn} label={label} filterKey={slug} slug={slug} />);
    const imageDiv = getByTestId('topic-selector-button');
    expect(imageDiv).toHaveClass('topicActive');
  });

  it('does not provide the active class when the button is not selected', () => {
    const { getByTestId } = render(<Topic active={false} clickHandler={clickFn} label={label} filterKey={slug} slug={slug} />);
    jest.runAllTimers();
    const imageDiv = getByTestId('topic-selector-button');
    expect(imageDiv).not.toHaveClass('topicActive');
  });

  it('calls the onChange event with the expected parameters when the button is clicked', async () => {
    const { getByRole } = render(<Topic active onChange={clickFn} label={label} filterKey={slug} slug={slug} />);

    const button = getByRole('button');
    userEvent.click(button);

    expect(clickFn).toHaveBeenCalledWith({ key: slug, value: false });
  });

  it(`calls triggers a tracking event with the expected parameters when the button is clicked
    to update state to active and testing GA4 datalayer push`, async () => {
    window.dataLayer = window.dataLayer || [];
    const datalayerSpy = jest.spyOn(window.dataLayer, 'push');
    const trackingSpy = jest.spyOn(Analytics, 'event');

    const { getByRole } = render(<Topic active={false} onChange={clickFn} label={label} filterKey={slug} slug={slug} />);

    jest.runAllTimers();
    const button = getByRole('button');
    userEvent.click(button);

    jest.runAllTimers();

    expect(trackingSpy).toHaveBeenCalledWith({
      ...topicIconAnalyticsEvent,
      label,
    });
    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Topics Filter Click',
      eventLabel: label,
    });
  });
});
