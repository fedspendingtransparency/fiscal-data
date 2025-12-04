import React from 'react';
import PageButtons from './page-buttons';
import { fireEvent, render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

describe('PageButtons component', () => {
  const pages = [1, 2, 3, 4, 5, 6];
  const pageButtonProps = {
    maxPage: 5,
    tableName: 'test',
    currentPage: 1,
    pagesArray: pages,
    handleJump: () => {},
  };
  const { maxPage, tableName } = pageButtonProps;

  it('renders correct number of buttons (pages + next + prev)', () => {
    const { getAllByRole } = render(
      <RecoilRoot>
        <PageButtons pageButtonProps={pageButtonProps} />
      </RecoilRoot>
    );
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(pages.length + 2);
  });

  it('renders a next button that is active when active page is not last page', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageButtons pageButtonProps={pageButtonProps} />
      </RecoilRoot>
    );
    const nextButton = getByRole('button', { name: 'Next page' });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).not.toBeDisabled();
  });

  it('renders a previous button that is disabled when active page is 1', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageButtons pageButtonProps={pageButtonProps} />
      </RecoilRoot>
    );
    const prevButton = getByRole('button', { name: 'Previous page' });
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).toBeDisabled();
  });

  it('disables the next button when active page is last page', () => {
    pageButtonProps.currentPage = maxPage;
    const { getByRole } = render(
      <RecoilRoot>
        <PageButtons pageButtonProps={pageButtonProps} />
      </RecoilRoot>
    );
    const nextButton = getByRole('button', { name: 'Next page' });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });

  it('indicates the active page', () => {
    pageButtonProps.currentPage = maxPage;
    const { getByRole } = render(
      <RecoilRoot>
        <PageButtons pageButtonProps={pageButtonProps} />
      </RecoilRoot>
    );
    const activeButton = getByRole('button', { name: `${tableName}-page${maxPage}` });
    expect(activeButton).toBeInTheDocument();
    expect(activeButton).toHaveClass('active');
    const inactiveButton = getByRole('button', { name: `${tableName}-page${maxPage - 1}` });
    expect(inactiveButton).toBeInTheDocument();
    expect(inactiveButton).not.toHaveClass('active');
  });

  it('shows first and last page when ellipsis is showing', () => {
    pageButtonProps.pagesArray.push(9);
    pageButtonProps.pagesArray.push(10);
    const { getByRole } = render(
      <RecoilRoot>
        <PageButtons pageButtonProps={pageButtonProps} />
      </RecoilRoot>
    );
    const firstButton = getByRole('button', { name: `${tableName}-page1` });
    expect(firstButton).toBeInTheDocument();
    const lastButton = getByRole('button', { name: `${tableName}-page10` });
    expect(lastButton).toBeInTheDocument();
  });

  it('correctly changes to a new page when its button-number is clicked', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageButtons pageButtonProps={pageButtonProps} />
      </RecoilRoot>
    );
    const secondButton = getByRole('button', { name: `${tableName}-page2` });
    expect(secondButton).toBeInTheDocument();
    fireEvent.click(secondButton);
    expect(secondButton).toHaveClass('active');
  });

  it('correctly changes pages when clicking the next button', () => {
    pageButtonProps.currentPage = 1;
    const { getByRole } = render(
      <RecoilRoot>
        <PageButtons pageButtonProps={pageButtonProps} />
      </RecoilRoot>
    );
    const nextButton = getByRole('button', { name: 'Next page' });
    fireEvent.click(nextButton);
    const secondButton = getByRole('button', { name: `${tableName}-page2` });
    expect(secondButton).toHaveClass('active');
  });

  it('correctly changes pages when clicking the previous button', () => {
    pageButtonProps.currentPage = 2;
    const { getByRole } = render(
      <RecoilRoot>
        <PageButtons pageButtonProps={pageButtonProps} />
      </RecoilRoot>
    );
    const prevButton = getByRole('button', { name: 'Previous page' });
    fireEvent.click(prevButton);
    const firstButton = getByRole('button', { name: `${tableName}-page1` });
    expect(firstButton).toHaveClass('active');
  });

  it('renders the correct page range and ellipsis (when range > 7)', () => {
    pageButtonProps.maxPage = 8;
    const { getByRole } = render(
      <RecoilRoot>
        <PageButtons pageButtonProps={pageButtonProps} />
      </RecoilRoot>
    );
    const ellipsisButton = getByRole('button', { name: 'Page number overflow ellipsis' });
    expect(ellipsisButton).toBeInTheDocument();
  });
});
