import React, { act } from 'react';
import { useStaticQuery } from 'gatsby';
import ApiDocumentationPage from './index';
import GettingStarted from '../../components/api-documentation/getting-started/getting-started';
import Endpoints from '../../components/api-documentation/endpoints/endpoints';
import Methods from '../../components/api-documentation/methods/methods';
import Fields from '../../components/api-documentation/fields/fields';
import Aggregation from '../../components/api-documentation/aggregation/aggregation';
import Examples from '../../components/api-documentation/examples/examples';
import { toc } from './api.module.scss';
import TOCButton from '../../components/table-of-contents/toc-button/toc-button';
import * as addressBar from '../../helpers/address-bar/address-bar';
import { animateScroll } from 'react-scroll';
import { scrollOptionsSmooth } from '../../utils/scroll-config';
import { RecoilRoot } from 'recoil';
import { findByTestId, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.useFakeTimers();
describe('ApiDocumentationPage', () => {
  const internalData = require('../../testData/__dataConfig_for_tests.json');
  const profilerConfigMockData = {
    allDatasets: {
      datasets: internalData.datasets,
    },
    allTopics: {
      topics: internalData.topics,
    },
  };
  const scrollToTopSpy = jest.spyOn(animateScroll, 'scrollToTop');
  const scrollToSpy = jest.spyOn(animateScroll, 'scrollTo');
  document.querySelector = jest.fn(() => {
    return {
      appendChild: jest.fn(),
      getAttribute: jest.fn(),
      getBoundingClientRect: jest.fn(() => {
        return { height: 0 };
      }),
    };
  });

  beforeAll(() => {
    useStaticQuery.mockReturnValue(profilerConfigMockData);
  });

  // it('defines meta elements', () => {
  //   const helmetProps = instance.find(e => e.props['data-test-id'] === 'helmet').props;
  //
  //   expect(helmetProps.pageTitle).toBe('API Documentation');
  //   expect(helmetProps.description).toBeDefined();
  //   expect(helmetProps.keywords).toBeDefined();
  // });
  //
  // it('expects Getting Started to be within its layout', () => {
  //   expect(instance.findByType(GettingStarted)).toBeDefined();
  // });

  //
  // it('expects Endpoints to be within its layout', () => {
  //   expect(instance.findByType(Endpoints)).toBeDefined();
  // });
  // it('expects Methods to be within its layout', () => {
  //   expect(instance.findByType(Methods)).toBeDefined();
  // });
  // it('expects Fields to be within its layout', () => {
  //   expect(instance.findByType(Fields)).toBeDefined();
  // });
  // it('expects Aggregation to be within its layout', () => {
  //   expect(instance.findByType(Aggregation)).toBeDefined();
  // });
  // it('expects Examples to be within its layout', () => {
  //   expect(instance.findByType(Examples)).toBeDefined();
  // });

  it('expects links to exist within the toc', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const tocContent = getByTestId('tocWrapper');
    const links = within(tocContent).getAllByTestId('tocLink');
    expect(links.length).toBeGreaterThan(0);
  });

  it('contains a TOCButton', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const tocButton = getByRole('button', { name: 'Table of Contents' });
    expect(tocButton).toBeInTheDocument();
  });

  it('assigns the class "tocClosed" to the content and toc elements when tocIsOpen is false', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const content = getByTestId('tocWrapper');
    expect(content).toHaveClass('tocClosed');
  });

  it('assigns the class "tocOpen" to the content and toc elements when tocIsOpen is true', () => {
    const { getByTestId, getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const tocButton = getByRole('button', { name: 'Table of Contents' });
    userEvent.click(tocButton);
    const content = getByTestId('tocWrapper');
    expect(content).toHaveClass('tocOpen');
  });

  it('assigns the class "tocOpen" to the content and toc elements when tocIsOpen is true', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const testYOffset = 547;
    global.window.pageYOffset = testYOffset;
    scrollToTopSpy.mockClear();
    scrollToSpy.mockClear();
    act(() => {
      global.window.dispatchEvent(new Event('scroll'));
      return undefined;
    });
    const tocButton = getByRole('button', { name: 'Table of Contents' });
    userEvent.click(tocButton);
    expect(scrollToTopSpy).toHaveBeenCalledWith(scrollOptionsSmooth);
    expect(scrollToSpy).not.toHaveBeenCalled();
    const cancelButton = getByRole('button', { name: 'Cancel' });
    userEvent.click(cancelButton);
    expect(scrollToSpy).toHaveBeenCalledWith(testYOffset, scrollOptionsSmooth);
  });

  it('assigns the class "tocOpen" to the content and toc elements when tocIsOpen is true', () => {
    const { getByRole, getAllByTestId } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const tocButton = getByRole('button', { name: 'Table of Contents' });
    userEvent.click(tocButton);
    const updateAddressPathSpy = jest.spyOn(addressBar, 'updateAddressPath');
    updateAddressPathSpy.mockClear();
    const allLinks = getAllByTestId('tocLink');
    const tocElement = allLinks[0];
    userEvent.click(tocElement);
    jest.runAllTimers();
    expect(updateAddressPathSpy).toHaveBeenCalledTimes(1);
  });
});
