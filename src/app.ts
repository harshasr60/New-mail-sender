import express from "express";
import { json } from "body-parser";
import cors from "cors";
import emailRoutes from "./routes/emailRoutes";

const app = express();

app.use(cors());
app.use(json());
app.use("/api", emailRoutes);

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

export default app;
