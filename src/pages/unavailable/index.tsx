import React from 'react';
import { graphql } from 'gatsby';
import PageHelmet from '../../components/page-helmet/page-helmet';

const UnavailableContent = ({ fallback }) => {
  const pageTitle = fallback ? 'Content Currently Unavailable' : 'Page Not Found';

  return (
    <>
      <div>
        Hello world!
        {/*<PageHelmet data-testid="helmet" pageTitle={pageTitle} />*/}
      </div>
    </>
  );
};

const Unavailable = () => {
  return (
    <>
      <div>
        Hello world!
        {/*<PageHelmet data-testid="helmet" pageTitle={pageTitle} />*/}
      </div>
    </>
  );
};

export default Unavailable;
