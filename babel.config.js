module.exports = function (api) {
  api.cache(false);
  const presets = ['@babel/preset-env', '@babel/preset-typescript'];
  const plugins = [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['.'],
        alias: {
          '@entities': './src/entities',
        },
      },
    ],
  ];

  return {
    plugins,
    presets,
  };
};
