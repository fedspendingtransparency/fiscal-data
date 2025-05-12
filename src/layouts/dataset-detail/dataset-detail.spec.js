import React from 'react';
import renderer from 'react-test-renderer';
import { mockAPIs, mockMaxDates, mockSummaryDataset, mockSummaryDatasetNoUpdates, mockTechSpecs, updateDates } from './helper';
import DDNav from '../../components/dataset-detail-nav/dataset-detail-nav';
import DatasetDetail from './dataset-detail';
import DatasetAbout from '../../components/dataset-about/dataset-about';
import DatasetData from '../../components/dataset-data/dataset-data';
import ApiQuickGuide from '../../components/api-quick-guide/api-quick-guide';
import Masthead from '../../components/masthead/masthead';
import RelatedDatasets from '../../components/related-datasets/related-datasets';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import { useStaticQuery } from 'gatsby';
import metadataHelper from '../../helpers/metadata/metadata';
import { RecoilRoot } from 'recoil';
import DatasetIntroduction from '../../components/dataset-introduction/dataset-introduction';
import { render } from '@testing-library/react';

const mockQueryReturn = {
  allDatasets: {
    datasets: [
      {
        slug: '/blah/',
        name: 'dataset 1',
        tagLine: 'dataset 1 does this',
        relatedTopics: ['one', 'two', 'three'],
        techSpecs: {
          earliestDate: '01/01/01',
          latestDate: '02/02/02',
          updateFrequency: 'monthly',
          lastUpdated: '01/01/20',
          fileFormat: 'yes',
        },
        dictionary: 1,
      },
    ],
  },
};

const seoConfig = {
  datasetId: '015-BFS-2014Q1-11',
  pageTitle: 'Monthly Statement of the Public Debt (MSPD)',
  description:
    'This dataset provides high-level information on the federal government’s ' +
    'outstanding debts, holdings, and the statutory debt limit on a monthly basis.',
  keywords: 'debt, public debt, government debt, Treasury, open data, monthly statement public debt, mspd, us debt, debt limit',
};

jest.mock('../../components/filter-download-container/filter-download-container.jsx', () => () => 'FilterDownloadContainer');
jest.mock('../../components/dataset-detail-nav/dataset-detail-nav.jsx', () => () => 'DDNav');
jest.mock('../../helpers/metadata/use-metadata-updater-hook', () => ({
  useMetadataUpdater: i => {
    return i;
  },
}));

describe('Dataset-Detail layout component', () => {
  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) }));

  // Necessary for API Quick Guide
  jest.spyOn(document, 'getElementById').mockReturnValueOnce({ scrollHeight: 100 });

  const metadataSummarySpy = jest.spyOn(metadataHelper, 'metadataSummary');
  metadataSummarySpy.mockReturnValue(Promise.resolve([mockSummaryDataset]));

  let component = renderer.create();
  let instance;
  beforeAll(async () => {
    await renderer.act(async () => {
      useStaticQuery.mockReturnValue({
        site: {
          siteMetadata: {
            siteUrl: `https://fiscalData.treasury.gov`,
          },
        },
      });
      component = await renderer.create(
        <RecoilRoot>
          <DatasetDetail
            test={true}
            pageContext={{
              config: datasetPageSampleConfig,
              seoConfig: seoConfig,
            }}
            data={mockQueryReturn}
          />
        </RecoilRoot>
      );
      instance = component.root;
    });
  });

  it('has a SiteLayout component placed forevermore within its layout', () => {
    // this statement causes test to fail if there's not exactly one <SiteLayout /> in layout
    instance.find(obj => obj.type === SiteLayout);
  });

  it('has a DDNav component placed forevermore within its layout', () => {
    // this statement causes test to fail if there's not exactly one <DDNav /> in layout
    instance.find(obj => obj.type === DDNav);
  });

  it('has a Masthead component placed forevermore within its layout', () => {
    // this statement causes test to fail if there's not exactly one <Masthead /> in layout
    instance.find(obj => obj.type === Masthead);
  });

  it('has a DatasetAbout component placed forevermore within its layout', () => {
    // this statement causes test to fail if there's not exactly one <DatasetAbout /> in layout
    instance.find(obj => obj.type === DatasetAbout);
  });

  it('has a DatasetIntroduction component placed forevermore within its layout', () => {
    // this statement causes test to fail if there's not exactly one <DatasetIntroduction /> in layout
    instance.find(obj => obj.type === DatasetIntroduction);
  });

  it('has a DatasetData component and passes the setSelectedTable prop', () => {
    // this statement causes test to fail if there's not exactly one <DatasetData /> in layout
    const datasetDataComp = instance.find(obj => obj.type === DatasetData);
    expect(datasetDataComp.props.setSelectedTableProp).toBeDefined();
  });

  it('has an ApiQuickGuide component and passes the selectedTable prop', () => {
    // this statement causes test to fail if there's not exactly one <ApiQuickGuide /> in layout
    const apiComp = instance.find(obj => obj.type === ApiQuickGuide);
    expect(apiComp.props.selectedTable).toBeDefined();
  });

  it('has an RelatedDatasets component placed forevermore within its layout', () => {
    // this statement causes test to fail if there's not exactly one <RelatedDatasets /> in layout
    instance.find(obj => obj.type === RelatedDatasets);
  });

  it('ensures that the proper ordering of the dataset tables is preserved when passed down to dataset-data', () => {
    const datasetData = instance.findByType(DatasetData);
    expect(datasetData.props.config.apis.map(api => api.apiId)).toEqual(datasetPageSampleConfig.apis.map(api => api.apiId));
  });

  it("ensures that the proper ordering of the dataset tables' fields are preserved when passed down to dataset-data", () => {
    const datasetData = instance.findByType(DatasetData);
    expect(datasetData.props.config.apis[0].fields).toEqual(datasetPageSampleConfig.apis[0].fields);
  });

  it('passes expected fields to helmet for structured data', () => {
    const helmet = instance.findByType(PageHelmet);
    expect(helmet.props.datasetDetails).toBeDefined();
    expect(helmet.props.pageTitle).toBe(seoConfig.pageTitle);
    expect(helmet.props.description).toBe(seoConfig.description);
    expect(helmet.props.keywords).toBe(seoConfig.keywords);
  });

  it('passes name of dataset to Related Datasets as a referrer', () => {
    const related = instance.findByType(RelatedDatasets);
    expect(related.props.referrer).toBe(datasetPageSampleConfig.name);
  });

  it('passes content for the banner callout if set in config', async () => {
    await renderer.act(async () => {
      useStaticQuery.mockReturnValue({
        site: {
          siteMetadata: {
            siteUrl: `https://fiscalData.treasury.gov`,
          },
        },
      });
      component = await renderer.create(
        <RecoilRoot>
          <DatasetDetail
            test={true}
            pageContext={{
              config: { ...datasetPageSampleConfig, bannerCallout: { banner: 'TestCallout' } },
              seoConfig: seoConfig,
            }}
            data={mockQueryReturn}
          />
        </RecoilRoot>
      );
      instance = component.root;
    });

    const masthead = instance.findByType(Masthead);
    expect(masthead.props.bannerCallout.banner).toBe('TestCallout');
  });
});

describe('Dataset detail - helper updateDates', () => {
  let consoleWarn;

  beforeAll(() => {
    consoleWarn = global.console.warn;
    global.console.warn = jest.fn();
  });

  afterAll(() => {
    global.console.warn = consoleWarn;
  });

  it('returns false if the inputs are invalid', () => {
    expect(updateDates(mockSummaryDataset, mockAPIs, null)).toBeFalsy();
    expect(updateDates(mockSummaryDataset, null, mockTechSpecs)).toBeFalsy();
    expect(updateDates(null, mockAPIs, null)).toBeFalsy();
    expect(updateDates({}, mockAPIs, null)).toBeFalsy();
  });

  it('returns false if there are no changes if no updates are found', () => {
    expect(updateDates(mockSummaryDatasetNoUpdates, mockAPIs, mockTechSpecs)).toBeFalsy();
  });

  it('returns true and updates both mockAPIs and mockTechSpecs if updates are found', () => {
    const newMockAPIs = JSON.parse(JSON.stringify(mockAPIs));
    const newMockTechSpecs = JSON.parse(JSON.stringify(mockTechSpecs));
    expect(newMockAPIs).toEqual(mockAPIs);
    expect(newMockTechSpecs).toEqual(mockTechSpecs);

    expect(updateDates(mockSummaryDataset, newMockAPIs, newMockTechSpecs)).toBeTruthy();

    expect(newMockAPIs).not.toEqual(mockAPIs);
    expect(newMockTechSpecs).not.toEqual(mockTechSpecs);

    expect(newMockTechSpecs.latestDate).toEqual(mockMaxDates.latestDateTechSpecs);
    expect(newMockTechSpecs.lastUpdated).toEqual(mockMaxDates.lastUpdatedTechSpecs);
    expect(newMockAPIs[0].lastUpdated).toEqual(mockMaxDates.lastUpdated);
    expect(newMockAPIs[1].latestDate).toEqual(mockMaxDates.latestDate);
  });
});

describe('Dataset - banner callout', () => {
  beforeAll(async () => {
    await renderer.act(async () => {
      useStaticQuery.mockReturnValue({
        site: {
          siteMetadata: {
            siteUrl: `https://fiscalData.treasury.gov`,
          },
        },
      });
    });
  });

  const testBanner = {
    banner: 'XRCallout',
  };

  const savingsBondsDelayBanner = {
    banner: 'SavingsBondsDelay',
  };

  const treasuryDirectDelayBanner = {
    banner: 'TreasuryDirectDelay',
  };

  it('renders callout when specified', () => {
    const { queryByTestId } = render(
      <RecoilRoot>
        <DatasetDetail
          test={true}
          pageContext={{
            config: { ...datasetPageSampleConfig, bannerCallout: { banner: 'Test banner' } },
            seoConfig: seoConfig,
          }}
          data={mockQueryReturn}
        />
      </RecoilRoot>
    );

    expect(queryByTestId('callout')).not.toBeNull();
  });

  it('renders warning callout when SavingsBondsDelay banner specified', () => {
    const { queryByTestId } = render(
      <RecoilRoot>
        <DatasetDetail
          test={true}
          pageContext={{
            config: { ...datasetPageSampleConfig, bannerCallout: { banner: savingsBondsDelayBanner } },
            seoConfig: seoConfig,
          }}
          data={mockQueryReturn}
        />
      </RecoilRoot>
    );

    expect(queryByTestId('callout')).not.toBeNull();
  });

  it('renders warning callout when TreasuryDirectDelay banner specified', () => {
    const { queryByTestId } = render(
      <RecoilRoot>
        <DatasetDetail
          test={true}
          pageContext={{
            config: { ...datasetPageSampleConfig, bannerCallout: { banner: treasuryDirectDelayBanner } },
            seoConfig: seoConfig,
          }}
          data={mockQueryReturn}
        />
      </RecoilRoot>
    );

    expect(queryByTestId('callout')).not.toBeNull();
  });

  it('renders warning callout when not SavingsBondsDelay or TreasuryDirectDelay banner specified', () => {
    const { queryByTestId } = render(
      <RecoilRoot>
        <DatasetDetail
          test={true}
          pageContext={{
            config: { ...datasetPageSampleConfig, bannerCallout: { banner: testBanner } },
            seoConfig: seoConfig,
          }}
          data={mockQueryReturn}
        />
      </RecoilRoot>
    );

    expect(queryByTestId('callout')).not.toBeNull();
  });

  it('does not render callout when not specified', () => {
    const { queryByTestId } = render(
      <RecoilRoot>
        <DatasetDetail
          test={true}
          pageContext={{
            config: { ...datasetPageSampleConfig },
            seoConfig: seoConfig,
          }}
          data={mockQueryReturn}
        />
      </RecoilRoot>
    );
    expect(queryByTestId('callout')).toBeNull();
  });

  it('hides api specific sections when hideRawDataTable is true', () => {
    const { getByRole, queryByRole } = render(
      <RecoilRoot>
        <DatasetDetail
          test={true}
          pageContext={{
            config: { ...datasetPageSampleConfig, hideRawDataTable: true },
            seoConfig: seoConfig,
          }}
          data={mockQueryReturn}
        />
      </RecoilRoot>
    );
    expect(getByRole('heading', { name: 'Introduction' })).toBeInTheDocument();
    expect(queryByRole('heading', { name: 'Data Preview' })).not.toBeInTheDocument();
    expect(getByRole('heading', { name: 'Dataset Properties' })).toBeInTheDocument();
    expect(queryByRole('heading', { name: 'API Quick Guide' })).not.toBeInTheDocument();
    expect(getByRole('heading', { name: 'Related Datasets' })).toBeInTheDocument();
  });
});
