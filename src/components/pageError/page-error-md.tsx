/* istanbul ignore file */

/* TODO: When MDX POC is no longer useful, remove experimental aspects and
   dependencies, remove above istanbul ignore header above
 */
import React, { FunctionComponent } from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react"
import FDGMdxProvider from "../mdx/FDGMdxProvider";
import { NFComponents } from "./page-error-text";

export interface PageErrorMdProps {
  mdx: {
    frontmatter: {
      section_name: string,
      slug: string,
      title: string
    },
    body: string
  }
}

const PageErrorMd: FunctionComponent<PageErrorMdProps> = ({ mdx }: PageErrorMdProps) => {
  const { body } = mdx;

  return (
    <FDGMdxProvider>
      <MDXProvider components={NFComponents}>
        <MDXRenderer children={body} />
      </MDXProvider>
    </FDGMdxProvider>
  )

}

export default PageErrorMd;
