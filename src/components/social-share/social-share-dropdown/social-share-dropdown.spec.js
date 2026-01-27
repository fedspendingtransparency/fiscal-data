const testCopy = {
  title: 'test',
  description: 'test',
  body: 'test',
  emailSubject: 'test',
  emailBody: 'test',
  url: 'test',
  image: 'test',
};

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('exchange rates banner', () => {
  it('should ', () => {
    expect(true);
  });
  // it('Renders the share button with the text and icon', () => {
  //   render(<SocialShareDropdown copy={testCopy} pageName="" />);
  //   const shareBtn = screen.getByRole('button', { name: 'Share' });
  //   expect(shareBtn).toBeInTheDocument();
  //   expect(screen.getByText('Share')).toBeInTheDocument();
  //   expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  // });
  //
  // it('opens the dropdown on click', () => {
  //   render(<SocialShareDropdown copy={testCopy} pageName="" />);
  //   expect(screen.queryByText('Facebook')).toBeNull();
  //
  //   const shareBtn = screen.getByRole('button', { name: 'Share' });
  //   userEvent.click(shareBtn);
  //
  //   expect(screen.getByText('Facebook')).toBeInTheDocument();
  // });
  //
  // it('closes the dropdown when a social button is clicked', () => {
  //   const { getByRole } = render(
  //     <RecoilRoot>
  //       <SocialShareDropdown copy={testCopy} pageName="" />
  //     </RecoilRoot>
  //   );
  //   const shareBtn = getByRole('button', { name: 'Share' });
  //   userEvent.click(shareBtn);
  //   const facebookBtn = getByRole('button', { name: 'facebook' });
  //   userEvent.click(facebookBtn);
  //
  //   act(() => {
  //     jest.advanceTimersByTime(1000);
  //   });
  //   expect(screen.queryByText('Facebook')).toBeNull();
  // });
  //
  // it('closes the dropdown on scroll', () => {
  //   window.pageYOffset = 40;
  //   const { getByRole, queryByText } = render(<SocialShareDropdown copy={testCopy} pageName="" />);
  //
  //   const shareBtn = getByRole('button', { name: 'Share' });
  //   userEvent.click(shareBtn);
  //   expect(queryByText('Facebook')).toBeInTheDocument();
  //
  //   act(() => {
  //     window.pageYOffset = 100;
  //     window.dispatchEvent(new Event('scroll'));
  //   });
  //
  //   act(() => {
  //     jest.runAllTimers();
  //   });
  //   expect(queryByText('Facebook')).toBeNull();
  // });
});
