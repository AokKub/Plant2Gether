import type { Context } from "hono";
import {
  addplant,
  createPost,
  createUser,
  delPlant,
  getAllPosts,
  getLatestWatered,
  getPlantsByPlantId,
  getPlantsByUserId,
  getPlantSteaksByPlantId,
  getUserById,
  isLogin,
  updatePlantData,
  updatePlantDataWithOutImage,
  updateUserData,
  updateUserDataWithOutImage,
} from "../models/user";
import { uploadToCloudinary } from "../services/cloudinary";
import { PlantStatus } from "../generated/prisma";

type singUpType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

const signUp = async (c: Context) => {
  try {
    const body = await c.req.json<singUpType>();

    const createdUser = await createUser(
      body.firstName,
      body.lastName,
      body.username,
      body.email,
      body.password,
    );

    if (!createdUser.status) {
      return c.json({
        status: false,
        msg: createdUser.msg,
      });
    }
    return c.json({
      status: true,
      createdUser,
    });
  } catch (error) {
    return c.json({
      status: false,
      msg: error,
    });
  }
};

type loginType = {
  email: string;
  password: string;
};

const login = async (c: Context) => {
  try {
    const body = await c.req.json<loginType>();
    if (!body.email || !body.password) {
      return c.json({
        status: false,
        msg: "invalid input",
      });
    }

    console.log(body);
    const loggedIn = await isLogin(body.email, body.password);
    console.log(loggedIn);
    if (!loggedIn.status) {
      return c.json({
        status: false,
        msg: loggedIn.msg,
      });
    }

    return c.json({
      status: true,
      loggedIn,
    });
  } catch (error) {
    return c.json({
      status: false,
      msg: error,
    });
  }
};

const latestWatered = async (c: Context) => {
  try {
    const plantId = c.req.param("id");
    const watered = await getLatestWatered(Number(plantId));
    return c.json({ status: true, watered });
  } catch (error) {
    return c.json({ status: false, msg: error });
  }
};

const deletePlant = async (c: Context) => {
  try {
    const { userId, plantId } = await c.req.json();
    const del = await delPlant(Number(userId), Number(plantId));
    return c.json({ status: true, del });
  } catch (error) {
    return c.json({ status: false, msg: error });
  }
};

const createPlant = async (c: Context) => {
  try {
    const body = await c.req.parseBody();
    const userId = body["userId"] as string;
    const plantName = body["plantName"] as string;
    const plantNickName = body["plantNickName"] as string;
    const setTime = body["timeReminder"] as string;
    const img = body["image"] as File;
    const subscription = JSON.parse(body["subscription"] as string);
    const imageResult = await uploadToCloudinary(img);
    console.log("this is addplant");
    console.log(subscription);
    console.log(userId);
    console.log(plantName);
    console.log(plantNickName);
    console.log(setTime);
    const addedPlant = await addplant(
      Number(userId),
      plantName,
      plantNickName,
      setTime,
      imageResult.secure_url,
      subscription,
    );

    return c.json({
      status: true,
      addedPlant,
    });
  } catch (error) {
    return c.json({
      status: false,
      msg: error,
    });
  }
};

const getUser = async (c: Context) => {
  const userId = c.req.param("id");

  const user = await getUserById(Number(userId));
  if (!user.status) {
    return c.json({
      status: false,
      msg: user.msg,
    });
  }
  return c.json({
    status: true,
    user,
  });
};

const updatePlant = async (c: Context) => {
  try {
    const plantId = c.req.param("id");
    const body = await c.req.parseBody();
    const userId = body["userId"] as string;
    const plantName = body["plant_name"] as string;
    const plantNickName = body["plant_nickname"] as string;
    const setTime = body["time_reminder"] as string;
    const plantStatus = body["status"] as string;
    const img = body["plant_img"] as File;
    const statusEnum = plantStatus.toUpperCase() as keyof typeof PlantStatus;
    if (!img) {
      const addedPlant = await updatePlantDataWithOutImage(
        Number(plantId),
        Number(userId),
        plantName,
        plantNickName,
        setTime,
        PlantStatus[statusEnum],
      );

      return c.json({
        status: true,
        addedPlant,
      });
    }

    const imageResult = await uploadToCloudinary(img);
    const addedPlant = await updatePlantData(
      Number(plantId),
      Number(userId),
      plantName,
      plantNickName,
      setTime,
      PlantStatus[statusEnum],
      imageResult.secure_url,
    );

    return c.json({
      status: true,
      addedPlant,
    });
  } catch (error) {
    return c.json({
      status: true,
      msg: error,
    });
  }
};

const updateUser = async (c: Context) => {
  const userId = c.req.param("id");
  const body = await c.req.parseBody();
  const fname = body["firstName"] as string;
  const lname = body["lastName"] as string;
  const email = body["email"] as string;
  const username = body["username"] as string;
  const img = body["profileImage"] as File;

  if (!img) {
    const updatedUser = await updateUserDataWithOutImage(
      Number(userId),
      fname,
      lname,
      email,
      username,
    );
    if (!updatedUser) {
      return c.json({
        status: false,
        msg: "failed to updat user data",
      });
    }

    return c.json({
      status: true,
      updatedUser,
    });
  }

  const imageResult = await uploadToCloudinary(img);
  console.log(imageResult);
  const updatedUser = await updateUserData(
    Number(userId),
    fname,
    lname,
    email,
    username,
    imageResult.secure_url,
  );
  if (!updatedUser) {
    return c.json({
      status: false,
      msg: "failed to updat user data",
    });
  }

  return c.json({
    status: true,
    updatedUser,
  });
};

const getPlants = async (c: Context) => {
  try {
    const userId = c.req.param("id");

    const getPlants = await getPlantsByUserId(Number(userId));

    return c.json({ status: true, getPlants });
  } catch (error) {
    return c.json({
      status: false,
      msg: error,
    });
  }
};

const getPlantsById = async (c: Context) => {
  try {
    const plantId = c.req.param("id");

    const getPlants = await getPlantsByPlantId(Number(plantId));

    return c.json({ status: true, getPlants });
  } catch (error) {
    return c.json({
      status: false,
      msg: error,
    });
  }
};

const getStreakByPlantId = async (c: Context) => {
  try {
    const plantId = c.req.param("id");

    const streak = await getPlantSteaksByPlantId(Number(plantId));

    return c.json({ status: true, streak });
  } catch (error) {
    return c.json({
      status: false,
      msg: error,
    });
  }
};

const post = async (c: Context) => {
  try {
    const { userId, plantId } = await c.req.json();

    // Basic validation
    if (!userId || !plantId) {
      return c.json({ error: "userId and plantId are required" }, 400);
    }

    // Call the model to create the post
    const newPost = await createPost(userId, plantId);

    return c.json({ message: "Post created successfully", post: newPost }, 201);
  } catch (error) {
    console.error("Error creating post:", error);
    return c.json({ error: "Failed to create post" }, 500);
  }
};

const posts = async (c: Context) => {
  try {
    const posts = await getAllPosts();
    return c.json({ posts }, 200);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    return c.json({ error: "Failed to retrieve posts" }, 500);
  }
};

export {
  signUp,
  login,
  createPlant,
  getPlants,
  getUser,
  updateUser,
  updatePlant,
  post,
  posts,
  getPlantsById,
  getStreakByPlantId,
  latestWatered,
  deletePlant,
};
