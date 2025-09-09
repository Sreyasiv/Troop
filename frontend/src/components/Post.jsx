// Post.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import DOMPurify from "dompurify";
import { ThumbsUp, X } from "lucide-react";

/**
 * Ensures there's a root element for portals and returns it.
 * Creates <div id="__post_lightbox_root"> under document.body if missing.
 */
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

/**
 * Detect ancestors that can "trap" fixed-positioned elements.
 * Logs a clear console warning listing the first few problematic ancestors.
 */
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

/**
 * Portal-based tailwind + inline style lightbox.
 * Inline styles used for maxWidth/maxHeight so they can't be overridden by layout CSS.
 */
function LightboxPortal({ src, alt = "Image", onClose }) {
  const root = getOrCreateLightboxRoot();

  useLayoutEffect(() => {
    // Detect problematic ancestors of the root where Post might be mounted
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

  // Inline sizing override (very important): ensures we use viewport for sizing.
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

  // Use calc viewport sizes so image never overflows and is never cropped
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

  // Render portal
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

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  // Defensive: log if portal root missing when opening
  useEffect(() => {
    if (lightboxUrl && !document.getElementById("__post_lightbox_root")) {
      console.info("Creating lightbox root in document.body");
    }
  }, [lightboxUrl]);

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
          {formattedDate && (
            <p className="text-xs sm:text-sm text-gray-400">{formattedDate}</p>
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
        <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
      </div>

      {/* Media previews */}
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
                  // keep preview height limited so feed stays tidy. Increase if needed.
                  style={{ maxHeight: 520 }}
                />
              </div>
            )
          )}
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
