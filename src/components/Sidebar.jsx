import React from "react";

export default function Sidebar() {
  return (
    <aside className="bg-gradient-to-b from-[#181A20] to-[#23262F] text-white w-64 min-h-screen flex flex-col justify-between p-6">
      <div>
        <div className="flex items-center gap-2 mb-10">
          <span className="bg-pink-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">~</span>
          <span className="font-extrabold text-lg">NexT<span className="text-pink-500">Move</span></span>
        </div>
        <nav className="flex flex-col gap-4">
          <a className="flex items-center gap-3 text-pink-500 font-semibold" href="#">🏠 Home</a>
          <a className="flex items-center gap-3" href="#">📂 Category</a>
          <a className="flex items-center gap-3" href="#">📚 Library</a>
          <a className="flex items-center gap-3" href="#">👥 Community</a>
          <a className="flex items-center gap-3" href="#">🤝 Friends <span className="ml-auto bg-pink-500 text-xs rounded-full px-2">2</span></a>
          <a className="flex items-center gap-3" href="#">💖 Wishlist</a>
          <a className="flex items-center gap-3" href="#">⬇️ Downloads</a>
        </nav>
        <div className="mt-8 bg-gradient-to-r from-pink-500 to-orange-400 rounded-xl p-4 text-white text-sm">
          <div className="font-bold text-lg mb-1">50% discount</div>
          <div className="mb-2">on the games in the selection</div>
          <button className="bg-white text-pink-600 rounded px-3 py-1 font-semibold">Go to library</button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <a className="flex items-center gap-3" href="#">⚙️ Settings</a>
        <a className="flex items-center gap-3" href="#">❓ Help</a>
      </div>
    </aside>
  );
} 