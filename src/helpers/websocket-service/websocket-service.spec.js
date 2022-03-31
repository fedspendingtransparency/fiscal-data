import WebsocketService from "./websocket-service";

describe('Websocket Service - ', () => {
  afterEach(() => {
    WebsocketService.disconnectAllConnections();
  });

  it('returns a websocket and connectionKey when calling connectWebsocket', async () => {
    const key = 'url1';
    const ws = WebsocketService.connectWebsocket(key);

    expect(ws.key).toEqual(key);
    expect(ws.socket).toBeTruthy();
  });

  it('creates unique keys and websockets when connections are made through the same url', () => {
    const url = 'url1';
    const key1 = WebsocketService.connectWebsocket(url).key;
    const key2 = WebsocketService.connectWebsocket(url).key;
    const key3 = WebsocketService.connectWebsocket(url).key;
    // Make sure the keys are not the same
    expect(key1).not.toEqual(key2);
    expect(key1).not.toEqual(key3);
    expect(key2).not.toEqual(key3);
    // Make sure the original url is a part of the renamed keys
    expect(key2).toContain(url);
  });

  it('keeps track of requested connections', async () => {
    await WebsocketService.connectWebsocket('url1');
    expect(WebsocketService.currentConnectionsCount()).toEqual(1);

    await WebsocketService.connectWebsocket('url2');
    expect(WebsocketService.currentConnectionsCount()).toEqual(2);
  });

  it('removes a connection when calling removeReferenceFromConnectionsObject', () => {
    const url = 'url1';
    expect(WebsocketService.currentConnectionsCount()).toEqual(0);
    WebsocketService.connectWebsocket(url);
    expect(WebsocketService.currentConnectionsCount()).toEqual(1);
    WebsocketService.removeReferenceFromConnectionsObject(url);
    expect(WebsocketService.currentConnectionsCount()).toEqual(0);
  });

  it('logs a console.warn if attempting to disconnect a non-existent conection', () => {
    const url = 'url1';
    const invalidUrl = 'invalidUrl';
    const consoleWarn = global.console.warn;
    global.console.warn = jest.fn();
    expect(WebsocketService.currentConnectionsCount()).toEqual(0);
    WebsocketService.connectWebsocket(url);
    expect(WebsocketService.currentConnectionsCount()).toEqual(1);
    WebsocketService.removeReferenceFromConnectionsObject(invalidUrl);
    expect(global.console.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidUrl)
    );
    expect(WebsocketService.currentConnectionsCount()).toEqual(1);
    global.console.warn = consoleWarn;
  });

  it('has a function that disconnects all open websockets', () => {
    WebsocketService.connectWebsocket('1');
    WebsocketService.connectWebsocket('2');
    WebsocketService.connectWebsocket('3');
    WebsocketService.connectWebsocket('4');
    expect(WebsocketService.currentConnectionsCount()).toBe(4);
    WebsocketService.disconnectAllConnections();
    expect(WebsocketService.currentConnectionsCount()).toBe(0);
  });

});
