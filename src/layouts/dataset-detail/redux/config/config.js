import {createStore} from 'redux';

const datasetConfig = (config = {}, newConfig) => {
  if (newConfig && newConfig.value && newConfig.value.datasetId) {
    config = newConfig.value;
  }

  return config;
}

export default createStore(datasetConfig);
