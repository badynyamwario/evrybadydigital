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
    <main className="min-h-screen bg-[#0a1e0a] text-white">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">

        {/* Hero */}
        <section className="flex min-h-[50vh] items-center py-24 lg:py-32">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-[#f7e7a6]">News & insights</p>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Articles</h1>
          </div>
        </section>

        {/* Articles list */}
        <section className="pb-24 lg:pb-32 space-y-8">
          {sortedArticles.map((article) => (
            <article key={article.id} className="p-8 rounded-2xl bg-[#08140d] border border-white/10 shadow-xl shadow-[#00000030]">
              <h2 className="text-2xl font-semibold text-[#f7e7a6]">{article.title}</h2>
              <div className="text-sm text-white/50 mt-2">{article.date}</div>
              <p className="mt-4 text-white/80 leading-7">{article.content}</p>
              <div className="flex items-center gap-4 mt-5">
                <span className="flex items-center gap-1 cursor-pointer select-none">
                  👍 <span>{article.reactions.like}</span>
                </span>
                <span className="flex items-center gap-1 cursor-pointer select-none">
                  ❤️ <span>{article.reactions.love}</span>
                </span>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-white">Comments</h3>
                <ul className="mt-3 space-y-2">
                  {article.comments.length === 0 && <li className="text-white/40">No comments yet.</li>}
                  {article.comments.map((c, i) => (
                    <li key={i} className="text-white/70"><b className="text-white/90">{c.user}:</b> {c.text}</li>
                  ))}
                </ul>
                <form className="flex gap-3 mt-4">
                  <input type="text" placeholder="Add a comment..." className="flex-1 border border-white/10 bg-[#0a1e0a] rounded-xl px-4 py-3 text-white" disabled />
                  <button type="submit" className="bg-[#f7e7a6] text-[#0a1e0a] px-6 py-3 rounded-xl text-sm font-semibold" disabled>Post</button>
                </form>
                <div className="text-xs text-white/40 mt-2">(Demo: Comments/reactions not interactive)</div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
