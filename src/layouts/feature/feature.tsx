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
import SocialShare from "../explainer/social-share/social-share";
import {IDataset} from "../../models/IDataset";
import ExplainerRelatedDatasets from
    "../explainer/explainer-related-datasets/explainer-related-datasets";


export type FeaturePageProps = {
  data: {
    mdx: {
      body: string,
      frontmatter: {
        by: string,
        datePublished: string,
        description: string,
        heroImagePath: string,
        mainHeader: string,
        path: string,
        shareCopy: string,
        subtitle: string,
        title: string,
        relatedDatasets: string
      }
    }
  },
  pageContext: {
    relatedDatasets: IDataset[],
  }
}

const featuresComponents = {
  DSM: dsmComponents.DSM,
  ExtIcon: dsmComponents.ExtIcon,
  InsightsDownload: InsightsDownload,
  Footnote: Footnote,
  AnchorText: AnchorText
}

const Feature: FunctionComponent<FeaturePageProps> = ({
  data,
  pageContext
}) => {
  const { mdx: post } = data;
  const frontMatter = post.frontmatter;
  const date = format(new Date(frontMatter.datePublished), "MMMM d, yyyy");


  return (
    <SiteLayout isPreProd={false}>
      <PageHelmet
        pageTitle={`Fiscal Data - ${frontMatter.title}`}
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
                title={''}
                description={''}
                body={''}
                emailSubject={''}
                emailBody={''}
                url={''}
                image={''}
                pageName={''}
                horizontal={true}
              />
            </div>
          </div>
          <div
            className={mainVis}
            data-testid="heroImage"
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
				shareCopy
				subtitle
				title
				relatedDatasets
			}
		}
	}
`;

export default Feature;
