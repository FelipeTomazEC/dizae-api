module.exports = function (api) {
    api.cache(true);
    const presets = ['@babel/preset-env', '@babel/preset-typescript'];
    const plugins = [
        [require.resolve('babel-plugin-module-resolver'),
        {
            alias: {
                '@entities': './src/entities'
            }
        }]
    ]

    return {
        plugins,
        presets
    };
}