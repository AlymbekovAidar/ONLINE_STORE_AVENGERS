const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require("next/constants");
const path = require("path");

const getBuildConfig = () => {
    const path = require("path");
    const postcssPresetEnv = require("postcss-preset-env");
    const postcssPresetEnvOptions = {
        features: {
            "custom-media-queries": true,
            "custom-selectors": true,
        },
    };

    const cssOptions = {
        postcssLoaderOptions: {
            plugins: [postcssPresetEnv(postcssPresetEnvOptions)],
        },
        sassOptions: {
            includePaths: [path.join(process.cwd(), "src", "common", "css")],
        },
    };

    const nextConfig = {
        ...cssOptions,
        webpack(config) {
            config.module.rules.push({
                test: /\.svg$/,
                include: path.join(process.cwd(), "src", "components", "icon", "icons"),
                use: [
                    "svg-sprite-loader",
                    {
                        loader: "svgo-loader",
                        options: {
                            plugins: [
                                { removeAttrs: { attrs: "(fill)" } },
                                { removeTitle: true },
                                { cleanupIDs: true },
                                { removeStyleElement: true },
                            ],
                        },
                    },
                ],
            });
            return config;
        },
        env: {
            MAIN_URL: process.env.MAIN_URL,
            ACCESS_TOKEN: process.env.ACCESS_TOKEN,
            GOOGLE_RE_CAPTCHA_CLIENT_SITE_KEY: process.env.GOOGLE_RE_CAPTCHA_CLIENT_SITE_KEY,
            BISHKEK_CITY_CODE: process.env.BISHKEK_CITY_CODE,
        },
    };
    return nextConfig;
};

module.exports = phase => {
    const shouldAddBuildConfig = phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD;
    return shouldAddBuildConfig ? getBuildConfig() : {};
};
