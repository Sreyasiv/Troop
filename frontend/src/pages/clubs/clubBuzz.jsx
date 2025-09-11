// src/pages/clubs/ClubBuzz.jsx
import React, { useEffect, useState, useCallback } from "react";
import NavBar from "../../components/NavBar";
import ClubNavBar from "./clubNavbar";
import AddpostBar from "../../components/AddpostBar";
import Post from "../../components/Post";
import clubs from "../../assets/clubs.jpeg";

export default function ClubBuzz() {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const community = "club-buzz";

  const handleSearch = (text) => setSearchText(text.toLowerCase());

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/posts`;
      const res = await fetch(`${base}?community=${encodeURIComponent(community)}`);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to fetch posts: ${res.status} ${txt}`);
      }
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : data.posts ?? []);
    } catch (err) {
      console.error("Error fetching club-buzz posts:", err);
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

  const filtered = posts.filter((p) =>
    (p.contentHtml ?? p.content ?? "")
      .toString()
      .toLowerCase()
      .includes(searchText || "") ||
    (p.community ?? "").toLowerCase().includes(searchText || "")
  );

  return (
    <>
      <NavBar />

      <div className="bg-[#1a1a1a] min-h-screen flex flex-col items-center py-6 px-4 sm:px-6 md:px-12 gap-6">
        {/* Top Banner (same as Clubs) */}
        <div className="w-full max-w-[2050px] lg:h-[420px] rounded-[12px] shadow-xl overflow-hidden">
          <img
            src={clubs}
            alt="Club Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Club specific navbar (tabs) */}
        <ClubNavBar />

        {/* Add post bar */}
        <div className="w-full max-w-[1284px]">
          <AddpostBar defaultCommunity={community} onPostCreated={handlePostCreated} />
        </div>

        {/* Posts List */}
        <div className="w-full max-w-[1284px] flex flex-col gap-6">
          <h2 className="text-white text-xl font-semibold mb-2">Club Buzz</h2>

          {loading ? (
            <div className="text-gray-300">Loading posts...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-300">No posts yet — be the first to post!</div>
          ) : (
            filtered.map((p) => {
              const user = p.user || {};
              return (
                <Post
                  key={p._id || p.id}
                  username={user.username || p.username || "Unknown"}
                  course={user.course || p.course || ""}
                  profilePic={user.profilePic || p.profilePic || "https://i.pravatar.cc/150"}
                  hashtags={p.hashtags || []}
                  contentHtml={p.contentHtml ?? p.content}
                  media={p.media ?? p.mediaUrls ?? p.files ?? []}
                  attachments={p.attachments ?? []}
                  community={p.community || community}
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
