import React from "react";
import { graphql } from "gatsby";
import * as styles from "./notFound.module.scss";
import SiteLayout from "../../components/siteLayout/siteLayout";
import PageHelmet from "../../components/page-helmet/page-helmet";
import NotFoundText from '../../components/notFound/notFoundText';
import NotFoundMd from "../../components/notFound/notFoundMd"
import Experimental from "../../components/experimental/experimental"

const NotFound = ({ pageContext, data }) => {

  const pageTitle = 'Page Not Found';

  return (
    <SiteLayout>
      <div className={styles.siteNotFound}>
        <PageHelmet
          data-testid="helmet"
          pageTitle={pageTitle}
        />
        <div data-testid="notFoundWrapper" className={styles.notFoundWrapper}>
          <Experimental featureId="not-found-md" exclude>
            <NotFoundText />
          </Experimental>
          <Experimental featureId="not-found-md">
            <NotFoundMd mdx={data['mdx']} />
          </Experimental>
        </div>
      </div>

    </SiteLayout>
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
