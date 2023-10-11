import { testMDX, ulTestId } from './helpers';

describe('About Us - Helpers', () => {
  it('has a testMDX that provides a standard mdx tree structure for MDX methods', () => {
    expect(testMDX).toBeDefined();
    expect(testMDX.mdx).toBeTruthy();
    expect(testMDX.mdx.body).toBeTruthy();
  });
});
