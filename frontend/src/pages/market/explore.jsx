import React, { useEffect, useState } from "react";
import MarketNavBar from "./MarketNavBar";
import Post from "../../components/Post";
import AddpostBar from "../../components/SearchBar";
import eventBanner from "../../assets/angaadi.jpeg";
import NavBar from "../../components/NavBar";

const dummyPosts = [
  {
    id: 1,
    username: "Demo1",
    course: "BTECH-CSE_WIP",
    profilePic: "https://i.pravatar.cc/150?img=33",
    hashtags: ["#market", "#business"],
    content: "Hey this is Sanya! I just opened a online shop for cakes and desserts!These are my recent works! Please support",
    images: ["https://thedessertedgirl.com/wp-content/uploads/2024/09/MiniEgglessChocolateCake2.jpg","https://yummycake.in/wp-content/uploads/2023/12/Cute-Small-Cake.jpg"],
  },
  {
    id: 2,
    username: "Demo2",
    course: "BTECH-CSE_WIP",
    profilePic: "https://i.pravatar.cc/150?img=45",
    hashtags: ["#code", "#react"],
    content: "Hey i am freelancing for Figma design,this is my profile on Fiverr.you can contact me if u want some work done!!",
    images: ["https://miro.medium.com/v2/resize:fit:1129/1*1gcEkZCyl_U9EIidXPUDfw.png"]
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
