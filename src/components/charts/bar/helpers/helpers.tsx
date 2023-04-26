const timeout = {};

export const delay = 500;

export const mouseLeaveEvent = (cardId: string, callback: () => void): void => {
  if(!cardId || !callback){
    return;
  }
  const graphTimeout = timeout[cardId];

  if(graphTimeout){
    clearTimeout(graphTimeout);
  }

  timeout[cardId] = setTimeout(() => {
    callback();
  }, delay);
};

export const mouseEnterEvent = (cardId: string): void => {
  if(!cardId){
    return;
  }
  const graphTimeout = timeout[cardId];
  if(graphTimeout){
    clearTimeout(graphTimeout);
    timeout[cardId] = null;
  }
};

const helpers = {
  mouseEnterEvent,
  mouseLeaveEvent
};

export default helpers;
