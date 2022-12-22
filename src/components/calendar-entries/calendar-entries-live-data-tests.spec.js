import internalData from "../../testData/__dataConfig_for_tests.json";
import {useStaticQuery} from "gatsby";
import fetchMock from "fetch-mock";
import {render} from "@testing-library/react";
import CalendarEntriesList from "./calendar-entries";
import React from "react";

const mockLiveEntries = [
  {
    datasetId:"015-BFS-2014Q3-038",
    date:"2023-03-03",
    time:"04:59",
    released:"false"
  },
  {
    datasetId:"015-BFS-2014Q3-038",
    date:"2023-02-03",
    time:"04:59",
    released:"false"
  },
  {
    datasetId:"015-BFS-2014Q3-038",
    date:"2023-01-04",
    time:"04:59",
    released:"false"
  },
  {
    datasetId:"015-BFS-2014Q3-038",
    date:"2023-01-04",
    time:"04:59",
    released:"false"
  }
];



describe('Test live data', () => {

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
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/calendar/release`,
      mockLiveEntries,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
  });

  it('renders a list of calendar entries from live data', () => {
    const component = render(<CalendarEntriesList />);
    expect(component).toBeDefined();
  });

});
