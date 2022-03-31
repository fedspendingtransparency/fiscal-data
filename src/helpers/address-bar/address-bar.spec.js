import {updateAddressPath} from './address-bar';

jest.useFakeTimers();
describe('Address Bar Helper', () => {

  const originalWindow = global.window;
  let window;
  beforeEach(() => {
    global.window = {location: {pathname: ''}};
    window = global.window;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it('updates the location path to specified anchor tag', () => {
    const curId = 'testAnchor';
    const history = window.history;
    let statePath = history.state ? history.state.updatedPath : '';
    expect(statePath).not.toContain(curId);

    expect(updateAddressPath(curId, window.location)).toBeTruthy();
    jest.runAllTimers();

    statePath = history.state ? history.state.updatedPath : '';
    expect(statePath).toContain(curId);
  });

});
