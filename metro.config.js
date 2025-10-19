const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable web-specific optimizations
config.transformer = {
  ...config.transformer,
};

// Enable async/dynamic imports for code splitting
config.resolver = {
  ...config.resolver,
};

module.exports = config;
