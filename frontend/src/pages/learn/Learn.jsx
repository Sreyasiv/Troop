// src/pages/learn/Learn.jsx
import React, { useEffect, useState, useCallback } from "react";
import NavBar from "../../components/NavBar";
import Post from "../../components/Post";
import AddpostBar from "../../components/AddpostBar";
import eventBanner from "../../assets/learn.jpeg";

export default function Learn() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const community = "learn";

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/posts`;
      const url = `${base}?community=${community}`;
      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch posts: ${res.status} ${text}`);
      }
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching learn posts:", err);
      setError(err.message || "Failed to fetch posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [community]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = async () => {
    await fetchPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <NavBar />

      <div className="bg-[#1a1a1a] min-h-screen flex flex-col items-center py-6 px-4 sm:px-6 md:px-12 gap-6">
        {/* Banner Image */}
        <div className="w-full max-w-[2050px] h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] rounded-2xl shadow-xl overflow-hidden">
          <img
            src={eventBanner}
            alt="Learn Banner"
            className="w-full h-full object-cover"
          />
        </div>


        <AddpostBar onPostCreated={handlePostCreated} defaultCommunity="learn" />

        {/* Posts List */}
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
                  contentHtml={p.contentHtml ?? p.content}
                  media={p.media ?? []}
                  attachments={p.attachments ?? []}
                  community={p.community || "learn"}
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
