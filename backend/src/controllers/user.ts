import type { Context } from "hono";
import {
  addplant,
  createUser,
  getPlantsByUserId,
  getUserById,
  isLogin,
  updatePlantData,
  updatePlantDataWithOutImage,
  updateUserData,
  updateUserDataWithOutImage,
} from "../models/user";
import { uploadToCloudinary } from "../services/cloudinary";

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
    const plantName = body["plantName"] as string;
    const plantNickName = body["plantNickName"] as string;
    const setTime = body["reminderTime"] as string;
    const img = body["image"] as File;

    if (!img) {
      const addedPlant = await updatePlantDataWithOutImage(
        Number(plantId),
        Number(userId),
        plantName,
        plantNickName,
        setTime,
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

export {
  signUp,
  login,
  createPlant,
  getPlants,
  getUser,
  updateUser,
  updatePlant,
};
