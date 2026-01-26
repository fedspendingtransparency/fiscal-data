import '@testing-library/jest-dom';
// Polyfill "window.fetch" used in the React components.
import 'whatwg-fetch';
import React from 'react';
// Gatsby's StaticImage doesn't render in these tests
// This mocks the plugin by replacing StaticImage with a regular HTML img
jest.mock('gatsby-plugin-image', () => {
  const React = require('react');
  const plugin = jest.requireActual('gatsby-plugin-image');
  const mockImage = props => React.createElement('img', props);
  const mockPlugin = {
    ...plugin,
    StaticImage: jest.fn().mockImplementation(mockImage),
    GatsbyImage: jest.fn().mockImplementation(mockImage),
  };
  return mockPlugin;
});

jest.mock('rxjs/webSocket', () => ({
  __esModule: true,
  webSocket: () => {
    return {
      pipe: jest.fn().mockImplementation(() => {
        return { subscribe: jest.fn() };
      }),
      subscribe: jest.fn(),
      complete: jest.fn(),
    };
  },
}));

jest.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => <>{children}</>,
  HelmetProvider: ({ children }) => <>{children}</>,
}));

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return null;
  }

  unobserve() {
    return null;
  }
};

jest.setTimeout(750000);
