module.exports = function override(config, env) {
  // Configure babel to transpile nft.storage package
  const babelLoaderRule = config.module.rules.find(
    rule => rule.oneOf
  );

  if (babelLoaderRule) {
    const babelLoader = babelLoaderRule.oneOf.find(
      loader => loader.loader && loader.loader.includes('babel-loader')
    );

    if (babelLoader) {
      // Remove node_modules from exclude to allow nft.storage to be transpiled
      babelLoader.include = [
        babelLoader.include,
        /node_modules\/nft\.storage/
      ];
    }
  }

  return config;
}
