import '@testing-library/jest-dom/extend-expect';

// Gatsby's StaticImage doesn't render in these tests
// This mocks the plugin by replacing StaticImage with a regular HTML img
jest.mock("gatsby-plugin-image", () => {
  const React = require("react");
  const plugin = jest.requireActual("gatsby-plugin-image");
  const mockImage = (props) => React.createElement("img", props);
  const mockPlugin = {
    ...plugin,
    StaticImage: jest.fn().mockImplementation(mockImage),
    GatsbyImage: jest.fn().mockImplementation(mockImage)
  }
  return mockPlugin;
});

jest.mock('rxjs/webSocket',() => ({
  __esModule: true,
  webSocket: () => {
    return {
      pipe: jest.fn().mockImplementation(() => { return { subscribe: jest.fn()} }),
      subscribe: jest.fn(),
      complete: jest.fn()
    }
  }
}));

jest.setTimeout(750000);
