import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ExternalLink from './external-link';
import globalConstants from '../../../helpers/constants';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { redirectModalState } from '../../modal/redirect-modal/redirect-modal-helper';

describe('External Link', () => {
  const testUrl = 'https://example.com/';
  const text = 'sample content';
  const content = <div>{text}</div>;

  it('renders an external link with the given url and properties of an external link', () => {
    const { getByTestId, getByText } = render(<ExternalLink url={testUrl}>{content}</ExternalLink>);
    const link = getByTestId('external-link');

    expect(link).toBeInTheDocument();
    expect(getByText(text)).toBeInTheDocument();
    expect(link.href).toBe(testUrl);
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe(globalConstants.EXTERNAL_LINK_REL);
  });

  it('treats .gov URL as a direct link (no modal)', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <ExternalLink url="https://www.usaspending.gov/">USAS</ExternalLink>
      </RecoilRoot>
    );
    expect(getByTestId('external-link').getAttribute('href')).toBe('https://www.usaspending.gov/');
  });

  it('applies custom className to anchor element', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <ExternalLink url="https://example.com/" className="test-class">
          ext
        </ExternalLink>
      </RecoilRoot>
    );
    expect(getByTestId('external-link').classList.contains('test-class')).toBe(true);
  });

  it('sets redirectModalState when a non-.gov link is clicked', () => {
    const Probe = () => {
      const modal = useRecoilValue(redirectModalState);
      return <span data-testid="probe">{modal.open ? modal.url : 'closed'}</span>;
    };

    const { getByTestId } = render(
      <RecoilRoot>
        <ExternalLink url="https://example.com/">ext</ExternalLink>
        <Probe />
      </RecoilRoot>
    );
    expect(getByTestId('probe').textContent).toBe('closed');
    fireEvent.click(getByTestId('external-link'));
    expect(getByTestId('probe').textContent).toBe('https://example.com/');
  });

  it('does not set redirectModalState when a non-.gov link is clicked when skipExternalModal is true', () => {
    const Probe = () => {
      const modal = useRecoilValue(redirectModalState);
      return <span data-testid="probe">{modal.open ? modal.url : 'closed'}</span>;
    };

    const { getByTestId } = render(
      <RecoilRoot>
        <ExternalLink url="https://example.com/" skipExternalModal={true}>
          ext
        </ExternalLink>
        <Probe />
      </RecoilRoot>
    );
    expect(getByTestId('probe').textContent).toBe('closed');
    fireEvent.click(getByTestId('external-link'));
    expect(getByTestId('probe').textContent).toBe('closed');
  });
});
