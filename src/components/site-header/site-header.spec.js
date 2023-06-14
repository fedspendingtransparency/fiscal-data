import React from 'react';
import {fireEvent, waitFor, render, within } from "@testing-library/react"
import SiteHeader from "./site-header";
import * as styles from './site-header.module.scss';
import * as rdd from 'react-device-detect';
import SiteLayout from "../siteLayout/siteLayout";
import Analytics from '../../utils/analytics/analytics';
import { StaticQuery, useStaticQuery } from 'gatsby';
import { mockUseStaticGlossaryData } from '../glossary/test-helper';
import { createHistory, createMemorySource, LocationProvider } from '@reach/router';
import "gatsby-env-variables";
import '@testing-library/jest-dom/extend-expect'

jest.useFakeTimers();

jest.mock("gatsby-env-variables", () => ({
  ENV_ID: 'dev',
  API_BASE_URL: 'https://www.transparency.treasury.gov',
  ADDITIONAL_DATASETS: {},
  EXPERIMENTAL_WHITELIST: [],
  NOTIFICATION_BANNER_TEXT: 'Test Page Name',
  NOTIFICATION_BANNER_DISPLAY_PAGES: ['/', '/datasets/'],
  NOTIFICATION_BANNER_DISPLAY_PATHS: ['/americas-finance-guide/'],
}));

const renderWithRouter = (ui, routeStr, {route=routeStr, history = createHistory(createMemorySource(route))} = {}) => {
  return {
    ...render(<LocationProvider history={history}>{ui}</LocationProvider>),
    history
  }
}
describe('SiteHeader', () => {


  beforeEach(() => {
    StaticQuery.mockImplementation(({ render }) => render({ mockUseStaticGlossaryData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockUseStaticGlossaryData
      };
    });
  });

  it('displays the the logo', async () => {
    const { getByTestId } = render(<SiteHeader />);
    expect(getByTestId('logo')).toBeDefined();
  });

  it('contains the site\'s official banner', () => {
    const { getByTestId } = render(<SiteHeader />);
    expect(getByTestId('officialBanner')).toBeDefined();
  });

  /**
   * expect one of each of these links as the mobile nav should not render the links unless opened
   */

  //logo
  it('contains the logo with title text', () => {
    const { getByTestId, getByTitle } = render(<SiteHeader />);
    const logo = getByTestId('logo');
    expect(logo).toBeDefined();
    expect(getByTitle('Return to home page')).toBeDefined();
  });

  //search link
  it('contains one link to the search page', () => {
    const { getAllByTestId } = render(<SiteHeader />);
    expect(getAllByTestId('search').length).toEqual(1);
  });

  //about
  it('contains one link to the about us page', () => {
    const { getAllByTestId } = render(<SiteHeader />);
    expect(getAllByTestId('about').length).toEqual(1);
  });

  it('displays the lowerEnvMessage when sent in props', () => {
    const message = 'Message';
    const { getByText } = render(<SiteHeader lowerEnvMsg={message} />);
    expect(getByText(message)).toBeDefined();
  });

  it('displays the topics button', () => {
    const { getByRole } = render(<SiteHeader />);
    expect(getByRole('button', {name: 'Topics'})).toBeInTheDocument();
  });

  it('displays the topics drop down when mousing over topics button', () => {
    const { getByRole } = render(<SiteHeader />);
    fireEvent.mouseEnter(getByRole('button', {name: 'Topics'}));
    expect(getByRole('link', {name: 'Overview'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'Debt'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'Deficit'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'Spending'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'Revenue'})).toBeInTheDocument();
  });

  it('displays the tools drop down when mousing over tool button', () => {
    const { getByRole } = render(<SiteHeader />);
    fireEvent.mouseEnter(getByRole('button', {name: 'Tools'}));
    expect(getByRole('link', {name: 'Currency Exchange Rates Converter'})).toBeInTheDocument();
  });

  it('displays the resources drop down when mousing over resources button', () => {
    const { getByRole } = render(<SiteHeader />);
    fireEvent.mouseEnter(getByRole('button', {name: 'Resources'}));
    expect(getByRole('button', {name: 'Glossary'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'API Documentation'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'Release Calendar'})).toBeInTheDocument();
  });

  it('collapses the topics drop down when tab is not focused on or within drop down', async () => {
    const { getByTestId, getByText, queryByTestId, getByRole } = render(<SiteHeader />);

    getByRole('button', {name: 'Topics'}).focus();
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeTruthy();
    });

    getByText('Overview').focus();
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeTruthy();
    });

    getByTestId('logo').focus();
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeFalsy();
    });
  });

  it('collapses the topics drop down when mouse is not over tab or menu', async () => {
    const { getByTestId, queryByTestId, getByRole } = render(<SiteHeader />);

    fireEvent.mouseEnter(getByRole('button', {name: 'Topics'}));
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeTruthy();
    });

    fireEvent.mouseEnter(getByTestId('search'));
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeFalsy();
    });
  });

  it('collapses the tools drop down when tab is not focused on or within drop down', async () => {
    const { getByTestId, getByText, queryByTestId, getByRole } = render(<SiteHeader />);

    getByRole('button', {name: 'Tools'}).focus();
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeTruthy();
    });

    getByText('Currency Exchange Rates Converter').focus();
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeTruthy();
    });

    getByTestId('logo').focus();
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeFalsy();
    });
  });

  it('collapses the tools drop down when mouse is not over tab or menu', async () => {
    const { getByTestId, queryByTestId, getByRole } = render(<SiteHeader />);

    fireEvent.mouseEnter(getByRole('button', {name: 'Tools'}));
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeTruthy();
    });

    // TODO: figure out what is going on with this onMouseOver prop and improve tests
    // fireEvent.mouseOver(getByTestId('logo'));
    // await waitFor(() => {
    //   expect(queryByTestId('dropdownContent')).toBeFalsy();
    // });
  });

  it('collapses the resources drop down when tab is not focused on or within drop down', async () => {
    const { getByTestId, getByText, queryByTestId, getByRole } = render(<SiteHeader />);

    getByRole('button', {name: 'Resources'}).focus();
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeTruthy();
    });

    getByText('Release Calendar').focus();
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeTruthy();
    });

    getByTestId('logo').focus();
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeFalsy();
    });
  });

  it('collapses the resources drop down when mouse is not over tab or menu', async () => {
    const { getByTestId, queryByTestId, getByRole } = render(<SiteHeader />);

    fireEvent.mouseEnter(getByRole('button', {name: 'Resources'}));
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeTruthy();
    });

    // TODO: figure out what is going on with this onMouseOver prop and improve tests
    // fireEvent.mouseOver(getByTestId('logo'));
    // await waitFor(() => {
    //   expect(queryByTestId('dropdownContent')).toBeFalsy();
    // });
  });

  it('closes each dropdown when another one opens ',  () => {
    const { getByRole, queryByRole } = render(<SiteHeader />);
    fireEvent.mouseEnter(getByRole('button', {name: 'Topics'}));
    expect(getByRole('link', {name: 'Overview'})).toBeInTheDocument();

    fireEvent.mouseEnter(getByRole('button', {name: 'Tools'}));
    expect(getByRole('link', {name: 'Currency Exchange Rates Converter'})).toBeInTheDocument();
    expect(queryByRole('link', {name: 'Overview'})).not.toBeInTheDocument();

    fireEvent.mouseEnter(getByRole('button', {name: 'Resources'}));
    expect(getByRole('link', {name: 'API Documentation'})).toBeInTheDocument();
    expect(queryByRole('link', {name: 'Currency Exchange Rates Converter'})).not.toBeInTheDocument();

    fireEvent.mouseEnter(getByRole('button', {name: 'Topics'}));
    expect(queryByRole('link', {name: 'API Documentation'})).not.toBeInTheDocument();
  });


  it('expects that all of the header links are not active/highlighted by default', () => {
    const { container } = render(<SiteHeader />);

    expect(container
      .getElementsByClassName(`${styles.activeLink}`).length
    ).toBe(0);
  });

  it('does not show browser notice if browser is not IE', () => {
    const { queryAllByTestId}  = render(<SiteHeader />);
    expect(queryAllByTestId('ieDetected').length).toEqual(0);
  });

  it('shows browser notice if browser is IE', () => {
    rdd.isIE = true;
    const { getByTestId } = render(<SiteLayout />);
    expect(getByTestId('ieDetected')).toBeDefined();
  });

  it('calls the appropriate analytics event when links are clicked on', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const pageTitle = 'test page title'
    const { getByTestId, getByText, getByRole } = render(<SiteHeader />);
    document.title = pageTitle;

    const logo = getByTestId('logo');
    const searchButton = getByTestId('search');
    const aboutButton = getByTestId('about');
    const topicsButton = getByRole('button', {name: 'Topics'});
    const resourcesButton = getByRole('button', {name: 'Resources'});

    logo.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Top Logo Click`,
      label: pageTitle
    });
    spy.mockClear();

    searchButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Top Dataset Search Click`,
      label: pageTitle
    });
    spy.mockClear();

    aboutButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Top About Us Click`,
      label: pageTitle
    });
    spy.mockClear();

    fireEvent.mouseEnter(topicsButton);
    const debtButton = getByText('Debt');
    debtButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Topics Click`,
      label: 'Debt'
    });
    spy.mockClear();

    fireEvent.mouseEnter(resourcesButton);
    const apiDocsButton = getByText('API Documentation');
    apiDocsButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Top API Documentation Click`,
      label: pageTitle
    });
    spy.mockClear();
  });

  it('opens the glossary menu when selected', async () => {
    const { getByRole, getByTestId } = render(<SiteHeader />);

    fireEvent.mouseEnter(getByRole('button', {name: 'Resources'}));
    const glossaryButton = getByRole('button', {name: 'Glossary'});
    fireEvent.click(glossaryButton);

    await waitFor(() => {
      expect(getByTestId('glossaryContainer')).toBeInTheDocument();
      expect(getByTestId('glossaryContainer')).toHaveClass('open');
    });
  });

  it('glossary menu closes when overlay is clicked', async () => {
    const { getByRole, getByTestId, queryByTestId } =
      render(<SiteHeader glossaryEvent={false} glossaryClickEventHandler={jest.fn()} />);

    fireEvent.mouseEnter(getByRole('button', {name: 'Resources'}));
    const glossaryButton = getByRole('button', {name: 'Glossary'});

    fireEvent.click(glossaryButton);
    const glossary = getByTestId('glossaryContainer');

    await waitFor(() => {
      expect(glossary).toHaveClass('open');
    });
    const glossaryOverlay = within(glossary).getByTestId('overlay');

    fireEvent(glossaryOverlay, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    await waitFor(() => {
      expect(glossary).not.toHaveClass('open');
    });
  });

  it('displays announcement banner for specified pages', () => {
    const { getByText } = renderWithRouter(<SiteHeader glossaryEvent={false} glossaryClickEventHandler={jest.fn()} />, '/datasets/');

    expect(getByText('Dataset Unavailable', {exact: false})).toBeInTheDocument();
    expect(getByText('Test Page Name', {exact: false})).toBeInTheDocument();
  })

  it('displays announcement banner for specified paths', () => {
    const { getByText } =
      renderWithRouter(<SiteHeader glossaryEvent={false} glossaryClickEventHandler={jest.fn()} />, '/americas-finance-guide/national-debt/');

    expect(getByText('Dataset Unavailable', {exact: false})).toBeInTheDocument();
    expect(getByText('Test Page Name', {exact: false})).toBeInTheDocument();
  })
});
