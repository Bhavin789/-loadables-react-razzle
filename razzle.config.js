const LoadablePlugin = require("@loadable/webpack-plugin");

module.exports = {
  modify: (config, { target }) =>
    target === "web"
      ? {
          ...config,
          plugins: [...config.plugins, new LoadablePlugin()],
        }
      : config,
};
