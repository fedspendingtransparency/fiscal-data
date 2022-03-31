const babelOptions = {
  presets: ["@babel/preset-react", "babel-preset-gatsby", "@babel/preset-typescript"],
  plugins: ['dynamic-import-node', "transform-react-remove-prop-types"],
  env: {
    test: {
      plugins: ['dynamic-import-node']
    }
  }
};

module.exports = require("babel-jest").default.createTransformer(babelOptions);
