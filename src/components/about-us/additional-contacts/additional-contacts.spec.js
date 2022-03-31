import React from 'react';
import { render } from '@testing-library/react';
import { useStaticQuery } from "gatsby";
import { testMDX, ulTestId } from "../helpers/helpers";
import AdditionalContacts from "./additional-contacts";

jest.requireActual('@mdx-js/react');

jest.mock("gatsby-plugin-mdx", () => {
  return { MDXRenderer: ({children}) => {
      return children;
    } }
});

jest.useFakeTimers();

describe('About Us - Additional Contacts', () => {
  let renderer;
  beforeAll(() => {
    useStaticQuery.mockReturnValue(testMDX);
    renderer = render(<AdditionalContacts />);
    jest.runAllTimers();
  });

  it ('renders expected mdx components in the dom', () => {
    expect(renderer.getByTestId(ulTestId)).toBeInTheDocument();
  });
});
