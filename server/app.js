import path from "path";

import dirname from "es-dirname";
import express from "express";
import hbs from "express-handlebars";

import reqMiddleware from "./middlewares";
import { dynamicRoutes } from "./constants";

const app = express();

const PORT = process.env.PORT || 8000;

const clientBuild = path.resolve(`${dirname()}/../client/build`);
app.use(express.static(clientBuild));

app.set("view engine", "hbs");

app.engine("hbs", hbs({ extname: "hbs" }));

app.set("views", path.resolve(dirname(), "./views"));

app.use(dynamicRoutes, reqMiddleware);

app.use("*", reqMiddleware);

app.listen(PORT, _ => {
  console.log("OK, port is ", PORT);
});
