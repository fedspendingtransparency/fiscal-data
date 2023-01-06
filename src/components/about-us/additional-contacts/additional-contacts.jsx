import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import {MDXRenderer} from "gatsby-plugin-mdx";
import FDGMdxProvider from "../../../components/mdx/FDGMdxProvider";
import { MDXProvider } from "@mdx-js/react";
import { aboutUsComponents, additionalContactsComponents } from "../helpers/helpers";

const AdditionalContacts = () => {
  const addlContacts = useStaticQuery(graphql`
    query {
      mdx(frontmatter: {id: {eq: "additional-contacts"}}) {
        body
      }
    }
  `);

  return (
    <>
      {addlContacts && addlContacts.mdx && addlContacts.mdx.body &&
        <FDGMdxProvider>
          <MDXProvider components={Object.assign({},aboutUsComponents, additionalContactsComponents)}>
            <MDXRenderer children={addlContacts.mdx.body}/>
          </MDXProvider>
        </FDGMdxProvider>
      }
    </>
  );

};

export default AdditionalContacts;
