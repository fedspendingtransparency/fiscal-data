import {render} from "@testing-library/react";
import FolderIllustration from "./folder-illustration";
import React from "react";

describe('Folder Illustration', () => {

  const mockTabList = [
    {
      title: 'Tab 1',
      content: <div>Tab 1 Content</div>
    },
    {
      title: 'Tab 2',
      content: <div>Tab 2 Content</div>
    },
    {
      title: 'Tab 3',
      content: <div>Tab 3 Content</div>
    },
  ]

  it('renders all three tab titles', () => {
    const {getByText} = render(<FolderIllustration tabList={mockTabList} color={'#000000'}/>);
    expect(getByText('Tab 1')).toBeInTheDocument();
    expect(getByText('Tab 2')).toBeInTheDocument();
    expect(getByText('Tab 3')).toBeInTheDocument();
  });

  it('renders all three tabs content', () => {
    const {getByText} = render(<FolderIllustration tabList={mockTabList} color={'#000000'}/>);
    expect(getByText('Tab 1 Content')).toBeInTheDocument();
    let tab = getByText('Tab 2');
    tab.click();
    expect(getByText('Tab 2 Content')).toBeInTheDocument();
    tab = getByText('Tab 3');
    tab.click();
    expect(getByText('Tab 3 Content')).toBeInTheDocument();
  });
});
