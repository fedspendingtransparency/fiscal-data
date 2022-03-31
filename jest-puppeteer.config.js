/* istanbul ignore file */
const {  npm_config_post_build_test_port } = process.env;
const postBuildTestPort =  1*npm_config_post_build_test_port || 9898;
module.exports = {
  server: {
    command: `gatsby serve -p ${postBuildTestPort}`,
    port: postBuildTestPort,
    launchTimeout: 60000
  },
};
