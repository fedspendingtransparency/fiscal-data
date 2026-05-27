/*
  Required entries:
  ENV_ID - {'preprod','production'}
  API_BASE_URL - {ex: 'https://api.fiscaldata.treasury.gov'}
*/

/*
  Supported entries include:
  EXPERIMENTAL_WHITELIST - [ 'feature-id' ] // array of as-needed feature-ids whose <Experimental /> wrappers should be respected
  LOWER_ENV_FEATURE_WHITELIST - [ 'feature-id' ] // array of as-needed feature-ids whose <LowerEnvironmentFeature /> wrappers should be respected
  ADDITIONAL_DATASETS - {structured object keyed by Id following form in transform/static-metadata/datasets.json}
  EXCLUDED_ENDPOINT_IDS - {simple array of endpoint IDs to exclude, eg: ['27', '94'];
  ADDITIONAL_ENDPOINTS - {structured object keyed by Id following form of endpointConfig in transform/endpointConfig.js}
*/

module.exports = {
  ENV_ID: 'production',
  API_BASE_URL: 'https://api.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://api.fiscaldata.treasury.gov',
};
