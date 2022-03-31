import React from 'react';
import {render} from "@testing-library/react";
import About from './about-section';
import {useStaticQuery} from "gatsby";
import {testMDX, ulTestId} from "../helpers/helpers";

jest.mock("gatsby-plugin-mdx", () => {
  return { MDXRenderer: ({children}) => {
      return <div>{children}</div>;
    }
  }
});

describe('About Us - About Section', () => {

  it ('renders expected mdx components in the dom', () => {
    useStaticQuery.mockReturnValue(testMDX);
    const {getByTestId} = render(<About />);
    expect(getByTestId(ulTestId)).toBeInTheDocument();
  });

  it('renders no markdown if the mdx query returns unexpected results', () => {
    let renderer;
    useStaticQuery.mockReturnValue({});
    renderer = render(<About />);
    expect(renderer.queryAllByTestId(ulTestId).length).toBe(0);

    useStaticQuery.mockReturnValue({mdx: {}});
    renderer = render(<About />);
    expect(renderer.queryAllByTestId(ulTestId).length).toBe(0);

    useStaticQuery.mockReturnValue({mdx: {data: ''}});
    renderer = render(<About />);
    expect(renderer.queryAllByTestId(ulTestId).length).toBe(0);
  });
});
