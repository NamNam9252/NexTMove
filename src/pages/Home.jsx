import React from "react";
import Sidebar from "@/components/Sidebar";
import FeaturedGame from "@/components/FeaturedGame";
import GameList from "@/components/GameList";
import FriendsPanel from "@/components/FriendsPanel";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#181A20]">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-start p-8 gap-8 overflow-y-auto">
        {/* Search bar */}
        <div className="w-full max-w-2xl mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-3 rounded-xl bg-[#23262F] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <FeaturedGame />
        <GameList />
      </main>
      <FriendsPanel />
    </div>
  );
}