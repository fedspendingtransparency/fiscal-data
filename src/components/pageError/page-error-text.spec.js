import React from 'react';
import PageErrorText from './page-error-text';
import { render, within } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

describe('404 Not Found Text', () => {
  it('includes an h1 header', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageErrorText />
      </RecoilRoot>
    );
    const header = getByRole('heading', { level: 1 });
    expect(header).toHaveClass('notFoundHeader');
  });

  it('includes 404 header', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageErrorText />
      </RecoilRoot>
    );
    const header = getByRole('heading', { level: 2 });
    expect(within(header).getByText('404: Page not found')).toBeInTheDocument();
  });

  it('includes a list with 3 links', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageErrorText />
      </RecoilRoot>
    );
    const list = getByRole('list');
    const listLinks = within(list).getAllByRole('link');
    expect(listLinks).toHaveLength(3);
  });

  it('includes the not found graphic', () => {
    const { getByAltText } = render(
      <RecoilRoot>
        <PageErrorText />
      </RecoilRoot>
    );
    const image = getByAltText('404: Page Not Found');
    expect(image).toBeInTheDocument();
  });
});

describe('Fallback for Error Boundary', () => {
  it('includes an h1 header', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageErrorText fallback={true} />
      </RecoilRoot>
    );
    const header = getByRole('heading', { level: 1 });
    expect(header).toHaveClass('notFoundHeader');
  });

  it('includes fallback header', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageErrorText fallback={true} />
      </RecoilRoot>
    );
    const header = getByRole('heading', { level: 2 });
    expect(within(header).getByText('This content is currently unavailable.')).toBeInTheDocument();
  });

  it('includes the not found graphic', () => {
    const { getByAltText } = render(
      <RecoilRoot>
        <PageErrorText fallback={true} />
      </RecoilRoot>
    );
    const image = getByAltText('404: Page Not Found');
    expect(image).toBeInTheDocument();
  });
});
