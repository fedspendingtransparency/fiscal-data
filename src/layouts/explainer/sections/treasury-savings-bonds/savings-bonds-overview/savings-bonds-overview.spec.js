describe('Savings Bonds Overview Section', () => {
  it('should ', () => {
    expect(true);
  });
  // it('renders the section', () => {
  //   const { container } = render(<SavingsBondsOverview />);
  //   expect(container).toBeInTheDocument();
  // });
  //
  // it('renders the quote box', () => {
  //   const { getByRole, getAllByRole } = render(<SavingsBondsOverview />);
  //   expect(getAllByRole('img', { hidden: true })[1]).toHaveClass('fa-calculator');
  //   expect(getByRole('link', { name: 'Savings Bond Calculator' })).toBeInTheDocument();
  // });
  //
  // it('calls glossary ga events', () => {
  //   const analyticsSpy = jest.spyOn(Analytics, 'event');
  //   const { getByRole } = render(<SavingsBondsOverview />);
  //   const glossaryButton = getByRole('button', { name: 'securities' });
  //   userEvent.click(glossaryButton);
  //   expect(analyticsSpy).toHaveBeenCalledWith({ action: 'Glossary Term Click', category: 'Explainers', label: 'Savings Bonds - Treasury Security' });
  // });
  //
  // it('calls citation click ga events', () => {
  //   const analyticsSpy = jest.spyOn(Analytics, 'event');
  //   const { getByRole } = render(<SavingsBondsOverview />);
  //   const citation1 = getByRole('link', { name: 'TreasuryDirect' });
  //   const citation2 = getByRole('link', { name: 'Savings Bond Calculator' });
  //   const footnote = getByRole('link', { name: '1' });
  //   userEvent.click(citation1);
  //   expect(analyticsSpy).toHaveBeenCalledWith({ action: 'Savings Bonds Citation Click', category: 'Explainers', label: 'TreasuryDirect' });
  //   userEvent.click(citation2);
  //   expect(analyticsSpy).toHaveBeenCalledWith({ action: 'Savings Bonds Citation Click', category: 'Explainers', label: 'Savings Bond Calculator' });
  //   userEvent.click(footnote);
  //   expect(analyticsSpy).toHaveBeenCalledWith({
  //     action: 'Footnote Click',
  //     category: 'Explainers',
  //     label: 'Savings Bonds - Footnote Click',
  //   });
  // });
});
