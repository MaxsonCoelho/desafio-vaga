const { getSentryExpoConfig } = require("@sentry/react-native/metro");

module.exports = (() => {
  const config = getSentryExpoConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
  config.transformer.minifierConfig.compress.drop_console = true;
  config.resolver = {
    ...resolver,
    assetExts: [...resolver.assetExts.filter((ext) => ext !== "svg"), "lottie"],
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  return config;
})();
