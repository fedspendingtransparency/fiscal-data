// eslint-disable-next-line no-unused-vars
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, timeout } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';

const currentConnections = {};

/**
 * Establishes a websocket connection. Allows for multiple connections to the same url.
 * Note: Calling this will actively make the initial connection to the Websocket endpoint.
 * @param url {string}
 * @returns {{key: string, socket: WebSocketSubject}}
 */
const connectWebsocket = url => {
  let connectionKey = url;

  // allow for multiple connections to the same url. This will not re-use an existing connection.
  if (currentConnections[connectionKey]) {
    const urlLen = url.length;
    connectionKey = `${url}-${Object.keys(currentConnections).filter(currConn => currConn.substr(0, urlLen) === url).length}`;
  }

  const webSocketConfig = {
    url: url,
    closingObserver: {
      next: () => {
        removeReferenceFromConnectionsObject(connectionKey);
      },
    },
  };

  currentConnections[connectionKey] = webSocket(webSocketConfig);
  currentConnections[connectionKey]
    .pipe(
      timeout(600000), // timeout throws an error
      catchError(error => {
        if (error instanceof TimeoutError) {
          // clean up connection
          removeReferenceFromConnectionsObject(connectionKey);
        }
        return throwError(error);
      })
    )
    .subscribe();
  return {
    key: connectionKey,
    socket: currentConnections[connectionKey],
  };
};

const removeReferenceFromConnectionsObject = key => {
  if (currentConnections[key] === undefined) {
    console.warn(`Requested websocket instance does not exist: ${key}`);
    return;
  }

  delete currentConnections[key];
};

/**
 * Returns number of websocket connections currently established
 * @returns {number|number}
 */
const currentConnectionsCount = () => {
  return Object.keys(currentConnections).length || 0;
};

/**
 * Disconnects all connections.
 */
const disconnectAllConnections = () => {
  Object.keys(currentConnections).forEach(currConnKey => {
    currentConnections[currConnKey].complete();
    delete currentConnections[currConnKey];
  });
};

const WebsocketService = {
  connectWebsocket,
  currentConnectionsCount,
  disconnectAllConnections,
  removeReferenceFromConnectionsObject,
};

export default WebsocketService;
