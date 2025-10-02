import React from 'react';
import { mockAPIs, mockMaxDates, mockSummaryDataset, mockSummaryDatasetNoUpdates, mockTechSpecs, updateDates } from './helper';
import DatasetDetail from './dataset-detail';
import { useStaticQuery } from 'gatsby';
import metadataHelper from '../../helpers/metadata/metadata';
import { RecoilRoot } from 'recoil';
import { act, render } from '@testing-library/react';
import { datasetPageSampleConfig } from './test-helper';

// mocks the web worker
URL.createObjectURL = URL.createObjectURL || (() => 'blob:http://localhost/mock');
URL.createObjectURL = URL.createObjectURL || (() => {});
jest.mock('../../workers/pdfWorker', () => ({
  renderPDF: jest.fn().mockResolvedValue({
    url: 'blob:http://localhost/mock-pdf',
    size: '2kb',
  }),
}));

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
jest.mock('../../helpers/metadata/use-metadata-updater-hook', () => ({
  useMetadataUpdater: i => {
    return i;
  },
}));

describe('Dataset-Detail layout component', () => {
  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    })
  );

  // Necessary for API Quick Guide
  jest.spyOn(document, 'getElementById').mockReturnValueOnce({ scrollHeight: 100 });

  const metadataSummarySpy = jest.spyOn(metadataHelper, 'metadataSummary');
  metadataSummarySpy.mockReturnValue(Promise.resolve([mockSummaryDataset]));

  beforeAll(async () => {
    act(() => {
      useStaticQuery.mockReturnValue({
        site: {
          siteMetadata: {
            siteUrl: `https://fiscalData.treasury.gov`,
          },
        },
      });
    });
  });

  it('has a SiteLayout component placed forevermore within its layout', () => {
    const { getByTestId } = render(
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
    expect(getByTestId('siteLayout')).toBeInTheDocument();
  });

  it('has a DDNav component placed forevermore within its layout', async () => {
    const { findByTestId } = render(
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
    expect(await findByTestId('DDNavMenu')).toBeInTheDocument();
  });

  it('has a Masthead component placed forevermore within its layout', () => {
    const { getByTestId } = render(
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
    expect(getByTestId('masthead')).toBeInTheDocument();
  });

  it('renders all page sections', () => {
    const { getByRole } = render(
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
    expect(getByRole('heading', { name: 'Introduction' })).toBeInTheDocument();
    expect(getByRole('heading', { name: 'Data Preview' })).toBeInTheDocument();
    expect(getByRole('heading', { name: 'Dataset Properties' })).toBeInTheDocument();
    expect(getByRole('heading', { name: 'API Quick Guide' })).toBeInTheDocument();
    expect(getByRole('heading', { name: 'Related Datasets' })).toBeInTheDocument();
  });

  it('has a DatasetData component', () => {
    const { getByTestId } = render(
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
    expect(getByTestId('datasetData')).toBeInTheDocument();
  });

  it('passes content for the banner callout if set in config', async () => {
    const { getByTestId } = render(
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

    expect(getByTestId('callout')).toBeInTheDocument();
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
    act(() => {
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
            config: {
              ...datasetPageSampleConfig,
              bannerCallout: { banner: savingsBondsDelayBanner },
            },
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
            config: {
              ...datasetPageSampleConfig,
              bannerCallout: { banner: treasuryDirectDelayBanner },
            },
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
