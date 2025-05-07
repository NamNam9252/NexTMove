import React from "react";

const friends = [
  { name: "CrimsonTiger67", status: "Join", game: "Resident Evil 4" },
  { name: "st3alth_sniper", status: "Playing", game: "Fortnite" },
  { name: "IceDragon", status: "Playing", game: "ROBLOX" },
  { name: "Blitzkrieg66", status: "Join", game: "EA Sports FC 24" },
  { name: "phoenix_rising", status: "Playing", game: "Rocket League" },
  { name: "neonNova", status: "Playing", game: "GTA V" },
];

const recentlyPlayed = [
  { title: "Hitman World of Assassination", progress: 72 },
  { title: "Forza Horizon 5", progress: 47 },
  { title: "The Witcher 3 Wild Hunt", progress: 12 },
  { title: "NBA 2K24", progress: 96 },
];

export default function FriendsPanel() {
  return (
    <aside className="w-80 min-h-screen bg-gradient-to-b from-[#23262F] to-[#181A20] text-white p-6 flex flex-col gap-8">
      {/* User Profile */}
      <div className="flex items-center gap-4 mb-4">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-12 h-12 rounded-full border-2 border-pink-500" />
        <div>
          <div className="font-bold">QuantumSpectre55</div>
          <div className="text-xs text-gray-400">quantums@gmail.com</div>
        </div>
      </div>
      {/* Friends Online */}
      <div>
        <div className="font-semibold mb-2">Friends online</div>
        <ul className="flex flex-col gap-2">
          {friends.map((f) => (
            <li key={f.name} className="flex items-center gap-3">
              <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${f.name}`} alt={f.name} className="w-8 h-8 rounded-full" />
              <div>
                <div className="font-medium text-sm">{f.name}</div>
                <div className="text-xs text-gray-400">{f.status} <span className="text-pink-400">{f.game}</span></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Recently Played */}
      <div>
        <div className="font-semibold mb-2">Recently played</div>
        <ul className="flex flex-col gap-3">
          {recentlyPlayed.map((g) => (
            <li key={g.title}>
              <div className="flex justify-between text-xs mb-1">
                <span>{g.title}</span>
                <span className="text-pink-400 font-bold">{g.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${g.progress}%` }}></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
} 