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

const SocialShare = jest.requireActual('../../components/social-share/social-share');
const socialShareSpy = jest.spyOn(SocialShare, "default");

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
          shareTitle: 'Who Owns the Debt?',
          shareDescription: 'Learn who owns the U.S. national debt with the new insight page.',
          shareBody: 'Do you know how much of the #NationalDebt is owned by U.S. investors?',
          emailSubject: 'Who Owns the U.S. National Debt? Find out today!',
          emailBody: 'Check out Fiscal Data’s new Who Owns the Debt insight page now:',
          emailSeparator: ' ',
          shareImagePath: '/images/insights-images/who-owns-share/who-owns-the-debt-1200x630.png',
          subtitle: 'Header 4, Sub Headline, keep from 1 to 2 lines',
          title: 'Mock Hits',
          relatedDatasets: ''
        }
      }
    },
    pageContext: {
      relatedDatasets: []
    }
  };

  let component;
  const post = mockMarkdownData.data.mdx;
  const mockPageContext = {
    relatedDatasets: []
  }

   beforeEach(() => {
     component = render(
       <Feature data={mockMarkdownData.data} pageContext={mockPageContext} />
       );
   });

   afterEach(() => {
     socialShareSpy.mockClear();
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
     const featureComp = renderer.create(
       <Feature data={mockMarkdownData.data} pageContext={mockPageContext} />);
     const instance = featureComp.root;
     const helmet = instance.findByType(PageHelmet);
     expect(helmet.props.pageTitle).toBe('Mock Hits');
     expect(helmet.props.description).toBe('Fiscal Data - Mock Hits Feature');
   });

   it('correctly passes values from frontMatter into socialShare', () => {
     const mockFrontmatter = mockMarkdownData.data.mdx.frontmatter;
     const socialShareProps = socialShareSpy.mock.calls[0][0];
     expect(socialShareProps['copy'].title).toStrictEqual(mockFrontmatter.shareTitle);
     expect(socialShareProps['copy'].description).toStrictEqual(mockFrontmatter.shareDescription);
     expect(socialShareProps['copy'].body).toStrictEqual(mockFrontmatter.shareBody);
     expect(socialShareProps['copy'].emailSubject).toStrictEqual(mockFrontmatter.emailSubject);
     expect(socialShareProps['copy'].emailBody).toStrictEqual(mockFrontmatter.emailBody);
     expect(socialShareProps['copy'].emailSeparator).toStrictEqual(mockFrontmatter.emailSeparator);
     expect(socialShareProps['copy'].url).not.toStrictEqual(mockFrontmatter.path);
     expect(socialShareProps['copy'].url).toContain(mockFrontmatter.path);
     expect(socialShareProps['copy'].image).not.toStrictEqual(mockFrontmatter.shareImagePath);
     expect(socialShareProps['copy'].image).toContain(mockFrontmatter.shareImagePath);
     expect(socialShareProps['pageName']).toStrictEqual(mockFrontmatter.title);
     expect(socialShareProps['horizontal']).toStrictEqual(true);
   });
});
