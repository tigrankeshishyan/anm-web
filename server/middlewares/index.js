import path from "path";
import isBot from "isbot";
import dirname from 'es-dirname';

import { getFetchFn } from "../utils";
import { appDefaultData } from "../constants";

const getUrl = req => process.env.HOST + req.originalUrl;

export default (req, res) => {
  // Detect if the request comes from browser or from crawler, spider, etc.
  if (isBot(req.headers["user-agent"])) {
    const fetchDataFn = getFetchFn(req);
    const url = getUrl(req);

    if (fetchDataFn) {
      fetchDataFn(req.params.id, req.params.locale, url).then(data => {
        const { title, content, imageUrl, description } = data;

        res.render("main", {
          ...appDefaultData,
          url,
          title,
          content,
          imageUrl,
          description
        });
      });
    } else {
      res.render("main", { ...appDefaultData, url });
    }
  } else {
    res.sendFile(path.resolve(dirname(), "../../client/build/index.html"));
  }
};
