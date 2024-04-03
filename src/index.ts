import AppEnv from "./app-env";
import express from "express";
import router from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(AppEnv.serverPort, () => {
  console.log(`Server is running on port ${AppEnv.serverPort}`);
});
