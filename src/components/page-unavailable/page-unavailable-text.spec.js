import React from 'react';
import PageUnavailableText from './page-unavailable-text';
import { render, within } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

describe('Unavailable Text', () => {
  it('includes an h1 header', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageUnavailableText />
      </RecoilRoot>
    );
    const header = getByRole('heading', { level: 1 });
    expect(header).toHaveClass('unavailableHeader');
  });

  it('includes an h1 header', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageUnavailableText />
      </RecoilRoot>
    );
    const header = getByRole('heading', { name: 'Fiscal Data is unavailable right now.' });
    expect(header).toBeInTheDocument();
  });

  it('includes an unavailable header', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageUnavailableText />
      </RecoilRoot>
    );
    const header = getByRole('heading', { level: 2 });
    expect(within(header).getByText('We will be back shortly.')).toBeInTheDocument();
  });

  it('includes the not found graphic', () => {
    const { getByAltText } = render(
      <RecoilRoot>
        <PageUnavailableText />
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
        <PageUnavailableText fallback={true} />
      </RecoilRoot>
    );
    const header = getByRole('heading', { level: 1 });
    expect(header).toHaveClass('unavailableHeader');
  });

  it('includes fallback header', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <PageUnavailableText fallback={true} />
      </RecoilRoot>
    );
    const header = getByRole('heading', { level: 2 });
    expect(within(header).getByText('This content is currently unavailable.')).toBeInTheDocument();
  });

  it('includes the not found graphic', () => {
    const { getByAltText } = render(
      <RecoilRoot>
        <PageUnavailableText fallback={true} />
      </RecoilRoot>
    );
    const image = getByAltText('404: Page Not Found');
    expect(image).toBeInTheDocument();
  });
});
