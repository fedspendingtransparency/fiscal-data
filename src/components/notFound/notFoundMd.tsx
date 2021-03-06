import React, { FunctionComponent } from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react"
import FDGMdxProvider from "../mdx/FDGMdxProvider";
import { NFComponents } from "./notFoundText";

export interface NotFoundMdProps {
  mdx: {
    frontmatter: {
      section_name: string,
      slug: string,
      title: string
    },
    body: string
  }
}

const NotFoundMd: FunctionComponent<NotFoundMdProps> = ({ mdx }: NotFoundMdProps) => {
  const { body } = mdx;

  return (
    <FDGMdxProvider>
      <MDXProvider components={NFComponents}>
        <MDXRenderer children={body} />
      </MDXProvider>
    </FDGMdxProvider>
  )

}

export default NotFoundMd;
