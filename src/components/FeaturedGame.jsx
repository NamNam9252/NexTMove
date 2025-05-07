import React from "react";

export default function FeaturedGame() {
  return (
    <section className="bg-[#23262F] rounded-2xl p-6 mb-8 shadow-lg w-full max-w-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 mb-2">
          {['Magic', 'Fantasy', 'Open World', 'Adventure'].map(tag => (
            <span key={tag} className="bg-[#353945] text-xs px-2 py-1 rounded-full text-white">{tag}</span>
          ))}
        </div>
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Hogwarts Legacy" className="rounded-xl w-full h-48 object-cover" />
        <div className="mt-2">
          <h2 className="text-xl font-bold text-white">Hogwarts Legacy</h2>
          <p className="text-gray-300 text-sm mb-4">Hogwarts Legacy is an immersive, open-world action RPG set in the world first introduced in the Harry Potter books.</p>
          <button className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2 rounded-full font-semibold">Buy now <span className="line-through text-xs ml-2 text-white/60">$35.99</span> <span className="ml-1">$24.00</span></button>
        </div>
      </div>
    </section>
  );
} 