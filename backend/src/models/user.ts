import { PlantStatus } from "../generated/prisma";
import { assignToken } from "../middlewares/middlewares";
import { db } from "../services/prisma";
import { getFixedTime } from "../utils/convertTime";
import { comparePassword, hashPassword } from "../utils/passwordHashing";

const createUser = async (
  firstName: string,
  lastName: string,
  userName: string,
  Email: string,
  pwd: string,
) => {
  try {
    console.log(Email);
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email: Email }, { username: userName }],
      },
    });

    if (existingUser) {
      return { status: false, msg: "user has existed" };
    }
    const hashedPassword = await hashPassword(pwd);
    const newUser = await db.user.create({
      data: {
        firstname: firstName,
        lastname: lastName,
        username: userName,
        email: Email,
        password: hashedPassword, // hash in real app
        user_img:
          "https://res.cloudinary.com/drjdfs1p5/image/upload/v1746346924/products/sapztapbybwptc1k7ox2.jpg",
      },
    });

    return { status: true, newUser };
  } catch (err) {
    console.error(err);
    return { status: false, msg: "Internal server error" };
  }
};

const isLogin = async (email: string, password: string) => {
  const user = await db.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    return {
      status: false,
      msg: "Can't find user account!",
    };
  }
  const hashedPassword = user?.password;
  const isCorrect = await comparePassword(password, hashedPassword);
  console.log(isCorrect);
  if (!isCorrect) {
    return {
      status: false,
      msg: "Password is invalid.",
    };
  }

  const token = await assignToken(user.id, user.username, user.email);
  if (!token.status) {
    return { status: token.status, msg: "secretKey not found" };
  }

  return {
    status: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.email,
      img_url: user.user_img,
    },
  };
};

const addplant = async (
  userId: number,
  plantname: string,
  plantnickname: string,
  remindertime: string,
  img: string,
  subscription: any,
) => {
  try {
    const [hours, minutes] = remindertime.split(":");
    const fixedDateTime = new Date(
      Date.UTC(1970, 0, 1, parseInt(hours), parseInt(minutes)),
    );
    console.log(hours);
    console.log(minutes);

    const addedplant = await db.plant.create({
      data: {
        userId,
        plant_name: plantname,
        plant_nickname: plantnickname,
        time_reminder: fixedDateTime,
        plant_img: img,
        status: "ALIVE",
      },
    });

    await db.subscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: { keys: subscription.keys, userId },
      create: {
        userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
    });

    return addedplant;
  } catch (error) {
    return { status: false, msg: error };
  }
};

const getUserById = async (userId: number) => {
  try {
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return { status: false, msg: "user not found" };
    }
    return { status: true, user };
  } catch (error) {
    return { status: false, msg: "Internal server error" };
  }
};

const getPlantsByUserId = async (id: number) => {
  try {
    const plants = db.plant.findMany({
      where: {
        userId: id,
      },
    });

    return plants;
  } catch (error) {
    return { status: false, msg: error };
  }
};
const updateUserData = async (
  id: number,
  firstname: string,
  lastname: string,
  email: string,
  username: string,
  user_img: string,
) => {
  try {
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        firstname,
        lastname,
        email,
        username,
        user_img,
      },
    });
    return updatedUser;
  } catch (error) {
    return { status: false, msg: "Internal server error" };
  }
};

const updateUserDataWithOutImage = async (
  id: number,
  firstname: string,
  lastname: string,
  email: string,
  username: string,
) => {
  try {
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        firstname,
        lastname,
        email,
        username,
      },
    });
    return updatedUser;
  } catch (error) {
    return { status: false, msg: "Internal server error" };
  }
};
//
// const PlantStatus: {
//   ALIVE: "ALIVE";
//   DEAD: "DEAD";
// };

const updatePlantData = async (
  id: number,
  userId: number,
  plant_name: string,
  plant_nickname: string,
  time_reminder: string,
  plant_status: PlantStatus,
  plant_img: string,
) => {
  try {
    const fixedTime = await getFixedTime(time_reminder);
    const updatedPlant = await db.plant.update({
      where: {
        id,
        userId,
      },
      data: {
        plant_name,
        plant_nickname,
        time_reminder: fixedTime,
        plant_img,
        status: plant_status,
      },
    });

    return updatedPlant;
  } catch (error) {
    return {
      status: false,
      msg: error,
    };
  }
};

const updatePlantDataWithOutImage = async (
  id: number,
  userId: number,
  plant_name: string,
  plant_nickname: string,
  time_reminder: string,
  plant_status: PlantStatus,
) => {
  const fixedTime = await getFixedTime(time_reminder);

  try {
    const updatedPlant = await db.plant.update({
      where: {
        id,
        userId,
      },
      data: {
        plant_name,
        plant_nickname,
        time_reminder: fixedTime,
        status: plant_status,
      },
    });
    return updatedPlant;
  } catch (error) {
    return {
      status: false,
      msg: error,
    };
  }
};

const createPost = async (userId: number, plantId: number) => {
  // Check if the user exists
  const user = await db.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  // Check if the plant exists and belongs to the user
  const plant = await db.plant.findUnique({
    where: { id: plantId },
  });
  if (!plant || plant.userId !== userId) {
    throw new Error("Plant not found or does not belong to the user");
  }

  // Check if the plant is alive
  if (plant.status === "DEAD") {
    throw new Error("Cannot create a post for a dead plant");
  }

  // Create the post
  const newPost = await db.post.create({
    data: {
      userId,
      plantId,
      status: true, // Assuming true means the plant was watered
    },
  });

  // Handle DayStreak logic
  // Step 1: Find the latest post for this plant (excluding the one just created)
  const latestPost = await db.post.findFirst({
    where: {
      plantId,
      userId,
      id: { not: newPost.id }, // Exclude the post we just created
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(latestPost);

  // Step 2: Check if the latest post is within 24 hours
  const now = new Date(); // Current time: May 23, 2025, 02:58 PM +07
  let streak = 1; // Default streak for a new post

  if (latestPost) {
    const latestPostTime = new Date(latestPost.createdAt);
    const timeDifference =
      (now.getTime() - latestPostTime.getTime()) / (1000 * 60 * 60); // Difference in hours

    // Step 3: Find the existing DayStreak record for this plant and user
    const existingStreak = await db.dayStreak.findFirst({
      where: {
        userId,
        plantId,
      },
    });

    if (timeDifference <= 24) {
      // Within 24 hours, increment the streak
      streak = existingStreak ? existingStreak.streak + 1 : 2; // If no streak record exists, start from 2 (1 from previous + 1 now)
    } else {
      // More than 24 hours, reset streak to 1
      streak = 1;
    }

    // Step 4: Update or create the DayStreak record
    if (existingStreak) {
      await db.dayStreak.update({
        where: { id: existingStreak.id },
        data: { streak },
      });
    } else {
      await db.dayStreak.create({
        data: {
          userId,
          plantId,
          streak,
        },
      });
    }
  } else {
    // No previous posts, this is the first post for the plant
    await db.dayStreak.create({
      data: {
        userId,
        plantId,
        streak: 1, // First streak
      },
    });
  }
  console.log(newPost);

  return newPost;
};

const getAllPosts = async () => {
  const posts = await db.post.findMany({
    include: {
      user: {
        select: { firstname: true, lastname: true, username: true },
      },
      plant: {
        select: { plant_name: true, plant_nickname: true, status: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
};

export {
  createUser,
  isLogin,
  addplant,
  getPlantsByUserId,
  getUserById,
  updateUserData,
  updateUserDataWithOutImage,
  updatePlantData,
  updatePlantDataWithOutImage,
  createPost,
  getAllPosts,
};
