import React, { FunctionComponent } from "react"
import { graphql } from "gatsby"
import PageHelmet from "../../components/page-helmet/page-helmet"
import SiteLayout from "../../components/siteLayout/siteLayout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import {
  byLine,
  dateStamp,
  dateValue,
  mainVis,
  templateContainer,
  templateContent,
  heroSocialShare,
} from "./feature.module.scss"
import FDGMdxProvider from "../../components/mdx/FDGMdxProvider";
import InsightsDownload from "../../components/insights-download/insights-download";
import {MDXRenderer} from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react"
import dsmComponents from "./dsm/dsm";
import {format} from "date-fns";
import SocialShare from "../explainer/social-share/social-share";


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
        title: string
      }
    }
  }
}

const featuresComponents = {
  DSM: dsmComponents.DSM,
  ExtIcon: dsmComponents.ExtIcon,
  InsightsDownload: InsightsDownload
}

const Feature: FunctionComponent<FeaturePageProps> = ({ data }: FeaturePageProps) => {
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
			}
		}
	}
`;

export default Feature;
