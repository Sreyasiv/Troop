import React, { useEffect, useState } from "react";
import MarketNavBar from "./MarketNavBar";
import Post from "../../components/Post";
import AddpostBar from "../../components/SearchBar";
import eventBanner from "../../assets/angaadi.jpeg";
import NavBar from "../../components/NavBar";

const dummyPosts = [
  {
    id: 1,
    username: "Sehamed",
    course: "BTECH-CSE_WIP",
    profilePic: "https://i.pravatar.cc/150?img=33",
    hashtags: ["#art", "#community"],
    content: "I used this for studying...u also study da parama",
    images: [],
  },
  {
    id: 2,
    username: "Yogesh",
    course: "BTECH-CSE_WIP",
    profilePic: "https://i.pravatar.cc/150?img=45",
    hashtags: ["#code", "#react"],
    content: "This Udemy course is Helpful for DSA interview",
    images: [
      "https://videos.openai.com/vg-assets/assets%2Ftask_01jsnnz8gvf38t47ns38p1846z%2F1745558215_img_0.webp?st=2025-04-25T04%3A15%3A25Z&se=2025-05-01T05%3A15%3A25Z&sks=b&skt=2025-04-25T04%3A15%3A25Z&ske=2025-05-01T05%3A15%3A25Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=fnT6Y6EVPT8uj%2Fql22bxSUmlC9afaczzAGG4eVLg0go%3D&az=oaivgprodscus",
    ],
  },
];

const Explore = () => {
  const [posts, setPosts] = useState(dummyPosts);
  const [newContent, setNewContent] = useState("");

  return (
    <>
      <NavBar />

      <div className="bg-[#1a1a1a] min-h-screen flex flex-col items-center py-6 px-4 sm:px-6 md:px-12 gap-6">
        {/* Banner Image */}
        <div className="w-full max-w-[2050px] h-[280px] lg:h-[320px] rounded-t-2xl shadow-xl overflow-hidden">
          <img
            src={eventBanner}
            alt="Event Banner"
            className="w-full h-full object-cover"
          />
        </div>


    <MarketNavBar/>
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

export default Explore;
