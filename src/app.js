import express from "express";
import contactsRouter from "./routes/contacts.router.js";
import cors from "cors";
import morgan from "morgan";
import { __mainDirname } from "./utils.js";
import swaggerUiExpress from "swagger-ui-express";
import swaggerFile from "../swagger-output.json";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.use(
  "/api/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerFile)
);
app.use("/contacts", contactsRouter);

app.listen(8080, () => console.log("Server Running at 8080"));
