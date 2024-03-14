const path = require('path');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, './src/main.js'),
    output: {
        path: path.resolve(__dirname, 'output'),
        filename: 'main.js'
    },
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            options: {
            template: ".src/index.pug",
            filename: "index.html"
            }
        }),
        new StylelintPlugin({
            configFile: path.resolve(__dirname, 'stylelint.config.js')
        })
    ],
    module: {
        rules: [
            {
                use: [{
                    loader: MiniCssExtractPlugin.loader, 
                    options: {
                        esModule: true,
                    }
                }, 'css-loader'],
                test: /\.css$/
            },
            { 
                test: /\.pug$/,
                use: 'pug-loader',
            }
        ]
    },
    optimization: {
        minimizer: [
          `...`,
          new CssMinimizerPlugin(),
        ],
      },
      plugins: [new MiniCssExtractPlugin()],
}