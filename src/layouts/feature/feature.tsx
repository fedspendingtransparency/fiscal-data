import React, { FunctionComponent } from "react"
import { graphql } from "gatsby"
import PageHelmet from "../../components/page-helmet/page-helmet"
import SiteLayout from "../../components/siteLayout/siteLayout"
import {
  byLine,
  dateStamp,
  dateValue,
  mainVis,
  templateContainer,
  templateContent,
  heroSocialShare,
  relatedDatasetsStyle,
} from "./feature.module.scss"
import FDGMdxProvider from "../../components/mdx/FDGMdxProvider";
import InsightsDownload from "../../components/insights-download/insights-download";
import Footnote from "../../components/footnote/footnote";
import AnchorText from "../../components/anchor-text/anchor-text";
import {MDXRenderer} from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react"
import dsmComponents from "./dsm/dsm";
import {format} from "date-fns";
import SocialShare from "../../components/social-share/social-share";
import InsightsImage from "../../components/insights-image/insights-image";
import {IDataset} from "../../models/IDataset";
import ExplainerRelatedDatasets from
    "../explainer/explainer-related-datasets/explainer-related-datasets";
import { BASE_URL } from "gatsby-env-variables";

const envBaseURl = BASE_URL;

export type FeatureFrontmatter = {
  by: string,
  datePublished: string,
  description: string,
  heroImagePath: string,
  mainHeader: string,
  path: string,
  shareTitle: string,
  shareDescription: string,
  shareBody: string,
  emailSubject: string,
  emailBody: string,
  emailSeparator?: string,
  shareImagePath: string,
  subtitle: string,
  title: string,
  relatedDatasets: string
};

export type FeaturePageProps = {
  data: {
    mdx: {
      body: string,
      frontmatter: FeatureFrontmatter
    }
  },
  pageContext: {
    relatedDatasets: IDataset[],
  }
};

const featuresComponents = {
  DSM: dsmComponents.DSM,
  ExtIcon: dsmComponents.ExtIcon,
  InsightsDownload: InsightsDownload,
  Footnote: Footnote,
  AnchorText: AnchorText,
  InsightsImage: InsightsImage
}

const Feature: FunctionComponent<FeaturePageProps> = ({
  data,
  pageContext
}) => {
  const { mdx: post } = data;
  const frontMatter = post.frontmatter;
  const date = format(new Date(frontMatter.datePublished), "MMMM d, yyyy");
  const betweenEmailBodyAndUrl = frontMatter.emailSeparator === undefined ?
    '\n' : frontMatter.emailSeparator;
  const socialCopy = {
    title: frontMatter.shareTitle,
    description: frontMatter.shareDescription,
    body: frontMatter.shareBody,
    emailSubject: frontMatter.emailSubject,
    emailBody: frontMatter.emailBody,
    emailSeparator: betweenEmailBodyAndUrl,
    url: envBaseURl + frontMatter.path,
    image: envBaseURl + frontMatter.shareImagePath,
  };

  return (
    <SiteLayout isPreProd={false}>
      <PageHelmet
        pageTitle={frontMatter.title}
        description={frontMatter.description}
        keywords=""
        image=""
        canonical=""
        datasetDetails=""
      />
      <div className={`pageWrapper ${templateContainer}`}>
        <div className={templateContent}>
          <h1 data-testid="mainHeader">{frontMatter.mainHeader}</h1>
          <h4 data-testid="subtitle">{frontMatter.subtitle}</h4>
          <div className={byLine} data-testid="byLine">
            <div className={dateStamp}>
              <span className={dateValue}>{date}</span>
            </div>
            <div className={heroSocialShare}>
              <SocialShare
                copy={socialCopy}
                pageName={frontMatter.title}
                horizontal={true}
              />
            </div>
          </div>
          <div
            className={mainVis}
            data-testid="heroImage"
            aria-label={"Five vertical bars increasing in height with four stacks " +
            "of coins in front of the bars. Two women sit on different coin stacks, " +
            "each browsing on laptop computers."}
            style={{backgroundImage: `url(${frontMatter.heroImagePath})`}}
          >
          </div>
          <FDGMdxProvider>
            <MDXProvider components={featuresComponents}>
              <MDXRenderer children={post.body} />
            </MDXProvider>
          </FDGMdxProvider>
        </div>
      </div>
      <div className={relatedDatasetsStyle}>
        <ExplainerRelatedDatasets
          datasets={pageContext.relatedDatasets}
          referrer={"Insight"}
          header={"See the datasets that relate to this Insight"}
        />
      </div>
    </SiteLayout>
  )
};
export const pageQuery = graphql`
	query FeatureContentByPath($path: String!) {
		mdx(frontmatter: { path: { eq: $path } }) {
		  body
			frontmatter {
				by
				datePublished
				description
				heroImagePath
				mainHeader
				path
				shareTitle
        shareDescription
        shareBody
        emailSubject
        emailBody
        emailSeparator
        shareImagePath
				subtitle
				title
				relatedDatasets
			}
		}
	}
`;

export default Feature;
