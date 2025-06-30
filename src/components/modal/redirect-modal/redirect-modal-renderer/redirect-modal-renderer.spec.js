import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { redirectModalState } from '../redirect-modal-helper';
import RedirectModalRenderer from './redirect-modal-renderer';

beforeAll(() => {
  jest.spyOn(ReactDOM, 'createPortal').mockImplementation(element => element);
});

afterAll(() => {
  ReactDOM.createPortal.mockRestore();
});

const renderWithState = (e = () => {}) =>
  render(
    <RecoilRoot initializeState={e}>
      <RedirectModalRenderer />
    </RecoilRoot>
  );
afterEach(() => {
  cleanup();
});

describe('<RedirectModalRenderer> integration', () => {
  it('renders nothing when open === false', () => {
    const { queryByRole } = renderWithState();
    expect(queryByRole('dialog')).toBeNull();
  });

  it('renders modal content when open === true', () => {
    const url = 'https://example.com/';
    const { getByRole, getByText } = renderWithState(({ set }) => set(redirectModalState, { open: true, url }));

    expect(getByText(/You’re leaving a Federal Government website/i)).toBeInTheDocument();
    const link = getByRole('link', { name: url });
    expect(link).toHaveAttribute('href', url);
  });

  it('clicking X triggers onClose and unmounts modal', () => {
    const { getByRole, queryByRole } = renderWithState(({ set }) => set(redirectModalState, { open: true, url: 'https://example.org/' }));

    act(() => fireEvent.click(getByRole('button', { name: /close modal/i })));
    expect(queryByRole('dialog')).toBeNull();
  });

  it('clicking “Continue” runs after() once and closes modal', () => {
    const after = jest.fn();
    const url = 'https://example.com/';
    const { getByRole, queryByRole } = renderWithState(({ set }) => set(redirectModalState, { open: true, url, after }));

    act(() => fireEvent.click(getByRole('link', { name: url })));
    expect(after).toHaveBeenCalledTimes(1);
    expect(queryByRole('dialog')).toBeNull();
  });
});
