// src/components/AddpostBar.jsx
import React, { useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import DOMPurify from "dompurify";

export default function AddpostBar({ onPostCreated, defaultCommunity = "lounge" }) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const editorRef = useRef();
  const [community, setCommunity] = useState(defaultCommunity);

  const openComposer = () => {
    if (editorRef.current) editorRef.current.innerHTML = "";
    setFiles([]);
    setCommunity(defaultCommunity);
    setOpen(true);
  };

  const closeComposer = () => {
    if (loading) return;
    setOpen(false);
  };

  const MAX_FILES = 5;

  const onFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const capped = selected.slice(0, MAX_FILES);

    if (community === "learn") {
      const allowedDocMimes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      const filtered = capped.filter(
        (f) => allowedDocMimes.includes(f.type) || f.type.startsWith("image/")
      );
      if (filtered.length !== capped.length) {
        alert("Learn accepts only PDF / DOC / DOCX and images. Unsupported files were removed.");
      }
      setFiles(filtered);
    } else {
      const filtered = capped.filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
      if (filtered.length !== capped.length) {
        alert("Only images/videos allowed for this community. Unsupported files were removed.");
      }
      setFiles(filtered);
    }
  };

  const exec = (cmd) => {
    document.execCommand(cmd, false, null);
    editorRef.current?.focus();
  };

  const getEditorHtml = () => {
    return editorRef.current?.innerHTML || "";
  };

  // upload multipart to /api/posts/add (protected)
  const submitMultipart = async (token, html) => {
    const fd = new FormData();

    // append files under "media" (backend supports reading files and community)
    if (files.length > 0) {
      files.forEach((file) => fd.append("media", file));
    }

    fd.append("contentHtml", html);
    fd.append("community", community);

    const plain = html.replace(/<[^>]*>?/gm, "").trim();
    if (plain.length) {
      fd.append("summary", plain.slice(0, 160));
    }

    // DEBUG: log FormData entries so you can see exactly what's being sent
    try {
      for (const pair of fd.entries()) {
        // For files, pair[1] will be a File object; log its name for clarity
        if (pair[1] && pair[1].name) {
          console.log("FormData entry:", pair[0], pair[1].name);
        } else {
          console.log("FormData entry:", pair[0], pair[1]);
        }
      }
    } catch (e) {
      console.warn("Could not iterate FormData entries for logging:", e);
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/posts/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Failed to create post (multipart) — ${res.status} ${txt}`);
    }
    return res.json();
  };

  // submit JSON content to /api/posts (protected)
  const submitJson = async (token, html) => {
    const clean = DOMPurify.sanitize(html || "");

    // DEBUG: log JSON payload that will be sent
    console.log("JSON payload for /api/posts:", { contentHtmlPreview: clean.replace(/<[^>]*>?/gm, "").slice(0, 120), community });

    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contentHtml: clean, community }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Failed to create post (json) — ${res.status} ${txt}`);
    }
    return res.json();
  };

  const handleSubmit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("Sign in to post");
        return;
      }
      const token = await user.getIdToken();
      setLoading(true);

      const rawHtml = getEditorHtml();
      const sanitized = DOMPurify.sanitize(rawHtml || "");

      // client-side sanity: ensure at least content or attachments
      const hasContent = sanitized && sanitized.replace(/<[^>]*>?/gm, "").trim().length > 0;
      const hasFiles = files.length > 0;
      if (!hasContent && !hasFiles) {
        alert("Please add some content or attach files before posting.");
        setLoading(false);
        return;
      }

      // DEBUG: log what we're about to submit client-side
      console.log("Submitting post:", {
        community,
        filesCount: files.length,
        filesNames: files.map((f) => f.name),
        sanitizedPreview: sanitized.replace(/<[^>]*>?/gm, "").slice(0, 120),
      });

      let result;
      if (hasFiles) {
        result = await submitMultipart(token, sanitized);
      } else {
        result = await submitJson(token, sanitized);
      }

      onPostCreated?.(result);
      setLoading(false);
      setOpen(false);
      if (editorRef.current) editorRef.current.innerHTML = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFiles([]);
      setCommunity(defaultCommunity);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to post");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Compact bar */}
      <div className="flex justify-center my-4 px-4 sm:px-0">
        <div
          onClick={openComposer}
          className="bg-white rounded-full flex items-center px-4 py-2 w-full max-w-[2050px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <input
            type="text"
            placeholder="Add a new post / Review / Update"
            className="text-[#ff8800] placeholder-black-300 w-full sm:w-[500px] md:w-[650px] lg:w-[800px] xl:w-[950px] flex-1 pointer-events-none text-sm sm:text-base bg-transparent outline-none"
            readOnly
          />
          <button>
            <span className="text-orange-400 text-xl">&#9654;</span>
          </button>
        </div>
      </div>

      {/* Modal overlay */}
      {open && (
        <div>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeComposer}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Create Post</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="lounge">Lounge</option>
                    <option value="learn">Learn</option>
                    <option value="market-explore">Market-Explore</option>
                    <option value="club-buzz">Club-Buzz</option>
                  </select>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={
                      community === "learn"
                        ? ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                        : "image/*,video/*"
                    }
                    multiple
                    onChange={onFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded bg-gray-100 border"
                  >
                    Attach
                  </button>
                  <button
                    onClick={closeComposer}
                    className="px-3 py-1 text-gray-600 hover:text-gray-900"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-2 flex gap-2">
                  <button onClick={() => exec("bold")} className="px-2 py-1 border rounded font-bold">B</button>
                  <button onClick={() => exec("italic")} className="px-2 py-1 border rounded italic">I</button>
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-[120px] p-3 border rounded bg-white text-black prose"
                />
                {files.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto p-2">
                    {files.map((f, i) => (
                      <div key={i} className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                        {f.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {files.length > 0
                    ? `${files.length} file(s) attached`
                    : community === "learn"
                      ? "You can attach PDF / DOC / DOCX or images"
                      : "You can add images or videos"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={closeComposer}
                    className="px-4 py-2 rounded bg-gray-100"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 rounded bg-orange-500 text-white disabled:opacity-50"
                  >
                    {loading ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
