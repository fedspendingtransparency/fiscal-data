module.exports = {
  presets: ['babel-preset-gatsby', 'babel-preset-jest', '@babel/preset-typescript'],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
};
