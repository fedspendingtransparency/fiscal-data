import React from 'react';
import PageHelmet from './page-helmet';
import { cleanup, render } from '@testing-library/react';
import globalConstants from '../../helpers/constants';
import { waitFor } from '@testing-library/dom';
import { useStaticQuery } from 'gatsby';
import mockDatasetDetails from './mockDatasetDetails';

const pageTitle = 'Some Page';
const titleAppend = 'U.S. Treasury Fiscal Data';
const baseUrl = globalConstants.BASE_SITE_URL;
const defaultImage = baseUrl + '/logos/fiscal_data_logo_1200x628.png';
const versionInfoData = {
  gitTag: {
    name: '2021.5.1',
  },
  gitCommit: {
    hash: '123abc',
    date: 'date of commit',
    message: 'mock commit msg',
  },
  gitBranch: {
    name: 'prod',
  },
  currentBuildDate: {
    currentDate: 'mock build date',
  },
};
describe('page helmet', () => {
  afterEach(() => {
    cleanup();
  });

  describe('page helmet, normal', () => {
    beforeEach(() => {
      useStaticQuery.mockReturnValue(versionInfoData);
      render(<PageHelmet />, { container: document.head });
    });

    it('includes the dap script', () => {
      const dap = document.head.querySelector('script[id="_fed_an_ua_tag"]');
      expect(dap).toBeDefined();
      expect(dap.src).toBe('https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js?agency=TRE&subagency=FS');
    });

    // it('includes version-info', () => {
    //   const versionInfoScript = document.scriptTags.find(s => s.id === 'version-info');
    //   expect(versionInfoScript).toBeDefined();
    //   expect(versionInfoScript.innerHTML).toContain('TAG: 2021.5.1');
    //   expect(versionInfoScript.innerHTML).toContain('CURRENT BRANCH: prod');
    //   expect(versionInfoScript.innerHTML).toContain('COMMIT HASH: 123abc');
    //   expect(versionInfoScript.innerHTML).toContain('COMMIT MESSAGE: mock commit msg');
    //   expect(versionInfoScript.innerHTML).toContain('COMMIT DATE: date of commit');
    //   expect(versionInfoScript.innerHTML).toContain('ENV ID: production');
    // });

    it('does not include structured data when not needed', () => {
      expect(document.head.querySelector('script[type="application/ld+json"]')).toBeNull();
    });

    it('includes the correct default page title', () => {
      expect(document.title).toBe(titleAppend);
    });

    it('references the correct open graph url when none is passed in ', () => {
      const ogImageTag = document.head.querySelector('meta[property="og:image"]');
      expect(ogImageTag.content).toBe(`${baseUrl}/logos/fiscal_data_logo_1200x628.png`);
    });
  });

  describe('page helmet for structured data', () => {
    let structuredData;

    beforeEach(() => {
      useStaticQuery.mockReturnValue({ site: { siteMetadata: { siteUrl: baseUrl } } });

      render(<PageHelmet datasetDetails={mockDatasetDetails} />, { container: document.head });
      structuredData = JSON.parse(document.head.querySelector('script[type="application/ld+json"]').innerHTML);
    });

    it('includes structured data', () => {
      expect(structuredData).toBeDefined();
    });

    it('has all the right static values', () => {
      expect(structuredData['@context']).toBe('https://schema.org/');
      expect(structuredData['@type']).toBe('Dataset');
      expect(structuredData.creator).toBeDefined();
      expect(structuredData.distribution).toBeDefined();
    });

    it('includes the dynamic metadata', () => {
      expect(structuredData.name).toBe(mockDatasetDetails.name);
      expect(structuredData.description).toBe(mockDatasetDetails.tagLine);
      expect(structuredData.url).toContain(mockDatasetDetails.slug);
    });

    it('captures the tables within a dataset', () => {
      const sdFirst = structuredData.hasPart[0],
        mockFirst = mockDatasetDetails.apis[0];

      expect(structuredData.hasPart.length).toBe(mockDatasetDetails.apis.length);
      expect(sdFirst.name).toBe(mockFirst.tableName);
      expect(sdFirst.description).toBe(mockFirst.tableDescription);
    });

    it('uses the same open graph properties as meta names with addition of og:image', () => {
      const title = document.head.querySelector('meta[property="og:title"]');
      const description = document.head.querySelector('meta[property="og:description"]');
      const image = document.head.querySelector('meta[property="og:image"]');

      expect(title.content).toBe(titleAppend);
      expect(description).toBeDefined();
      expect(image.content).toBe(defaultImage);
    });

    it('defines the URL for each distribution', () => {
      expect(structuredData.distribution.every(d => d.contentUrl.includes(mockDatasetDetails.slug))).toBeTruthy();
    });

    it('represents each file type in the distribution', () => {
      ['CSV', 'JSON', 'XML'].forEach(format => {
        expect(structuredData.distribution.find(d => d.encodingFormat === format)).toBeDefined();
      });
    });

    it('sets the temporal coverage', () => {
      expect(structuredData.temporalCoverage).toMatch(/^\d{4}\-\d{2}\-\d{2}\/\d{4}\-\d{2}\-\d{2}$/);
    });

    it('includes the correct default page title', async () => {
      await waitFor(() => expect(document.title).toBe(titleAppend));
    });
  });

  describe('page helmet with specified title', () => {
    it('includes the correct page title when title is present in props', () => {
      render(<PageHelmet pageTitle={pageTitle} />, { container: document.head });
      expect(document.title).toBe(`${pageTitle} | ${titleAppend}`);
    });
  });

  const getMetaByName = metaName => {
    const metas = document.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i += 1) {
      if (metas[i].getAttribute('name') === metaName) {
        return metas[i].getAttribute('content');
      }
    }
    return '';
  };
  const staticDescription = 'mock static description';
  const dynamicDescription = 'Mock Dynamic SEO Description';

  describe('page helmet with canonical tag', () => {
    it('includes canonical with the prod url when the canonical prop is present', async () => {
      render(<PageHelmet canonical="/datasets/test-canonical" />, { container: document.head });
      const canonical = document.head.querySelector('link[rel="canonical"]');
      expect(canonical).toBeDefined();
      expect(canonical.href).toBe(`${baseUrl}/datasets/test-canonical`);
    });
  });

  // the two related describe blocks below are separated to prevent overlapping async dom updates
  describe('page helmet with static SEO description', () => {
    it('uses a static description when no descriptionGenerator supplied', async () => {
      render(<PageHelmet description={staticDescription} />, { container: document.head });
      await waitFor(() => expect(getMetaByName('description')).toEqual(staticDescription));
    });
  });

  describe('page helmet with dynamic SEO description', () => {
    it('calls the descriptionGenerator when one is supplied', async () => {
      const mockDescriptionGenerator = jest.fn().mockResolvedValue(dynamicDescription);

      render(<PageHelmet description="stand in" descriptionGenerator={mockDescriptionGenerator} />, { container: document.head });

      await waitFor(() => expect(getMetaByName('description')).toBe(dynamicDescription));

      expect(mockDescriptionGenerator).toHaveBeenCalled();
    });
  });
});
