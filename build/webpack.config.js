import webpack from "webpack";
import path from "path";
import nodeExternals from "webpack-node-externals";
// import ExtractTextPlugin from "extract-text-webpack-plugin";

const mainSource = path.resolve(__dirname, "../source/index.js");

// Random hashed CSS classes
let mainOutputPath = "themes/[name].js";
const externals = [nodeExternals()];
const entry = {};

switch (process.env.DOWNDROP_BUILD) {
    case "core":
        entry.main = [mainSource];
        mainOutputPath = "[name].js";
        externals.push(/themes\/default/);
        break;
    default:
        break;
}

// eslint-disable-next-line no-underscore-dangle
const __DEV__ = process.env.NODE_ENV === "development";

const webpackConfig = {
    context: path.resolve(__dirname, ".."),
    target: "node",
    externals,
    entry,
    output: {
        filename: mainOutputPath,
        path: path.resolve(__dirname, "../dist"),
        libraryTarget: "umd"
    },
    cache: true,
    devtool: "source-map",

    stats: {
        colors: true,
        reasons: true
    },

    plugins: __DEV__
        ? []
        : [
              // new ExtractTextPlugin(cssOutputPath),
              new webpack.optimize.UglifyJsPlugin({
                  sourceMap: true
              }),
              new webpack.optimize.AggressiveMergingPlugin()
          ],

    resolve: {
        extensions: ["*", ".js", ".jsx", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: [
                    {
                        loader: "babel-loader",
                        query: {
                            babelrc: false,
                            cacheDirectory: path.resolve(
                                __dirname,
                                "../babel-cache"
                            ),
                            ignore: "node_modules/**/*",
                            plugins: [
                                "babel-plugin-add-react-displayname",
                                "babel-plugin-transform-class-properties",
                                [
                                    "babel-plugin-transform-runtime",
                                    {
                                        helpers: true,
                                        polyfill: false,
                                        regenerator: true
                                    }
                                ],
                                "babel-plugin-transform-object-rest-spread",
                                "babel-plugin-transform-decorators-legacy"
                            ],
                            presets: [
                                "babel-preset-react",
                                [
                                    "babel-preset-env",
                                    {
                                        modules: false,
                                        uglify: false
                                    }
                                ]
                            ]
                        }
                    },
                    "eslint-loader"
                ]
            }
        ]
    }
};

export default webpackConfig;
