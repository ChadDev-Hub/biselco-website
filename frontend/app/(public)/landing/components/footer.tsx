"use client";

import Link from "next/link";
import CopyRight from "@/app/common/copyright";
const Footer = () => {
  return (
    <footer className="footer  px-10 pt-4 md:px-40 bg-neutral text-neutral-content rounded-t-3xl">
      <div className="grid  grid-cols-1 md:grid-cols-4 gap-8 w-full">
        <div>
          <div className="text-2xl font-black mb-4">
            BUSUANGA <span className="text-primary">ISLAND</span>
          </div>
          <p>
            Electric Cooperative Inc.
            <br />
            Providing reliable power since 1979
          </p>
        </div>
        {/* ABOOUT */}
        <div>
          <h6 className="footer-title font-bold">About Us</h6>
          <Link href="/about" className="link link-hover link-primary">
              About BISELCO
            </Link>
        </div>

        {/* CONTACT */}
        <div>
          {/* PHONE */}
          <div>
            <h6 className="footer-title font-bold">Contact Us</h6>
            <h4 className="text-blue-600">
              <span>📞</span> Serbisyo Hotline{" "}
              <span className="text-yellow-300">24/7</span>{" "}
            </h4>
            <ul role="list" className="list-disc list-inside">
              <li className="list-item indent-5">09176511859</li>
              <li className="list-item indent-5">09176396436</li>
              <li className="list-item indent-5">09107101909</li>
            </ul>
          </div>
          {/* EMAIL */}
          <div>
            <h6>
              <span>📧</span> Email
            </h6>
            <ul className="list-disc list-inside">
              <li className="list-item indent-5">
                <Link href="mailto:biselco79@yahoo.com" className="link link-hover link-primary">biselco79@yahoo.com</Link>
              </li>
            </ul>
          </div>
          {/* SOCIAL MEDIA */}
          <div>
            <h6>
              <span>📸</span>Social Media
            </h6>
            <ul className="list-disc list-inside">
              <li className="list-item indent-5">
                <Link
                  className="link link-hover link-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/biselco.coronpalawan/"
                >
                  <span>ⓕ</span> BISELCO EC
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* DEVELOPER */}

          <div>
            <h6 className="footer-title font-bold">Developer</h6>
            <label>Richard F. Rojo Jr.</label>
          </div>
      </div>

      <div className="w-full  place-items-center text-slate-400 py-8 border-t border-slate-800 text-center text-xs">
        <CopyRight />
      </div>
    </footer>
  );
};

export default Footer;
