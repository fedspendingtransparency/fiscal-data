import React from 'react';
import {render} from "@testing-library/react";
import ContactSection from './contact-section';
import {useStaticQuery} from "gatsby";
import {testMDX, ulTestId} from "../helpers/helpers";

jest.mock("gatsby-plugin-mdx", () => {
  return { MDXRenderer: ({children}) => {
      return <div>{children}</div>;
    }
  }
});

describe('About Us - Contact Section', () => {
  let renderer;
  beforeAll(() => {
    useStaticQuery.mockReturnValue(testMDX);
    renderer = render(<ContactSection />);
  });

  it ('renders expected mdx components in the dom', () => {
    expect(renderer.getAllByTestId(ulTestId).length).toBeGreaterThan(0);
  });
});
