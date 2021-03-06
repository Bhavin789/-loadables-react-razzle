import App from "./App";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";
import path from "path";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", (req, res) => {
    // This is the stats file generated by webpack loadable plugin

    /**
     * razzle.config.js creates a stats file in the below path,
     * so need to extract out from there
     */
    const statsFile = path.resolve("./build/public/loadable-stats.json");

    /**
     * We create an extractor from the statsFile
     *
     * Razzle sets a default entry point to `client`,
     * so we need to pass `client` here as an entrypoint.
     */

    const webExtractor = new ChunkExtractor({
      statsFile,
      entrypoints: ["client"],
    });

    // Wrap your application using "collectChunks"

    /**
     * We can also use `ChunkExtractorManager` instead of `collectChunks`,
     * but this is much more neat!
     */

    const jsx = webExtractor.collectChunks(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    // Render your application
    const markup = renderToString(jsx);

    const context = {};

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ""
        }
        ${webExtractor.getLinkTags()}
        ${webExtractor.getStyleTags()}
        ${
          process.env.NODE_ENV === "production"
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${markup}</div>
        ${webExtractor.getScriptTags()}
    </body>
</html>`
      );
    }
  });

export default server;
