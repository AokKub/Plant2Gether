import { Hono } from "hono";
import { cors } from "hono/cors";
import userRoutes from "./routes/user";
import { login, signUp } from "./controllers/user";
import { startCronJobs } from "./services/cron";
const app = new Hono();

app.use("*", cors());

startCronJobs();
app.post("/register", signUp);
app.post("/login", login);

app.route("/api", userRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
