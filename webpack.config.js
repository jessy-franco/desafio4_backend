
export default {
    // ...
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.handlebars$/,
                use: "handlebars-loader", // Añade esta regla
            },
        ],
    },
};