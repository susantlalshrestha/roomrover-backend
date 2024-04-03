import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import AppEnv from "../app-env";
import { Router } from "express";

const docs = swaggerJSDoc({
  apis: ["./**/*.ts"],
  definition: {
    info: {
      title: "Roomrover API with Swagger",
      version: "1.0.0",
    },
    basePath: `http://localhost:${AppEnv.serverPort}`,
  },
});

const swagger = Router();

swagger.use("/swagger", serve, setup(docs, { explorer: true }));

export default swagger;
