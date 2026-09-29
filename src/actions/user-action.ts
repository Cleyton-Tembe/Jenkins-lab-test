"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function SyncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    const checkuser = await prisma.user.findUnique({
      where: {
        clerkid: userId,
      },
    });

    if (checkuser) return checkuser;

    const saveUser = await prisma.user.create({
      data: {
        clerkid: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        image: user.imageUrl,
      },
    });

    return saveUser;
  } catch (error) {
    console.log("SyncUser Error:", error);
  }
}

export async function GetUserByClerkId(clerkid: string) {
  try {
    return prisma.user.findUnique({
      where: {
        clerkid: clerkid,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            post: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("GetUserByClerkId:", error);
  }
}

export async function GetDbUserId() {
  const { userId: clerkid } = await auth();

  if (!clerkid) return;

  const user = await GetUserByClerkId(clerkid);

  if (!user) return;

  return user.id;
}
