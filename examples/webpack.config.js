import webpack from "webpack";
import path from "path";

// const librarySource = file => path.resolve(__dirname, "../dist", file);
const librarySource = () => path.resolve(__dirname, "../source/index.js");

const webpackConfig = {
    context: path.resolve(__dirname, ".."),
    entry: {
        bundle: [
            "babel-polyfill",
            "react-hot-loader/patch",
            "./examples/source/client.jsx",
            "webpack-hot-middleware/client?path=/__what"
        ]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "scripts"),
        publicPath: "/scripts/",
        sourcePrefix: ""
    },
    cache: true,
    devtool: "source-map",

    stats: {
        colors: true,
        reasons: true
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],

    resolve: {
        extensions: [".js", ".jsx", ".json", ".css"],
        // NOTE: Here I'm aliasing everything so the imports in the exanples represent how importing from the released
        // package would look. Normally using the module direct from npm you do not have to alias in your webpack.
        alias: {
            downdrop: librarySource("main.js")
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/, /dist/],
                loaders: [
                    {
                        loader: "babel-loader",
                        query: {
                            babelrc: false,
                            cacheDirectory: path.resolve(
                                __dirname,
                                "../babel-cache"
                            ),
                            ignore: ["dist", "node_modules/**/*"],
                            plugins: [
                                "react-hot-loader/babel",
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
                                "babel-plugin-transform-decorators-legacy",
                                "babel-plugin-emotion"
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
            },
            /*
                Note the configuration here (in case you have problems):
                For local css files we are using CSS modules and style loader to selectively
                load the styles. But packaged CSS will just be loaded directly into <style> tags.
                This will not work for isomorphic rendering, you will need a different approach.
            */ {
                test: /\.css$/,
                exclude: [/node_modules/, /dist/],
                loader:
                    "style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader"
            },
            {
                test: /\.css$/,
                include: [/node_modules/, /dist/],
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    }
};

export default webpackConfig;
