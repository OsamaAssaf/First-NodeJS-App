import express, { NextFunction, Response, Request } from "express";
import userRouter from "./routes/users";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "./src/views");

// app.use(logger);

// app.get("/", logger, (req, res, next) => {
//   res.send("Home");
// });

app.use("/users", userRouter);

function logger(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl);
  next();
}

app.listen(3000);
