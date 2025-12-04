module.exports = function override(config, env) {
  // Add rule to handle nft.storage
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  });

  // Ignore source map warnings for node_modules
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
}
