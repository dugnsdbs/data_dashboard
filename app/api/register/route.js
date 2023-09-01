import prisma from "@/app/src/libs/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(res) {
  try {
    const data = await res.json();
    const { email, password, role, name } = data;

    if (!email || !password || !role || !name) {
      return NextResponse.error("Missing parameters", { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role,
        // role,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error("Something is wrong during register", {
      status: 400,
    });
  }
}
