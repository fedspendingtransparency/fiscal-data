import React from 'react';
import { fireEvent, waitFor, render } from '@testing-library/react';
import { SiteHeader } from './site-header';
import SiteHeaderComponent from './site-header';
import * as rdd from 'react-device-detect';
import SiteLayout from '../siteLayout/siteLayout';
import { StaticQuery, useStaticQuery } from 'gatsby';
import { mockUseStaticGlossaryData } from '../glossary/test-helper';
import { createHistory, createMemorySource, LocationProvider } from '@gatsbyjs/reach-router';
import 'gatsby-env-variables';
import '@testing-library/jest-dom';
import GLOBALS from '../../helpers/constants';
import { RecoilRoot } from 'recoil';
import fetchMock from 'fetch-mock';

jest.useFakeTimers();

const renderWithRouter = (ui, routeStr, { route = routeStr, history = createHistory(createMemorySource(route)) } = {}) => {
  return {
    ...render(<LocationProvider history={history}>{ui}</LocationProvider>),
    history,
  };
};

describe('SiteHeader', () => {
  beforeEach(() => {
    StaticQuery.mockImplementation(({ render }) => render({ mockUseStaticGlossaryData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockUseStaticGlossaryData,
      };
    });
  });

  beforeAll(() => {
    fetchMock.get(`https://www.transparency.treasury.gov/services/api/fiscal_service/v1/reference/fiscal_data/announcements`, {
      data: [
        {
          announcement_description: "We're aware of an issue impacting multiple datasets and are working to address it.",
          type: 'general',
          path: '/datasets/',
          recursive_path: 'true',
        },
        {
          announcement_description:
            "We're working to correct an issue with this dataset. Please find the static data at https://fiscaldata.treasury.gov/static-data/published-reports/debt_to_penny.pdf",
          type: 'dataset',
          path: '/datasets/debt-to-the-penny/',
          recursive_path: 'false',
        },
      ],
    });
  });

  it('displays the the logo, and resizes on page scroll', async () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <SiteHeader width={GLOBALS.breakpoints.large + 50} />
      </RecoilRoot>
    );
    const logoContainer = getByTestId('logoContainer');
    const logo = getByTestId('logo');
    expect(logo).toBeDefined();
    expect(logoContainer).toHaveStyle({ width: '192px' });
    fireEvent.scroll(window, { target: { pageYOffset: 400 } });
    expect(logoContainer).toHaveStyle({ width: '130px' });
  });

  it("contains the site's official banner", () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <SiteHeaderComponent />
      </RecoilRoot>
    );
    expect(getByTestId('officialBanner')).toBeDefined();
  });

  /**
   * expect one of each of these links as the mobile nav should not render the links unless opened
   */

  //logo
  it('contains the logo with title text', () => {
    const { getByTestId, getByTitle } = render(
      <RecoilRoot>
        <SiteHeaderComponent />
      </RecoilRoot>
    );
    const logo = getByTestId('logo');
    expect(logo).toBeDefined();
    expect(getByTitle('Return to home page')).toBeDefined();
  });

  it('displays the lowerEnvMessage when sent in props', () => {
    const message = 'Message';
    const { getByText } = render(
      <RecoilRoot>
        <SiteHeaderComponent lowerEnvMsg={message} />
      </RecoilRoot>
    );
    expect(getByText(message)).toBeDefined();
  });

  it('does not show browser notice if browser is not IE', () => {
    const { queryAllByTestId } = render(
      <RecoilRoot>
        <SiteHeaderComponent />
      </RecoilRoot>
    );
    expect(queryAllByTestId('ieDetected').length).toEqual(0);
  });

  it('shows browser notice if browser is IE', () => {
    rdd.isIE = true;
    const { getByTestId } = render(
      <RecoilRoot>
        <SiteLayout />
      </RecoilRoot>
    );
    expect(getByTestId('ieDetected')).toBeDefined();
  });

  // it('calls the appropriate analytics event when links are clicked on', () => {
  //   const spy = jest.spyOn(Analytics, 'event');
  //   const pageTitle = 'test page title';
  //   const { getByTestId, getByText, getByRole } = render(
  //     <RecoilRoot>
  //       <SiteHeaderComponent />
  //     </RecoilRoot>
  //   );
  //   document.title = pageTitle;
  //
  //   const logo = getByTestId('logo');
  //   const searchButton = getByTestId('search');
  //   const aboutButton = getByTestId('about');
  //   const topicsButton = getByRole('presentation', { name: 'Page links for Topics' });
  //   const resourcesButton = getByRole('presentation', { name: 'Page links for Resources' });
  //
  //   logo.click();
  //   expect(spy).toHaveBeenCalledWith({
  //     category: 'Sitewide Navigation',
  //     action: `Top Logo Click`,
  //     label: pageTitle,
  //   });
  //   spy.mockClear();
  //
  //   searchButton.click();
  //   expect(spy).toHaveBeenCalledWith({
  //     category: 'Sitewide Navigation',
  //     action: `Top Dataset Search Click`,
  //     label: pageTitle,
  //   });
  //   spy.mockClear();
  //
  //   aboutButton.click();
  //   expect(spy).toHaveBeenCalledWith({
  //     category: 'Sitewide Navigation',
  //     action: `Top About Us Click`,
  //     label: pageTitle,
  //   });
  //   spy.mockClear();
  //
  //   act(() => {
  //     fireEvent.mouseEnter(topicsButton);
  //     jest.runAllTimers();
  //   });
  //   const debtButton = getByText('Debt');
  //   debtButton.click();
  //   expect(spy).toHaveBeenCalledWith({
  //     category: 'Sitewide Navigation',
  //     action: `Topics Click`,
  //     label: 'Debt',
  //   });
  //   spy.mockClear();
  //
  //   act(() => {
  //     fireEvent.mouseEnter(resourcesButton);
  //     jest.runAllTimers();
  //   });
  //   const apiDocsButton = getByText('API Documentation');
  //   apiDocsButton.click();
  //   expect(spy).toHaveBeenCalledWith({
  //     category: 'Sitewide Navigation',
  //     action: `Top API Documentation Click`,
  //     label: pageTitle,
  //   });
  //   spy.mockClear();
  // });

  it('displays announcement banner for specified pages', async () => {
    const { getByTestId } = renderWithRouter(
      <RecoilRoot>
        <SiteHeaderComponent glossaryEvent={false} glossaryClickEventHandler={jest.fn()} />
      </RecoilRoot>,
      '/datasets/'
    );
    await waitFor(() => getByTestId('announcement-banner'));
    expect(getByTestId('announcement-banner')).toBeInTheDocument();
  });

  it('displays multiple announcement banners for specified pages where root path has a recursively appearing banner', async () => {
    const { getAllByTestId } = renderWithRouter(
      <RecoilRoot>
        <SiteHeaderComponent glossaryEvent={false} glossaryClickEventHandler={jest.fn()} />
      </RecoilRoot>,
      '/datasets/debt-to-the-penny/'
    );
    await waitFor(() => getAllByTestId('announcement-banner'));
    expect(getAllByTestId('announcement-banner').length).toEqual(2);
  });

  it('does not display announcement banner for unspecified paths', () => {
    const { queryByTestId } = renderWithRouter(
      <RecoilRoot>
        <SiteHeaderComponent glossaryEvent={false} glossaryClickEventHandler={jest.fn()} />
      </RecoilRoot>,
      '/americas-finance-guide/national-debt/'
    );
    expect(queryByTestId('announcement-banner')).not.toBeInTheDocument();
  });

  // it('opens the glossary menu when selected', async () => {
  //   const { getByRole, getByTestId } = render(
  //     <RecoilRoot>
  //       <SiteHeaderComponent />
  //     </RecoilRoot>
  //   );
  //
  //   act(() => {
  //     fireEvent.mouseEnter(getByRole('presentation', { name: 'Page links for Resources' }));
  //     jest.runAllTimers();
  //   });
  //   const glossaryButton = getByRole('presentation', { name: 'Glossary' });
  //   fireEvent.click(glossaryButton);
  //
  //   await waitFor(() => {
  //     expect(getByTestId('glossaryContainer')).toBeInTheDocument();
  //     expect(getByTestId('glossaryContainer')).toHaveClass('open');
  //   });
  // });

  // it('glossary menu closes when overlay is clicked', async () => {
  //   const { getByRole, getByTestId } = render(
  //     <RecoilRoot>
  //       <SiteHeaderComponent glossaryEvent={false} glossaryClickEventHandler={jest.fn()} />
  //     </RecoilRoot>
  //   );
  //
  //   act(() => {
  //     fireEvent.mouseEnter(getByRole('presentation', { name: 'Page links for Resources' }));
  //     jest.runAllTimers();
  //   });
  //   const glossaryButton = getByRole('presentation', { name: 'Glossary' });
  //
  //   fireEvent.click(glossaryButton);
  //   const glossary = getByTestId('glossaryContainer');
  //
  //   await waitFor(() => {
  //     expect(glossary).toHaveClass('open');
  //   });
  //   const glossaryOverlay = within(glossary).getByTestId('overlay');
  //
  //   fireEvent(
  //     glossaryOverlay,
  //     new MouseEvent('click', {
  //       bubbles: true,
  //       cancelable: true,
  //     })
  //   );
  //
  //   await waitFor(() => {
  //     expect(glossary).not.toHaveClass('open');
  //   });
  // });
});
