"use client"


const Footer = () => {
  return (
    <footer className="bg-slate-900  text-slate-400 py-8 border-t border-slate-800 text-center text-xs mt-20">
      <p>
        © {new Date().getFullYear()} Busuanga Island Electric Cooperative Inc.
        (BISELCO). All Rights Reserved.
      </p>
      <p className="mt-1 text-slate-600">
        Regulated under the National Electrification Administration (NEA)
      </p>
    </footer>
  );
};

export default Footer;
