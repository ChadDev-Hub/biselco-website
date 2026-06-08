import React from "react";

const Header = () => {
  const year = new Date().getFullYear();
  return (
    <header className="text-center z-10 mb-10">
      <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent sm:text-5xl">
        <span>{year} BISELCO AGMA</span>
        <br />
        <span>Giveaway Roulette</span>
      </h1>
      <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-sm mx-auto">
        Spin to WIN exclusive Biselco Rewards🎉.
      </p>
    </header>
  );
};

export default Header;
