const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const mode = argv.mode ?? 'development';
  const production = mode === 'production';

  const plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),

    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          filter: (path) => !path.endsWith('index.html'),
        },
      ],
    }),

    new ForkTsCheckerWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ];

  return {
    mode,
    entry: {
      app: path.resolve(__dirname, 'src/index.ts'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      modules: [path.resolve(__dirname, '.'), 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: require.resolve('swc-loader'),
        },
        {
          test: /\.s?css$/,
          use: [
            {
              loader: !production
                ? 'style-loader'
                : MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
                modules: {
                  auto: /\.module\.scss/,
                  mode: 'local',
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    output: {
      filename: production ? '[name].[chunkhash].js' : undefined,
      chunkFilename: production ? '[id].[chunkhash].js' : '[id].js',

      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      clean: true,
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    },
    devtool: production ? 'source-map' : 'cheap-module-source-map',
    plugins,
    devServer: {
      port: 4781,
      allowedHosts: 'all',
      historyApiFallback: true,
    },
  };
};
