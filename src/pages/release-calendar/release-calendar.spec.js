import React from 'react';
import renderer from 'react-test-renderer';
import { useStaticQuery } from "gatsby";

import ReleaseCalendar from './index';
import SiteLayout from "../../components/siteLayout/siteLayout";
import PageHelmet from '../../components/page-helmet/page-helmet';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import internalData from '../../testData/__dataConfig_for_tests.json';
import {tagLineText} from "../../helpers/release-calendar/release-calendar-content-helper";

jest.mock(
  '../../components/calendar-entries/use-release-calendar-entries-updater-hook',
  () => ({ useReleaseCalendarEntriesUpdater: (i) => { return i;} }));

jest.useFakeTimers();
describe('Release Calendar', () => {

  let component = renderer.create();
  let instance;

  const profilerConfigMockData = {
    allDatasets: {
      datasets: internalData.datasets
    },
    allReleases: {
      releases: internalData.releases
    }
  };

  beforeAll(() => {
    useStaticQuery.mockReturnValue(profilerConfigMockData);
    renderer.act(() => {
      component = renderer.create(
        <ReleaseCalendar />
      )
    });
    instance = component.root;
  });

  it('includes the SiteLayout component', () => {
    const siteLayout = instance.findByType(SiteLayout);
    expect(siteLayout).toBeDefined();
  });

  it('supplies the required values to the page helmet', () => {
    const helmet = instance.find(e => e.type === PageHelmet);
    expect(helmet.props.pageTitle).toBe('Fiscal Data Release Calendar');
    expect(helmet.props.description).toBe(tagLineText);
    expect(helmet.props.keywords).toBeDefined();
  });

  it('includes breadcrumbs', () => {
    const breadcrumbs = instance.find(e => e.type === BreadCrumbs);
    expect(breadcrumbs).toBeDefined();
  });

  it('includes the page title and tagline', () => {
    const pageTitle = instance.findByProps({'data-testid': 'page-title'});
    const tagline = instance.findByProps({'data-testid': 'tag-line'});
    expect(pageTitle.props.children).toBe('Release Calendar');
    expect(tagline.props.children).toBe(tagLineText);
  });

});
