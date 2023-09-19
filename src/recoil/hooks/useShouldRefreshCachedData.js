import { useRecoilRefresher_UNSTABLE, useRecoilState } from 'recoil';

const useShouldRefreshCachedData = (timestamp, dataState, cachedState) => {
  const refreshData = useRecoilRefresher_UNSTABLE(dataState);
  const [lastCached, setLastCached] = useRecoilState(cachedState);

  if (lastCached !== 0 && Math.abs(timestamp - lastCached) >= 300000) {
    refreshData();
    setLastCached(Date.now());
  } else if (lastCached === 0) {
    setLastCached(Date.now());
  }

  return lastCached;
};

export default useShouldRefreshCachedData;
