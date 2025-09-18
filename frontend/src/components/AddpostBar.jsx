
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef();
  const [savedRange, setSavedRange] = useState(null);

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
    if (cmd === "createLink") {

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        setSavedRange(selection.getRangeAt(0));
      }
      setShowLinkInput(true);
      setTimeout(() => linkInputRef.current?.focus(), 100);
    } else {
      document.execCommand(cmd, false, null);
      editorRef.current?.focus();
    }
  };


  const enhanceLinksInEditor = () => {
    if (editorRef.current) {
      const links = editorRef.current.querySelectorAll("a");
      links.forEach(link => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        link.classList.add("troop-link-style");
      });
    }
  };

  const handleAddLink = () => {
    if (linkUrl && savedRange) {
  
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
      document.execCommand("createLink", false, linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`);
    
      if (editorRef.current) {
        const links = editorRef.current.querySelectorAll("a");
        if (links.length > 0) {
          const anchor = links[links.length - 1];
          anchor.setAttribute("target", "_blank");
          anchor.setAttribute("rel", "noopener noreferrer");
          anchor.classList.add("troop-link-style");
        }
      }
    }
    setShowLinkInput(false);
    setLinkUrl("");
    setSavedRange(null);
    editorRef.current?.focus();
  };
  const handleCancelLink = () => {
    setShowLinkInput(false);
    setLinkUrl("");
    editorRef.current?.focus();
  };

  const getEditorHtml = () => {
    return editorRef.current?.innerHTML || "";
  };


  const submitMultipart = async (token, html) => {
    const fd = new FormData();

    if (files.length > 0) {
      files.forEach((file) => fd.append("media", file));
    }

    fd.append("contentHtml", html);
    fd.append("community", community);

    const plain = html.replace(/<[^>]*>?/gm, "").trim();
    if (plain.length) {
      fd.append("summary", plain.slice(0, 160));
    }


    try {
      for (const pair of fd.entries()) {

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

  const submitJson = async (token, html) => {
    const clean = DOMPurify.sanitize(html || "");

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
          {/* Blurred overlay */}
          <div
            className="fixed inset-0 z-40 backdrop-blur-md bg-black/10 transition-all duration-300"
            onClick={closeComposer}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-[#232222] rounded-3xl w-full max-w-lg sm:max-w-xl md:max-w-2xl shadow-xl overflow-hidden border border-[#FFA541]/40" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)'}}>
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[#383535] bg-[#181818]">
                <h3 className="text-lg sm:text-xl font-bold text-white">Create Post</h3>
                <div className="flex items-center gap-2">
                  {/* Custom Dropdown for Community */}
                  <div className="relative" tabIndex={0}>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-2 bg-[#232222] border border-[#FFA541]/40 text-white rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[#FFA541] transition-all min-w-[110px] hover:border-[#FFA541]"
                    >
                      {community.charAt(0).toUpperCase() + community.slice(1).replace(/-/g, ' ')}
                      <svg className="w-4 h-4 text-[#FFA541]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {dropdownOpen && (
                      <ul className="absolute top-full left-0 z-50 w-full bg-[#232222] border border-[#FFA541]/40 rounded-b-lg shadow-lg mt-1 animate-fadeIn">
                        {["lounge", "learn", "market-explore", "club-buzz"].map((c) => (
                          <li
                            key={c}
                            onClick={() => { setCommunity(c); setDropdownOpen(false); }}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#FFA541]/20 hover:text-[#FFA541] transition-colors ${community === c ? 'bg-[#FFA541]/10 text-[#FFA541]' : 'text-white'}`}
                          >
                            {c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, ' ')}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Attach */}
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
                    className="px-3 py-1 rounded-lg bg-[#232222] border border-[#FFA541]/40 text-[#FFA541] text-sm font-semibold hover:bg-[#FFA541]/10 hover:text-[#FFA541] hover:border-[#FFA541] transition-colors"
                  >
                    Attach
                  </button>
                  <button
                    onClick={closeComposer}
                    className="px-3 py-1 text-gray-400 hover:text-[#FFA541] text-lg font-bold rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="px-4 py-4 sm:px-6 sm:py-6 bg-[#232222]">
                <div className="mb-3 flex gap-2 flex-wrap relative">
                  {/* Formatting toolbar */}
                  <button
                    type="button"
                    title="Bold"
                    onClick={() => exec("bold")}
                    className="w-8 h-8 flex items-center justify-center border border-[#FFA541]/40 rounded bg-[#232222] text-white hover:bg-[#FFA541]/20 hover:text-[#FFA541] transition-colors"
                  >
                    <span className="font-bold">B</span>
                  </button>
                  <button
                    type="button"
                    title="Italic"
                    onClick={() => exec("italic")}
                    className="w-8 h-8 flex items-center justify-center border border-[#FFA541]/40 rounded bg-[#232222] text-white italic hover:bg-[#FFA541]/20 hover:text-[#FFA541] transition-colors"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    title="Underline"
                    onClick={() => exec("underline")}
                    className="w-8 h-8 flex items-center justify-center border border-[#FFA541]/40 rounded bg-[#232222] text-white underline hover:bg-[#FFA541]/20 hover:text-[#FFA541] transition-colors"
                  >
                    U
                  </button>
                  <button
                    type="button"
                    title="Add Link"
                    onClick={() => exec("createLink")}
                    className="w-8 h-8 flex items-center justify-center border border-[#FFA541]/40 rounded bg-[#232222] text-white hover:bg-[#FFA541]/20 hover:text-[#FFA541] transition-colors"
                  >
                    {/* Chain link icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656l-3.656 3.656a4 4 0 01-5.656-5.656l3.656-3.656a4 4 0 015.656 0" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 010-5.656l3.656-3.656a4 4 0 015.656 5.656l-3.656 3.656a4 4 0 01-5.656 0" />
                    </svg>
                  </button>
                  {/* Link input popup */}
                  {showLinkInput && (
                    <div className="absolute left-0 top-10 z-20 flex items-center gap-2 bg-[#181818] border border-[#FFA541]/40 rounded-lg shadow-lg px-3 py-2 mt-1" style={{minWidth:'220px'}}>
                      <input
                        ref={linkInputRef}
                        type="text"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="Enter link URL"
                        className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                      />
                      <button
                        onClick={handleAddLink}
                        className="px-2 py-1 rounded bg-[#FFA541] text-[#232222] font-bold text-xs hover:bg-[#ffd699] transition-colors"
                      >
                        Add Link
                      </button>
                      <button
                        onClick={handleCancelLink}
                        className="px-2 py-1 rounded bg-[#232222] text-white text-xs border border-[#FFA541]/40 hover:bg-[#FFA541]/20 hover:text-[#FFA541] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-[100px] sm:min-h-[120px] p-3 border border-[#383535] rounded-lg bg-[#181818] text-white prose max-h-60 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-[#FFA541] transition-all text-sm sm:text-base"
                  style={{fontSize: '1rem'}}
                  onInput={enhanceLinksInEditor}
                  onPaste={e => { setTimeout(enhanceLinksInEditor, 0); }}
                  onClick={e => {
                    // If a link is clicked, open in new tab
                    const target = e.target;
                    if (target.tagName === 'A' && target.href) {
                      window.open(target.href, '_blank', 'noopener,noreferrer');
                      e.preventDefault();
                    }
                  }}
                />
                {/* Custom link styles for editor */}
                <style>{`
                  .troop-link-style {
                    color: #FFA541;
                    text-decoration: underline;
                    cursor: pointer;
                    transition: color 0.2s;
                  }
                  .troop-link-style:hover {
                    color: #ffd699;
                    background: #23222233;
                    text-decoration: underline;
                  }
                `}</style>
                {files.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto p-2">
                    {files.map((f, i) => (
                      <div key={i} className="text-xs text-gray-200 bg-[#232222] p-2 rounded-lg border border-[#FFA541]/40">
                        {f.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-[#383535] bg-[#181818] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-gray-400 mb-2 sm:mb-0">
                  {files.length > 0
                    ? `${files.length} file(s) attached`
                    : community === "learn"
                      ? "You can attach PDF / DOC / DOCX or images"
                      : "You can add images or videos"}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={closeComposer}
                    className="px-4 py-2 rounded-lg bg-[#232222] text-white border border-[#FFA541]/40 hover:bg-[#FFA541]/10 hover:text-[#FFA541] hover:border-[#FFA541] transition-colors w-1/2 sm:w-auto"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-[#FFA541] text-[#232222] font-bold border border-[#FFA541] hover:bg-[#232222] hover:text-[#FFA541] transition-colors w-1/2 sm:w-auto disabled:opacity-50"
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
