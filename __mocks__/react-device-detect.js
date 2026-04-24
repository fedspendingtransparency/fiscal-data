const rdd = jest.createMockFromModule('react-device-detect');
rdd.isIE = false;
module.exports = rdd;
