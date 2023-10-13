import Analytics from './analytics';
import renderer from 'react-test-renderer';
import { ENV_ID } from 'gatsby-env-variables';

jest.useFakeTimers();
describe('Analytics Util', () => {
  const originalEnv = ENV_ID;
  window.gas = jest.fn();
  window.ga = jest.fn();

  const gasSpy = jest.spyOn(window, 'gas');
  const gaSpy = jest.spyOn(window, 'ga');

  beforeAll(() => {
    process.env.GATSBY_ENV = 'production';
    jest.runAllTimers();
  });

  afterAll(() => {
    process.env.GATSBY_ENV = originalEnv;
  });

  it('calls window.gas and window.ga with expected arguments in Prod ' + 'environment', async () => {
    renderer.act(() => {
      Analytics.event({
        category: 'Glossary',
        action: 'Opened Glossary',
        label: 'Floating Glossary Button',
      });
    });
    jest.runAllTimers();

    expect(gasSpy).toHaveBeenCalledWith(
      'send',
      'event',
      'Fiscal Data - Glossary',
      'Opened Glossary',
      'Floating Glossary Button',
      undefined,
      undefined
    );
    expect(gaSpy).toHaveBeenCalledWith(
      'send',
      'event',
      'Fiscal Data - Glossary',
      'Opened Glossary',
      'Floating Glossary Button',
      undefined,
      undefined
    );
  });
});
