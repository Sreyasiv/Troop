
import React, { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import DOMPurify from "dompurify";
import { ThumbsUp, X } from "lucide-react";


function getOrCreateLightboxRoot() {
  if (typeof document === "undefined") return null;
  let root = document.getElementById("__post_lightbox_root");
  if (!root) {
    root = document.createElement("div");
    root.id = "__post_lightbox_root";
    document.body.appendChild(root);
  }
  return root;
}


function detectTrappingAncestors(el) {
  if (!el) return null;
  const bad = [];
  let node = el.parentElement;
  while (node && node !== document.body) {
    const s = getComputedStyle(node);
    if (
      s.transform !== "none" ||
      s.filter !== "none" ||
      s.perspective !== "none" ||
      s.willChange !== "auto" ||
      s.overflow !== "visible"
    ) {
      bad.push({
        node,
        tag: node.tagName,
        classes: node.className,
        transform: s.transform,
        overflow: s.overflow,
        filter: s.filter,
        perspective: s.perspective,
        willChange: s.willChange,
      });
    }
    node = node.parentElement;
    if (bad.length >= 5) break;
  }
  return bad;
}


function LightboxPortal({ src, alt = "Image", onClose }) {
  const root = getOrCreateLightboxRoot();

  useLayoutEffect(() => {
    
    const problematic = detectTrappingAncestors(document.querySelector("#root") || document.body);
    if (problematic && problematic.length > 0) {
      console.warn(
        "Lightbox WARNING: possible layout styles that trap fixed elements detected on ancestor(s). " +
          "These can cause clipping. Inspect the following ancestors and remove `transform`, `filter`, or `perspective` (or move modal to body):",
        problematic.slice(0, 5)
      );
    }
  }, []);

  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!root) return null;
  const containerStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.85)",
    padding: "32px",
  };

  const wrapperStyle = {
    position: "relative",
    maxWidth: "calc(100vw - 64px)",
    maxHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const imgStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "auto",
    objectFit: "contain",
    borderRadius: 8,
    boxShadow: "0 10px 40px rgba(0,0,0,0.7)",
    display: "block",
  };


  return createPortal(
    <div
      onClick={onClose}
      style={containerStyle}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <div onClick={(e) => e.stopPropagation()} style={wrapperStyle}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: -16,
            right: -16,
            zIndex: 4,
            borderRadius: "9999px",
            background: "rgba(17,17,17,0.95)",
            padding: 8,
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer",
          }}
        >
          <X style={{ width: 16, height: 16, color: "white" }} />
        </button>

        <img src={src} alt={alt} style={imgStyle} />
      </div>
    </div>,
    root
  );
}

const Post = ({
  username,
  course,
  profilePic,
  content,
  contentHtml,
  hashtags = [],
  images = [],
  media = [],
  attachments = [], 
  createdAt,
}) => {
  const [liked, setLiked] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const toggleHeart = () => setLiked((p) => !p);

  const rawHtml = contentHtml ?? content ?? "";
  const cleanHtml = DOMPurify.sanitize(rawHtml);

  const unifiedMedia =
    Array.isArray(media) && media.length > 0
      ? media
      : Array.isArray(images)
      ? images.map((url) => ({ url, type: "image", alt: "" }))
      : [];


  const formattedDateTime = createdAt
    ? new Date(createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";


  const isoTimestamp = createdAt ? new Date(createdAt).toISOString() : "";


  useEffect(() => {
    if (lightboxUrl && !document.getElementById("__post_lightbox_root")) {
      console.info("Creating lightbox root in document.body");
    }
  }, [lightboxUrl]);


  const docMimes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);

  const docAttachments = Array.isArray(attachments)
    ? attachments.filter((a) => a && a.mimeType && docMimes.has(a.mimeType))
    : [];


  React.useEffect(() => {
    const postDiv = document.getElementById('post-content-html');
    if (postDiv) {
      const links = postDiv.querySelectorAll('a');
      links.forEach(link => {
        link.classList.add('troop-link-style');
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        // Remove all previous listeners by replacing the node
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        newLink.addEventListener('click', function(e) {
          e.preventDefault();
          window.open(newLink.href, '_blank', 'noopener,noreferrer');
        }, { once: false });
      });
    }
  }, [cleanHtml]);

  return (
    <div className="bg-zinc-800 w-full max-w-[2050px] rounded-2xl overflow-visible p-4 sm:p-6 text-white shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-3">
          <img
            src={profilePic || "https://i.pravatar.cc/150"}
            alt="Profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-bold uppercase text-sm sm:text-base">
              {username || "Unknown"}
            </p>
            <p className="text-xs sm:text-sm text-gray-300">{course || ""}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {formattedDateTime && (
            <p
              className="text-xs sm:text-sm text-gray-400"
              title={isoTimestamp}
            >
              {formattedDateTime}
            </p>
          )}

          <div className="flex flex-wrap gap-2 justify-end sm:max-w-[200px]">
            {hashtags.map((tag, i) => (
              <span
                key={i}
                className="text-xs sm:text-sm px-2 py-1 rounded-full bg-gray-700 text-blue-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mb-4 text-sm sm:text-base font-medium text-gray-100">
        <div id="post-content-html" dangerouslySetInnerHTML={{ __html: cleanHtml }} />
        {/* Custom link styles for post content */}
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
      </div>

      {unifiedMedia.length > 0 && (
        <div
          className={`grid gap-4 ${
            unifiedMedia.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {unifiedMedia.map((m, i) =>
            m.type === "video" ? (
              <video
                key={i}
                controls
                src={m.url}
                className="w-full rounded-xl"
              />
            ) : (
              <div key={i} className="w-full">
                <img
                  src={m.url}
                  alt={m.alt || `Post image ${i + 1}`}
                  onClick={() => setLightboxUrl(m.url)}
                  className="w-full rounded-xl cursor-pointer object-contain block"
      
                  style={{ maxHeight: 520 }}
                />
              </div>
            )
          )}
        </div>
      )}

      {docAttachments.length > 0 && (
        <div className="mt-4 p-3 bg-gray-900 rounded-md border border-gray-800">
          <p className="text-sm text-gray-300 mb-2 font-semibold">Attachments</p>
          <ul className="flex flex-col gap-2">
            {docAttachments.map((a, idx) => (
              <li key={idx} className="flex items-center justify-between gap-3 bg-gray-800 p-2 rounded">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                  <div className="text-sm text-gray-100">
                    {a.filename || a.url.split("/").pop() || `attachment-${idx + 1}`}
                    <div className="text-xs text-gray-400">{a.mimeType}{a.size ? ` • ${(a.size/1024).toFixed(0)} KB` : ""}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm rounded bg-orange-500 text-white hover:opacity-90"
                  >
                    Open / Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upvote */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={toggleHeart}
          className="flex items-center gap-2 focus:outline-none"
        >
          <ThumbsUp
            className={`w-6 h-6 transition-colors ${
              liked ? "text-orange-500" : "text-gray-400"
            }`}
            fill={liked ? "orange" : "none"}
          />
          <span
            className={`font-medium transition-colors ${
              liked ? "text-orange-500" : "text-gray-400"
            }`}
          >
            Upvote
          </span>
        </button>
      </div>

      {/* Lightbox portal */}
      {lightboxUrl && (
        <LightboxPortal src={lightboxUrl} alt="Full image" onClose={() => setLightboxUrl(null)} />
      )}
    </div>
  );
};

export default Post;
