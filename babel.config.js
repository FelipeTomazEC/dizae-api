/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line func-names
module.exports = function (api) {
  api.cache(false);
  const presets = ['@babel/preset-env', '@babel/preset-typescript'];
  const plugins = [
    [require('@babel/plugin-proposal-class-properties'), { loose: false }],
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['.'],
        alias: {
          '@entities': './src/entities',
          '@shared': './src/shared',
          '@utils': './src/utils',
          '@use-cases': './src/use-cases',
          '@interface-adapters': './src/interface-adapters'
        },
      },
    ],
  ];

  return {
    plugins,
    presets,
  };
};
