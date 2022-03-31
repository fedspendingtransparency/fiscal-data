import React, { FunctionComponent } from "react"
import { MDXProvider } from "@mdx-js/react";
import CustomLink from "../links/custom-link/custom-link"

const FDGMdxProvider: FunctionComponent = ({ children }) => {
  const shortCodes = {
    CustomLink,
    a: CustomLink
  };
  return (
    <MDXProvider components={shortCodes}>
      {children}
    </MDXProvider>
  );
};

export default FDGMdxProvider;
