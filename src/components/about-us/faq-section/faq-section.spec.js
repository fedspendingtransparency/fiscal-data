import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import FAQ from './faq-section';
import {useStaticQuery} from "gatsby";
import {testMDX, ulTestId} from "../helpers/helpers";

jest.mock("gatsby-plugin-mdx", () => {
  return { MDXRenderer: ({children}) => {
      return <div>{children}</div>;
    } }
});

describe('About Us - FAQ section', () => {

  beforeAll(() => {
    useStaticQuery.mockReturnValue(testMDX);
  });
  // todo - Update test below when we integrate the highlight actions using mdx
  it('does not Highlight Who Can I Contact when highlights have not been triggered', async () => {
    let component = renderer.create();
    await renderer.act(async () => {
      component = renderer.create(<FAQ triggerHighlight={0} />);
    });
    const instance = component.root;
    expect(instance.findAllByType('mark').length).toBe(0);
  });

  it('renders expected mdx content in the document', () => {
    expect(render(<FAQ />).getByTestId(ulTestId)).toBeInTheDocument();
  });

})
