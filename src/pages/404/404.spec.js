import React from 'react';
import NotFoundPage, {pageTitle} from './index';
import NotFoundGraphic from '../../components/notFound/notFoundGraphic'
import {render, waitFor} from "@testing-library/react";

jest.mock("gatsby-plugin-mdx", () => {
  return { MDXRenderer: ({children}) => {
      return <div>{children}</div>;
    } }
});

describe("404 page", ()=> {

  it('renders page helmet with expected document title', async ()=> {
    const data = {
      mdx: {
        body: "<div>Test</div>",
        frontmatter: {
          title: "Test Title"
        }
      }
    };
    render(<NotFoundPage pageContext={{}} data={data} />);
    await waitFor(() => expect(document.title).toContain(pageTitle));
  });

  it("renders the not found component", ()=> {
    const data = {
      mdx: {
        body: "<div>Test</div>",
        frontmatter: {
          title: "Test Title"
        }
      }
    };
    const { getByTestId } = render(<NotFoundPage pageContext={{}} data={data} />);
    const notFound = getByTestId('notFoundWrapper');
    expect(notFound).toBeInTheDocument();
  });

})
