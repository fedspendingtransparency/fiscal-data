import { useRecoilRefresher_UNSTABLE, useRecoilState } from 'recoil';
import { useEffect } from 'react';

const useShouldRefreshCachedData = (timestamp, dataState, cachedState) => {
  const refreshData = useRecoilRefresher_UNSTABLE(dataState);
  const [lastCached, setLastCached] = useRecoilState(cachedState);

  useEffect(() => {
    if (lastCached !== 0 && Math.abs(timestamp - lastCached) >= 300000) {
      refreshData();
      setLastCached(Date.now());
    } else if (lastCached === 0) {
      setLastCached(Date.now());
    }
  }, []);

  return lastCached;
};

export default useShouldRefreshCachedData;
