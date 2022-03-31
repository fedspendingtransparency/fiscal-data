const rdd = jest.genMockFromModule('react-device-detect');
rdd.isIE = false;
module.exports = rdd;
