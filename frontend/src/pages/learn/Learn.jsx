import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Post from "../../components/Post";
import AddpostBar from "../../components/AddpostBar";
import eventBanner from "../../assets/learn.jpeg";

const dummyPosts = [
  {
    id: 1,
    username: "Demo1",
    course: "BTECH-CSE_WIP",
    profilePic: "https://i.pravatar.cc/150?img=33",
    hashtags: ["#art", "#community"],
    content: "CRACK DSA QUESTIONS IN EASE!!!!!!",
    images: ["https://intellipaat.com/blog/wp-content/uploads/2019/02/Data-Structures-Cheat-Sheet.png"],
  },
  {
    id: 2,
    username: "Demo2",
    course: "BTECH-CSE_WIP",
    profilePic: "https://i.pravatar.cc/150?img=45",
    hashtags: ["#code", "#react"],
    content: "Hey I have been working on a project,and there were several challenges I faced!",
    images: [],
  },
];

const Learn = () => {
  const [posts, setPosts] = useState(dummyPosts);
  const [newContent, setNewContent] = useState("");

  return (
    <>
      <NavBar />

      <div className="bg-[#1a1a1a] min-h-screen flex flex-col items-center py-6 px-4 sm:px-6 md:px-12 gap-6">
        {/* Banner Image */}
        <div className="w-full max-w-[2050px] h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] rounded-2xl shadow-xl overflow-hidden">
          <img
            src={eventBanner}
            alt="Event Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Add Post Bar */}
        <AddpostBar />

        {/* Posts List */}
        <div className="flex flex-col gap-6 w-full max-w-[950px]">
          {posts.map((post) => (
            <Post
              key={post.id}
              username={post.username}
              course={post.course}
              profilePic={post.profilePic}
              hashtags={post.hashtags}
              content={post.content}
              images={post.images}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Learn;
