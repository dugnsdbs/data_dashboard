import prisma from "../libs/prismadb";

const getAllUsers = async () => {
  try {
    const allUsers = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    });

    if (!allUsers) {
      return null;
    }
    return allUsers;
  } catch (error) {
    return null;
  }
};

export default getAllUsers;
