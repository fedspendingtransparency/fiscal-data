import { render } from '@testing-library/react';
import React from 'react';
import PageScrollLink from './page-scroll-link';
import { scroller } from 'react-scroll';
import userEvent from '@testing-library/user-event';

describe('Custom Link', () => {
  const text = 'sample content';
  const content = <div>{text}</div>;
  const scrollConfigs = { delay: 200, duration: 600, offset: -150, spy: true, smooth: true };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders an scroll link and calls scrollTo on click', () => {
    const scrollerSpy = jest.spyOn(scroller, 'scrollTo');
    const { getByRole } = render(<PageScrollLink url="#test">{content}</PageScrollLink>);
    const link = getByRole('link');
    link.click();
    expect(scrollerSpy).toHaveBeenCalledWith('test', scrollConfigs);
  });

  it('renders an scroll link and calls scrollTo on enter key press', () => {
    const scrollerSpy = jest.spyOn(scroller, 'scrollTo');
    const { getByRole } = render(<PageScrollLink url="#test">{content}</PageScrollLink>);
    const link = getByRole('link');
    userEvent.tab();
    expect(link).toHaveFocus();
    userEvent.keyboard('{Enter}');
    expect(scrollerSpy).toHaveBeenCalledWith('test', scrollConfigs);
  });

  it('Does not call scrollTo when a non "Enter" key is pressed', () => {
    const scrollerSpy = jest.spyOn(scroller, 'scrollTo');
    render(<PageScrollLink url="#test">{content}</PageScrollLink>);
    userEvent.tab();
    userEvent.keyboard('{Space}');
    expect(scrollerSpy).not.toHaveBeenCalled();
  });
});
