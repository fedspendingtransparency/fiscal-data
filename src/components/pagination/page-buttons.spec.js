import React from 'react';
import renderer from 'react-test-renderer';
import PageButtons from './page-buttons';

describe('PageButtons component', () => {
  const pages = [1,2,3,4,5,6];
  const pageButtonProps = {
    maxPage: 5,
    tableName: 'test',
    currentPage: 1,
    pagesArray: pages,
    handleJump: () => {},
  };
  const { maxPage, tableName } = pageButtonProps;

  const component = renderer.create(
  <PageButtons pageButtonProps={pageButtonProps} />);
  const instance = component.root;

  it('renders correct number of buttons (pages + next + prev)', () => {
    expect(instance.findAllByType('button').length).toEqual(pages.length + 2);
  });

  it('renders a next button that is active when active page is not last page', () => {
    const nextButton = instance.findByProps({'id': `${tableName}-page-next`});
    expect(nextButton).toBeDefined();
    expect(nextButton.props.disabled).toBeFalsy();
  });

  it('renders a previous button that is disabled when active page is 1', () => {
    const prevButton = instance.findByProps({'id': `${tableName}-page-prev`});
    expect(prevButton).toBeDefined();
    expect(prevButton.props.disabled).toBeTruthy();
  });

  it('disables the next button when active page is last page', () => {
    pageButtonProps.currentPage = maxPage;
    renderer.act(() => {
      component.update(<PageButtons pageButtonProps={pageButtonProps} />);
    });
    const nextButton = instance.findByProps({'id': `${tableName}-page-next`});
    expect(nextButton).toBeDefined();
    expect(nextButton.props.disabled).toBeTruthy();
  });

  it('indicates the active page', () => {
    const activeButton = instance.findByProps({'id': `${tableName}-page${maxPage}`});
    expect(activeButton.props.className).toContain('active');
    expect(instance.findAllByProps({'className': 'active'}).length).toEqual(1);
  });

  it('shows first and last page when ellipsis is showing', () => {
    pageButtonProps.pagesArray.push(9);
    pageButtonProps.pagesArray.push(10);
    renderer.act(() => {
      component.update(<PageButtons pageButtonProps={pageButtonProps} />);
    });
    expect(instance.findByProps({'id': `${tableName}-page1`})).toBeDefined();
    expect(instance.findByProps({'id': `${tableName}-page10`})).toBeDefined();
  });
});
