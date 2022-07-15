import React from 'react';
import {render} from "@testing-library/react";
import {TopicsSection} from "./topics-section";

global.___loader = {
  enqueue: jest.fn(),
}

describe('Topics section', () => {
  it('displays section header', () => {
    const { getByText } = render(
      <TopicsSection />
    );
    expect(getByText('TOPICS')).toBeInTheDocument();
  });

  it('displays the title with the book icon', () => {
    const { getByText, getByRole } = render(
      <TopicsSection />
    );
    expect(getByText('Your Guide to America’s Finances')).toBeInTheDocument();
    expect(getByRole('img', {hidden:true}, {name: 'book-open'})).toBeInTheDocument();
  });
});
