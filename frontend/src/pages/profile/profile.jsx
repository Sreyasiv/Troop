import React from "react";
import NavBar from "../../components/NavBar";
import Post from "../../components/Post";

const user = {
  name: "SREYAA_06",
  course: "BTECH CSE WIP",
  bio: "Powered by caffeine and bad decisions",
  email: "sreyasvkmr@gmail.com",
  clubs: ["Aesthetica", "Resonance", "Code-Forge"],
  shop: {
    name: "The Madras Kadai",
    tagline: "Idhu Namma Kadai",
    image: "https://images.unsplash.com/photo-1474128670149-7082a8d370ea?q=80",
  },
  posts: [
    {
      id: 1,
      username: "SREYAA_06",
      course: "BTECH CSE WIP",
      profilePic: "https://i.pravatar.cc/150?img=12",
      hashtags: ["#sell", "#laptop"],
      content: "Selling Laptop — Dell Inspiron, 8GB RAM, 512GB SSD",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
      ],
    },
    {
      id: 2,
      username: "SREYAA_06",
      course: "BTECH CSE WIP",
      profilePic: "https://i.pravatar.cc/150?img=12",
      hashtags: ["#thrift", "#cycle"],
      content: "Second-hand Cycle — Hero Sprint, barely used 🚴‍♂️",
      images: [
        "https://images.unsplash.com/photo-1605719124489-4b3b4931ef65?w=600",
      ],
    },
  ],
};

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <NavBar />

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 p-6">
        {/* Sidebar */}
        <div className="sticky top-20 h-fit">
          <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg">
            {/* Profile Info */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#f4a261] mb-4"></div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.course}</p>
              <p className="text-sm text-gray-400 mt-2">{user.bio}</p>
            </div>

            {/* Contact */}
            <div className="mt-6 text-sm">
              <p className="font-semibold">Contact:</p>
              <p className="text-gray-400">{user.email}</p>
            </div>

            {/* Clubs */}
            <div className="mt-6">
              <p className="font-semibold mb-2">Clubs:</p>
              <div className="flex flex-wrap gap-2">
                {user.clubs.map((club, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#2a2a2a] rounded-full text-sm"
                  >
                    {club}
                  </span>
                ))}
              </div>
            </div>

            {/* Activity Stats (static for now) */}
            <div className="mt-6">
              <p className="font-semibold mb-2">Activity</p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>Posts: {user.posts.length}</li>
              </ul>
            </div>

            

            {/* Fun fact / Quote (static) */}
            <div className="mt-6 text-sm italic text-gray-400">
              "Stay caffeinated. Stay coding."
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Shop / Thrift */}
          {user.shop && (
            <div className="bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
              <img
                src={user.shop.image}
                alt={user.shop.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{user.shop.name}</h3>
                <p className="text-gray-400">{user.shop.tagline}</p>
              </div>
            </div>
          )}

          {/* User Posts */}
          <div>
            <h3 className="text-xl font-bold mb-4">Your Posts</h3>
            {user.posts.length > 0 ? (
              <div className="flex flex-col gap-6">
                {user.posts.map((post) => (
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
            ) : (
              <p className="text-gray-400">No posts found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
