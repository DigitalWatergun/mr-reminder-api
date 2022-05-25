const path = require("path");
const nodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = (env) => {
    const config = {
        mode: env.mode,
        devtool: env.mode == "development" ? "source-map" : undefined,
        entry: {
            server: "./src/server.js",
        },
        target: "node",
        experiments: {
            topLevelAwait: true,
        },
        externals: [nodeExternals()],
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist"),
        },
        plugins: [new NodemonPlugin()],
        module: {},
    };

    return config;
};
