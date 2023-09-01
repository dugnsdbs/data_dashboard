import getCurrentUser from "@/app/src/actions/getCurrentUser";
import prisma from "@/app/src/libs/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(res, params) {
  try {
    const { userId } = params.params;
    const currentUser = await getCurrentUser();
    if (currentUser.role !== "Admin") {
      return NextResponse.error();
    }

    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return NextResponse.json(`${user} has been deleted`);
  } catch (error) {
    return NextResponse.error();
  }
}
