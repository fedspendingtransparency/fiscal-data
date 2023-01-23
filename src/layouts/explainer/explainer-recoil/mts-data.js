import {atom, selector} from 'recoil';
import {basicFetch} from "../../../utils/api-utils";

const currentMTSDataURL = atom({
  key: 'CurrentMTSDataURL',
  default: '',
});

const currentMTSDataState = selector({
  key: 'CurrentMTSData',
  get: async ({get}) => {
    const response = await basicFetch(get(currentMTSDataURL));
    return response.data;
  }
});

export {currentMTSDataURL,currentMTSDataState};
