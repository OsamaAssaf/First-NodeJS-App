import express from "express";
import userRouter from "./routes/users";

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Home");
});

app.use("/users", userRouter);

app.listen(3000);
