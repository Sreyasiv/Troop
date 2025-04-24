import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import SearchBar from "../../components/SearchBar";
import Post from "../../components/Post";

// Static posts data
const posts = [
  {
    username: "SURYA SIVAKUMAR",
    course: "B.TECH AI&DS",
    hashtags: ["#events", "#clubs"],
    body: "THE MUSIC CLUB AUDITIONS ARE ON!",
    images: [],
  },
  {
    username: "SREYA SIVAKUMAR",
    course: "B.TECH CSE",
    hashtags: ["#market", "#explore"],
    body: "THE NEW HONEY PIE IS ON SALE!",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9LfhrsXJsvUkQkc70EnQLADGdCdwzyJ7NIA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzk1BoVkxdhd5CcMFfoH039qg93QKm32OaIMZqWyqNKg00kdx7CC8A-OjsotPkkATPYjg&usqp=CAU",
    ],
  },
];

// Carousel images
const images = [
  "https://img.freepik.com/premium-vector/flat-summer-party-vertical-poster-template-with-photo_23-2148961210.jpg",
  "https://img.freepik.com/premium-vector/summer-design-template-elegant-simple-cover-template-design-cover-report-table_1114474-427.jpg?semt=ais_hybrid&w=740",
  "https://images.unsplash.com/photo-1584448141569-69f342da535c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9zdGVyfGVufDB8fDB8fHww",
];

const Lounge = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      {/* Carousel */}
      <div className="w-full flex justify-center my-1">
        <div className="overflow-hidden w-full  h-[350px] shadow-lg transition-all duration-1000">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentImage * 100}%)` }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`carousel-${index}`}
                className="w-full h-[450px] object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Posts */}
      <div className="flex flex-col items-center gap-6 pb-10">
        {posts.map((post, index) => (
          <Post
            key={index}
            username={post.username}
            course={post.course}
            profilePic="https://placehold.co/100x100" // Replace with real data if needed
            content={post.body}
            hashtags={post.hashtags}
            images={post.images}
          />
        ))}
      </div>
    </div>
  );
};

export default Lounge;
