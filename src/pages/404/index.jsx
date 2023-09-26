import React from "react";
import { graphql } from "gatsby";
import * as styles from "../404/notFound.module.scss";
import SiteLayout from "../../components/siteLayout/siteLayout";
import PageHelmet from "../../components/page-helmet/page-helmet";
import PageErrorText from "../../components/pageError/page-error-text";

// TODO: Research why adding Error Boundary Package throws errors in Jest test
// for Markdown imports on pages where siteLayout was called

const NotFoundContent = ({fallback}) => {

  const pageTitle = fallback ? 'Content Currently Unavailable' : 'Page Not Found';

  return (
    <div className={styles.siteNotFound}>
      <PageHelmet
        data-testid="helmet"
        pageTitle={pageTitle}
      />
      <div data-testid="notFoundWrapper" className={styles.notFoundWrapper}>
        <PageErrorText fallback={fallback} />
      </div>
    </div>
  )
}

const NotFound = ({ pageContext, data, fallback }) => {

  return (
    <>
     {!fallback && 
      <SiteLayout>
        <NotFoundContent fallback={fallback} />
      </SiteLayout>}
     {fallback && 
        <NotFoundContent fallback={fallback} />
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
