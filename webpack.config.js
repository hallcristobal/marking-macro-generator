const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "./src/index.js"),
    mode: process.env.NODE_ENV === "development" ? "development" : "production",
    devtool: process.env.NODE_ENV === "development" && "source-map",
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.js(x?)$/,
                use: ['babel-loader']
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                reactVendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                }
            }
        }
    }
}
