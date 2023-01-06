global.__loader = {
  enqueue: jest.fn()
};

// todo - Remove the following mock or update the API_BASE_URL.
jest.mock("gatsby-env-variables", () => ({
  ENV_ID: 'production',
  API_BASE_URL: 'https://www.transparency.treasury.gov',
  ADDITIONAL_DATASETS: {}
}));

import "mutationobserver-shim";
