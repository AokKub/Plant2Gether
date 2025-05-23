import { Hono } from "hono";
import {
  createPlant,
  getPlants,
  getUser,
  post,
  posts,
  updatePlant,
  updateUser,
} from "../controllers/user";
import { authMiddleware } from "../middlewares/middlewares";

const userRoutes = new Hono();

userRoutes.use(authMiddleware);

userRoutes.post("/add-plant", createPlant);
userRoutes.post("/post", post);

userRoutes.get("/get-plants/:id", getPlants);
userRoutes.get("/get-user/:id", getUser);
userRoutes.get("/posts", posts);

userRoutes.put("/update-user/:id", updateUser);
userRoutes.put("/update-plant/:id", updatePlant);

export default userRoutes;
