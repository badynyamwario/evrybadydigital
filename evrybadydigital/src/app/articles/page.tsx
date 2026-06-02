import React from "react";

// Dummy articles data
const articles = [
  {
    id: 1,
    title: "Welcome to Evrybady Digital",
    date: "2026-05-30",
    content: "Discover our latest updates and strategies for your brand.",
    comments: [
      { user: "Jane", text: "Great article!" },
      { user: "John", text: "Very insightful." },
    ],
    reactions: { like: 5, love: 2 },
  },
  {
    id: 2,
    title: "How to Grow Your Brand Online",
    date: "2026-05-28",
    content: "Tips and tricks for digital growth in 2026.",
    comments: [],
    reactions: { like: 2, love: 1 },
  },
];

export default function ArticlesPage() {
  // Sort articles by latest
  const sortedArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-3xl mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold mb-6 text-[#f7e7a6]">Articles</h1>
      {sortedArticles.map((article) => (
        <article key={article.id} className="mb-6 p-5 rounded-xl bg-[#0a1e0a] border border-white/10">
          <h2 className="text-xl font-semibold mb-1.5 text-[#f7e7a6]">{article.title}</h2>
          <div className="text-sm text-white/50 mb-3">{article.date}</div>
          <p className="mb-3 text-white/80">{article.content}</p>
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center gap-1 cursor-pointer select-none">
              👍 <span>{article.reactions.like}</span>
            </span>
            <span className="flex items-center gap-1 cursor-pointer select-none">
              ❤️ <span>{article.reactions.love}</span>
            </span>
          </div>
          <div className="mt-3">
            <h3 className="font-semibold mb-1.5 text-white">Comments</h3>
            <ul className="mb-2">
              {article.comments.length === 0 && <li className="text-white/40">No comments yet.</li>}
              {article.comments.map((c, i) => (
                <li key={i} className="mb-1 text-white/70"><b className="text-white/90">{c.user}:</b> {c.text}</li>
              ))}
            </ul>
            <form className="flex gap-2">
              <input type="text" placeholder="Add a comment..." className="flex-1 border border-white/10 bg-[#08140d] rounded-lg px-3 py-1.5 text-white" disabled />
              <button type="submit" className="bg-[#f7e7a6] text-[#0a1e0a] px-4 py-1.5 rounded-lg text-sm font-semibold" disabled>Post</button>
            </form>
            <div className="text-xs text-white/40 mt-1">(Demo: Comments/reactions not interactive)</div>
          </div>
        </article>
      ))}
    </div>
  );
}
