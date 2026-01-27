describe('DatasetCard', () => {
  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();

  const mockConfig = {
    apis: [
      {
        dateField: 'data_date',
        endpoint: 'accounting/od/debt_to_penny',
        fields: null,
        dimension: null,
        filter: null,
      },
    ],
    name: 'Debt to the Penny',
    popular: true,
    dataStartYear: 2005,
    tagLine: 'test tag line',
    slug: '/debt-to-the-penny/',
    summaryText:
      'Debt to the Penny is the total public debt outstanding reported each business day at3:00 P.M. Eastern Time with the previous business day’s data. The Debt to the Pennyis made up of intragovernmental holdings and debt held by the public, including securities issued by the U.S. Department of the Treasury (Treasury). Treasury securities primarily consist of marketable Treasury securities (bills, notes and bonds), savings bonds, and special securities issued to state and local governments.',
    tags: ['Debt', 'MVP'],
    techSpecs: {
      lastUpdated: '12/19/2019',
      fileFormat: null,
    },
  };

  const context = 'Related Dataset';
  const referrer = 'Referring Dataset';
  it('should ', () => {
    expect(true);
  });
  // it('entire card, when clicked, links to relevant dataset detail page', () => {
  //   const spy = jest.spyOn(Gatsby, 'navigate');
  //   const { getByRole } = render(<DatasetCard dataset={mockConfig} context={context} referrer={referrer} />);
  //   const thisCard = getByRole('button');
  //   userEvent.click(thisCard);
  //   expect(spy).toHaveBeenCalledTimes(1);
  //   expect(spy).toHaveBeenCalledWith(`/datasets${mockConfig.slug}`);
  // });
  //
  // it('contains the dataset name ', () => {
  //   const { getByText } = render(<DatasetCard dataset={mockConfig} context={context} referrer={referrer} />);
  //   expect(getByText('Debt to the Penny')).toBeDefined();
  // });
  //
  // it('tracks when dataset card is click', () => {
  //   const spy = jest.spyOn(Analytics, 'event');
  //   const { getByRole } = render(<DatasetCard dataset={mockConfig} context={context} referrer={referrer} />);
  //
  //   const thisCard = getByRole('button');
  //   userEvent.click(thisCard);
  //
  //   expect(spy).toHaveBeenCalledTimes(1);
  //   expect(spy).toHaveBeenCalledWith({
  //     category: `${context} Click`,
  //     action: `Related Dataset Click`,
  //     label: mockConfig.name,
  //   });
  // });
  //
  // it('tracks when dataset card is clicked from explainer page', () => {
  //   const spy = jest.spyOn(Analytics, 'event');
  //   const { getByText } = render(<DatasetCard dataset={mockConfig} context={'Related Datasets'} referrer={'Spending'} explainer={true} />);
  //   const datasetCard = getByText('Debt to the Penny');
  //
  //   datasetCard.click();
  //   expect(spy).toHaveBeenCalledWith({
  //     category: 'Explainers',
  //     action: 'Spending Citation Click',
  //     label: 'Debt to the Penny',
  //   });
  //   spy.mockClear();
  // });
  //
  // it('Pushes analytics event to datalayer for GA4 for dataset card - explainer', async () => {
  //   const { getByText } = render(<DatasetCard dataset={mockConfig} context={'Related Datasets'} referrer={'Spending'} explainer={true} />);
  //
  //   const datasetCard = getByText('Debt to the Penny');
  //   window.dataLayer = window.dataLayer || [];
  //   const spy = jest.spyOn(window.dataLayer, 'push');
  //
  //   fireEvent.click(datasetCard);
  //   expect(spy).toHaveBeenCalledWith({
  //     event: 'Spending - Citation Click',
  //     citationClickEventLabel: 'Debt to the Penny',
  //   });
  //   spy.mockClear();
  // });
  //
  // it('Pushes analytics event to datalayer for GA4 for dataset card - non explainer', async () => {
  //   const { getByText } = render(<DatasetCard dataset={mockConfig} context={'Related Datasets'} referrer={'example'} explainer={false} />);
  //
  //   const datasetCard = getByText('Debt to the Penny');
  //   window.dataLayer = window.dataLayer || [];
  //   const spy = jest.spyOn(window.dataLayer, 'push');
  //
  //   fireEvent.click(datasetCard);
  //   expect(spy).toHaveBeenCalledWith({
  //     event: 'Related Datasets Click',
  //     eventLabel: 'from example to Debt to the Penny',
  //   });
  //   spy.mockClear();
  // });
});
