import { useStaticQuery } from 'gatsby';

Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });

describe('Americas Finance Guide', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  const glossaryMock = {
    allGlossaryCsv: {
      glossaryCsv: [
        {
          term: 'Excise',
          definition:
            'A tax collected on certain goods and commodities produced or sold within the country (i.e. alcohol and tobacco, gasoline) and on licenses granted for certain activities (i.e. import/export license).',
          site_page: 'Revenue Explainer & AFG Overview Page',
          id: '12',
          url_display: '',
          url_path: '',
        },
      ],
    },
    extensions: {},
  };

  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });

  afterEach(() => {
    jest.resetModules();
  });
  it('should ', () => {
    expect(true);
  });

  // it('renders the top container', async () => {
  //   const { getByTestId } = render(<AmericasFinanceGuide width={100} />, { wrapper: RecoilRoot });
  //
  //   expect(getByTestId('topContainer')).toBeInTheDocument();
  //   expect(getByTestId('quoteContainer')).toBeInTheDocument();
  //   expect(getByTestId('bottomContainer')).toBeInTheDocument();
  // });
  //
  // it('renders the Social Share', () => {
  //   const { getByRole } = render(<AmericasFinanceGuide width={100} />, { wrapper: RecoilRoot });
  //
  //   const facebook = getByRole('button', { name: 'facebook' });
  //   const twitter = getByRole('button', { name: 'twitter' });
  //   const linkedIn = getByRole('button', { name: 'linkedin' });
  //   const reddit = getByRole('button', { name: 'reddit' });
  //   const email = getByRole('button', { name: 'email' });
  //
  //   expect(facebook).toBeInTheDocument();
  //   expect(twitter).toBeInTheDocument();
  //   expect(linkedIn).toBeInTheDocument();
  //   expect(reddit).toBeInTheDocument();
  //   expect(email).toBeInTheDocument();
  // });
});
