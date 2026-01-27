import React from 'react';
import ReactDOM from 'react-dom';
import { cleanup, render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
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
  it('should ', () => {
    expect(true);
  });
});
