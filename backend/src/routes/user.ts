import { Hono } from "hono";
import {
  createPlant,
  deletePlant,
  getPlants,
  getPlantsById,
  getStreakByPlantId,
  getUser,
  latestWatered,
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
userRoutes.get("/plant/:id", getPlantsById);
userRoutes.get("/get-user/:id", getUser);
userRoutes.get("/posts", posts);
userRoutes.get("/streak/:id", getStreakByPlantId);
userRoutes.get("/latest-watered/:id", latestWatered);

userRoutes.put("/update-user/:id", updateUser);
userRoutes.put("/update-plant/:id", updatePlant);

userRoutes.delete("/deletePlant", deletePlant);

export default userRoutes;
