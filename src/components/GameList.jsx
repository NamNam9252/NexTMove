import React from "react";

const games = [
  {
    title: "SPIDER-MAN 2",
    image: "https://static-cdn.jtvnw.net/ttv-boxart/509658-285x380.jpg",
    price: "$69.00",
  },
  {
    title: "MORTAL KOMBAT",
    image: "https://static-cdn.jtvnw.net/ttv-boxart/32982-285x380.jpg",
    price: "$67.99",
  },
  {
    title: "FORTNITE",
    image: "https://static-cdn.jtvnw.net/ttv-boxart/33214-285x380.jpg",
    price: "$54.00",
  },
];

export default function GameList() {
  return (
    <section className="w-full max-w-2xl">
      <h3 className="text-white text-lg font-bold mb-4">Actual games</h3>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {games.map((game) => (
          <div key={game.title} className="bg-[#23262F] rounded-xl p-3 min-w-[180px] shadow-md flex flex-col items-center">
            <img src={game.image} alt={game.title} className="rounded-lg w-32 h-40 object-cover mb-2" />
            <div className="text-white font-semibold text-center">{game.title}</div>
            <div className="text-pink-400 font-bold mt-1">{game.price}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 