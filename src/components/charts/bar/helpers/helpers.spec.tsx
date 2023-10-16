import { delay, mouseEnterEvent, mouseLeaveEvent } from './helpers';

jest.useFakeTimers();
describe('Bar Component Helpers', () => {
  const clearTimeoutSpy = jest.spyOn(global.window, 'clearTimeout');
  const setTimeoutSpy = jest.spyOn(global.window, 'setTimeout');
  const callback = jest.fn();
  const firstId = 'one';
  const secondId = 'two';
  const testDelay = delay + 1; // Just to be certain that we advance timers past the delay amount.

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing if invalid params are sent to mouseLeaveEvent', () => {
    mouseLeaveEvent(null, null);
    jest.advanceTimersByTime(testDelay);
    expect(setTimeoutSpy).not.toHaveBeenCalled();

    mouseLeaveEvent(firstId, null);
    jest.advanceTimersByTime(testDelay);
    expect(setTimeoutSpy).not.toHaveBeenCalled();

    mouseLeaveEvent(null, callback);
    jest.advanceTimersByTime(testDelay);
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  it('triggers a time out and callback in mouseLeaveEvent', () => {
    mouseLeaveEvent(firstId, callback);
    jest.advanceTimersByTime(testDelay);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('cancels a time out when mouseLeaveEvent is called again before the delay occurs', () => {
    mouseLeaveEvent(firstId, callback); // Trigger first mouse leave
    jest.advanceTimersByTime(testDelay / 2);
    expect(callback).not.toHaveBeenCalled();

    mouseLeaveEvent(firstId, callback); // Trigger a second delay before the first setTimeout is called
    jest.advanceTimersByTime(testDelay);
    expect(callback).toHaveBeenCalledTimes(1); // The second call allowed the callback to trigger
  });

  it('does nothing if invalid params are sent to mouseEnterEvent', () => {
    mouseEnterEvent(null);
    jest.advanceTimersByTime(testDelay);
    expect(clearTimeoutSpy).not.toHaveBeenCalled();
  });

  it('cancels and removes time out tracking when calling mouseEnterEvent', () => {
    mouseEnterEvent(firstId);
    jest.advanceTimersByTime(testDelay);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    mouseEnterEvent(firstId); // firstId is no longer part of the timeout object, so this will not trigger a clearTimeout again.
    jest.advanceTimersByTime(testDelay);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1); // No change from above
  });

  it('prevents the callback from being triggered if the user leaves and enters the same element', () => {
    mouseLeaveEvent(firstId, callback);
    jest.advanceTimersByTime(delay / 2);
    mouseEnterEvent(firstId);
    jest.advanceTimersByTime(delay); // Time has advanced 1.5x the normal delay

    expect(callback).not.toHaveBeenCalled();
  });

  it('triggers the callback for a prior element even if the user enters another element', () => {
    mouseLeaveEvent(firstId, callback);
    mouseEnterEvent(secondId);
    jest.advanceTimersByTime(testDelay);
    expect(clearTimeoutSpy).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
