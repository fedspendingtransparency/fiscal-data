import React from "react";
import { graphql } from "gatsby";
import * as styles from "../404/notFound.module.scss";
import SiteLayout from "../../components/siteLayout/siteLayout";
import PageHelmet from "../../components/page-helmet/page-helmet";
import PageErrorMd from "../../components/pageError/page-error-md"
import Experimental from "../../components/experimental/experimental"
import PageErrorText from "../../components/pageError/page-error-text";

const NotFound = ({ pageContext, data, fallback }) => {

  const pageTitle = fallback ? 'Content Currently Unavailable' : 'Page Not Found';

  return (
    <>
     {!fallback && 
      <SiteLayout>
        <div className={styles.siteNotFound}>
          <PageHelmet
            data-testid="helmet"
            pageTitle={pageTitle}
          />
          <div data-testid="notFoundWrapper" className={styles.notFoundWrapper}>
            <Experimental featureId="not-found-md" exclude>
              <PageErrorText />
            </Experimental>
            <Experimental featureId="not-found-md">
              <PageErrorMd mdx={data['mdx']} />
            </Experimental>
          </div>
        </div>
      </SiteLayout>}
     {fallback && 
        <div className={styles.siteNotFound}>
          <PageHelmet
            data-testid="helmet"
            pageTitle={pageTitle}
          />
          <div data-testid="notFoundWrapper" className={styles.notFoundWrapper}>
            <PageErrorText fallback={fallback}/>
          </div>
        </div>
      }
    </>
    
  );
};

export const pageQuery = graphql`
  query MDXQuery{
    mdx(
      frontmatter: { slug: {regex: "^API/" }}
    ) {
        frontmatter {
          title
          section_name
          description
        }
        body
      }
  }
`;

export default NotFound;
