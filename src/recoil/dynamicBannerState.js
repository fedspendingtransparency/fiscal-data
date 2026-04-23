import { apiPrefix, basicFetch } from '../utils/api-utils';
import { createdCachedFetchStore } from './createCachedFetchStore';

const fetchDynamicBanner = async () => {
  const endpointUrl = 'v1/reference/fiscal_data/announcements';
  const response = await basicFetch(`${apiPrefix}${endpointUrl}`);
  return response.data;
};

export const dynamicBannerState = createdCachedFetchStore(fetchDynamicBanner);
