import { useRecoilRefresher_UNSTABLE, useRecoilState } from 'recoil';
import { useEffect } from 'react';

const useShouldRefreshCachedData = (dataState, cachedState) => {
  const refreshData = useRecoilRefresher_UNSTABLE(dataState);
  const [lastCached, setLastCached] = useRecoilState(cachedState);

  useEffect(() => {
    const now = Date.now();
    if (lastCached !== 0 && Math.abs(now - lastCached) >= 300000) {
      refreshData();
      setLastCached(now);
    } else if (lastCached === 0) {
      setLastCached(now);
    }
  }, []);

  return lastCached;
};

export default useShouldRefreshCachedData;
