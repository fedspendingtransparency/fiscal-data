import { selector } from "recoil";
import { apiPrefix, basicFetch } from "../utils/api-utils";

export const dynamicBannerState = selector({
  key: 'dynamicBannerState',
  get: async () => {
    const announcementsEndpoint = 'v1/reference/fiscal_data/announcements';
    const response = await basicFetch(`${apiPrefix}${announcementsEndpoint}`);
    const timeStamp = Date.now();
    return {
      payload: response.data,
      timeStamp: timeStamp,
    };
  },
});
