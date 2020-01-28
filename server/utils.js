import fetch from "isomorphic-fetch";

import { getSingleNewsData } from "./middlewares/news";
import { getSingleMusicianData } from "./middlewares/musicians";
import { getSingleScoreData } from "./middlewares/scores";

const apiUrl = process.env.HOST;

export const getFetchFn = req => {
  const { originalUrl } = req;
  const { id } = req.params;

  if (id) {
    if (originalUrl.includes("news")) {
      return getSingleNewsData;
    }

    if (originalUrl.includes("musician")) {
      return getSingleMusicianData;
    }

    if (originalUrl.includes("score")) {
      return getSingleScoreData;
    }
  } else {
    return undefined;
  }
};

export const getOptions = (query, lang = "hy") => ({
  method: "POST",
  body: JSON.stringify({ query }),
  headers: {
    "Content-type": "application/json",
    "Accept-Language": lang
  }
});

export const fetchGraphData = async (options, query) =>
  await fetch(apiUrl, options || getOptions(query)).then(
    async res => await res.json()
  );

export const checkForErrors = (res, path) =>
  res && res.errors && console.error(`Error on, ${path}`, res.errors);
