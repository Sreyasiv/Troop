// src/pages/lounge/Lounge.jsx
import React, { useEffect, useState, useCallback } from "react";
import Post from "../../components/Post";
import NavBar from "../../components/NavBar";
import AddpostBar from "../../components/AddpostBar";

const carouselImages = [
  "https://img.freepik.com/premium-vector/space-vintage-colorful-horizontal-poster_225004-2209.jpg",
  "https://img.freepik.com/premium-vector/vintage-space-travel-horizontal-poster_225004-2206.jpg",
  "https://img.freepik.com/premium-vector/space-exploration-adventure-vector-retro-poster_8071-45275.jpg",
];

// Configure API host: set VITE_API in frontend .env or fallback to localhost:8000


export default function Lounge() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch posts: ${res.status} ${text}`);
      }
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to fetch posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // refresh when tab regains focus so content stays in sync
  useEffect(() => {
    const onFocus = () => fetchPosts();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchPosts]);

  // carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // When AddpostBar notifies of created post, re-fetch so backend can attach `user`
  const handlePostCreated = async (newPostResult) => {
    // newPostResult may be { message, post } or the post itself
    // We simply re-fetch the feed to guarantee the user object is attached by GET handler
    await fetchPosts();
    // optionally scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center py-6 px-4 sm:px-6 md:px-12 gap-6 bg-[#1a1a1a] min-h-screen">
        {/* Carousel */}
        <div className="w-full max-w-[2050px] h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] relative overflow-hidden rounded-2xl shadow-xl">
          <div className="flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {carouselImages.map((img, i) => (
              <img key={i} src={img} alt={`Slide ${i + 1}`} className="w-full h-full object-cover flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Add Post */}
        <AddpostBar onPostCreated={handlePostCreated} />

        {/* Posts */}
        <div className="flex flex-col gap-6 w-full max-w-[950px]">
          {loading ? (
            <div className="text-center text-gray-300">Loading posts...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-300">No posts yet — be the first to post!</div>
          ) : (
            posts.map((p) => {
              const user = p.user || {};
              return (
                <Post
                    key={p._id || p.id}
                    username={user.username || p.username || "Unknown"}
                    course={user.course || p.course || ""}
                    profilePic={user.profilePic || p.profilePic || "https://i.pravatar.cc/150"}
                    hashtags={p.hashtags || []}
                    contentHtml={p.contentHtml ?? p.content}
                    media={p.media ?? p.images ?? []}
                    content={p.content}
                    createdAt={p.createdAt}   
                    />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
