import { GetProfileByUsername, GetUserPosts } from "@/actions/profile-action";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
    
  const { username } = await params
  const user = await GetProfileByUsername(username)

  if (!user) return;

  return {
    title: `${user.name} ?? ${user.username}`,
    description: user.bio || `Check out ${user.name}'s profile.`,
  };
}

const page = async ({ params }: { params: Promise<{ username: string }> }) => {

    const {username} = await params
    const user = await GetProfileByUsername(username)

    if(!user) notFound()

    const post = await GetUserPosts(user.id)

  return (<ProfilePageClient 
    user={user}
    posts={post}
  />);
};

export default page;
