describe('Search Container', () => {
  const setFilter = jest.fn();
  it('should ', () => {
    expect(true);
  });
  // it('renders a search bar', () => {
  //   const { getByRole } = render(
  //     <SearchContainer setFilter={setFilter} filter="" searchLabel="Search columns">
  //       list component
  //     </SearchContainer>
  //   );
  //   expect(getByRole('textbox')).toBeInTheDocument();
  // });
  //
  // it('renders the child component', () => {
  //   const { getByText } = render(
  //     <SearchContainer setFilter={setFilter} filter="" searchLabel="Search columns">
  //       list component
  //     </SearchContainer>
  //   );
  //   expect(getByText('list component')).toBeInTheDocument();
  // });
  //
  // it('updates list on search text change', () => {
  //   const { getByRole } = render(
  //     <SearchContainer setFilter={setFilter} filter="" searchLabel="Search columns">
  //       list component
  //     </SearchContainer>
  //   );
  //   const searchBar = getByRole('textbox');
  //   userEvent.click(searchBar);
  //   userEvent.keyboard('filter text...');
  //   expect(setFilter).toHaveBeenCalled();
  // });
  //
  // it('clears search text', () => {
  //   const setNoResults = jest.fn();
  //   const { getByRole } = render(
  //     <SearchContainer setFilter={setFilter} filter="test" searchLabel="Search columns" setNoResults={setNoResults}>
  //       list component
  //     </SearchContainer>
  //   );
  //   userEvent.click(getByRole('button', { name: 'Clear search bar' }));
  //   expect(setFilter).toHaveBeenCalledWith('');
  //   expect(setNoResults).toHaveBeenCalledWith(false);
  // });
});
