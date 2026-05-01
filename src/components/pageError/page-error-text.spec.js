import React from 'react';
import PageErrorText from './page-error-text';
import { render, within } from '@testing-library/react';

describe('404 Not Found Text', () => {
  it('includes an h1 header', () => {
    const { getByRole } = render(
      <>
        <PageErrorText />
      </>
    );
    const header = getByRole('heading', { level: 1 });
    expect(header).toHaveClass('notFoundHeader');
  });

  it('includes 404 header', () => {
    const { getByRole } = render(
      <>
        <PageErrorText />
      </>
    );
    const header = getByRole('heading', { level: 2 });
    expect(within(header).getByText('404: Page not found')).toBeInTheDocument();
  });

  it('includes a list with 3 links', () => {
    const { getByRole } = render(
      <>
        <PageErrorText />
      </>
    );
    const list = getByRole('list');
    const listLinks = within(list).getAllByRole('link');
    expect(listLinks).toHaveLength(3);
  });

  it('includes the not found graphic', () => {
    const { getByAltText } = render(
      <>
        <PageErrorText />
      </>
    );
    const image = getByAltText('404: Page Not Found');
    expect(image).toBeInTheDocument();
  });
});

describe('Fallback for Error Boundary', () => {
  it('includes an h1 header', () => {
    const { getByRole } = render(
      <>
        <PageErrorText fallback={true} />
      </>
    );
    const header = getByRole('heading', { level: 1 });
    expect(header).toHaveClass('notFoundHeader');
  });

  it('includes fallback header', () => {
    const { getByRole } = render(
      <>
        <PageErrorText fallback={true} />
      </>
    );
    const header = getByRole('heading', { level: 2 });
    expect(within(header).getByText('This content is currently unavailable.')).toBeInTheDocument();
  });

  it('includes the not found graphic', () => {
    const { getByAltText } = render(
      <>
        <PageErrorText fallback={true} />
      </>
    );
    const image = getByAltText('404: Page Not Found');
    expect(image).toBeInTheDocument();
  });
});
