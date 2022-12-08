import Feature, { FeaturePageProps } from "./feature";
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import React from "react";
import PageHelmet from "../../components/page-helmet/page-helmet";
import {format} from "date-fns";

jest.mock("gatsby-plugin-mdx", () => {
  return { MDXRenderer: ({children}) => {
      // MDXRenderer won't actually run dangerouslySetInnerHTML.
      // Jest needs additional configurations to have MDXRenderer work as intended.
      return <div
        dangerouslySetInnerHTML={{ __html: children }}
      />
    } }
});

describe ('Feature page template', () => {

  const mockMarkdownData: FeaturePageProps = {
    data: {
      mdx: {
        body: '<h3>hello</h3><p data-testid="paragraph">This is a paragraph.</p>',
        frontmatter: {
          by: 'Powered by Fiscal Service Data Lab',
          datePublished: '12/30/2021',
          description: 'Fiscal Data - Mock Hits Feature',
          heroImagePath: "/images/feature_placeholder.png",
          mainHeader: 'Header 2, Headline. Keep from 1 to 2 lines',
          path: '/features/quick-hits',
          shareCopy: 'Check out our site here',
          subtitle: 'Header 4, Sub Headline, keep from 1 to 2 lines',
          title: 'Mock Hits'
        }
      }
    }
  };

  let component;
  const post = mockMarkdownData.data.mdx;

   beforeEach(() => {
     component = render(
       <Feature data={mockMarkdownData.data} />
       );
   });

   it(`contains header text, a subheading, a byline and date text as provided
   through yaml frontmatter`, () => {
     const header = component.getByTestId('mainHeader');
     expect(header)
       .toHaveTextContent(post.frontmatter.mainHeader);

     const subheading = component.getByTestId('subtitle');
     expect(subheading)
       .toHaveTextContent(post.frontmatter.subtitle);

     const byLine = component.getByTestId('byLine');
     expect(byLine)
       .toHaveTextContent(`${format(new Date(post.frontmatter.datePublished), "MMMM d, yyyy")}`);

     component.getByTestId('heroImage');

   });

   it('contains the html elements supplied through the remark plugin', () => {
     const header = component.getByRole('heading', {level: 3});
     expect(header.textContent)
       .toStrictEqual('hello');

     const paragraph = component.getByTestId('paragraph');
     expect(paragraph.textContent)
       .toStrictEqual('This is a paragraph.');
   });

   it('supplies page title and description to the PageHelmet component', () => {
     const featureComp = renderer.create(<Feature data={mockMarkdownData.data} />);
     const instance = featureComp.root;
     const helmet = instance.findByType(PageHelmet);
     expect(helmet.props.pageTitle).toBe('Fiscal Data - Mock Hits');
     expect(helmet.props.description).toBe('Fiscal Data - Mock Hits Feature');
   });
});
