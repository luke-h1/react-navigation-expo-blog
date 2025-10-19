/* eslint-disable no-undef */
const createExpoWebpackConfig = require("@expo/webpack-config");
const path = require("path");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfig(env, argv);

  // Add support for TypeScript path aliases
  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    "@src": path.resolve(__dirname, "src"),
  };

  return config;
};
