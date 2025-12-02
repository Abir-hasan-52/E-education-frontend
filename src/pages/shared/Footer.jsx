import React from "react";
import { FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              SkillSpace
            </h2>
            <p className="mt-3 text-sm text-base-content/70">
              Learn. Build. Grow.  
              Upgrade your skills with structured learning.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a className="link link-hover">About Us</a></li>
              <li><a className="link link-hover">Contact</a></li>
              <li><a className="link link-hover">Careers</a></li>
              <li><a className="link link-hover">Blog</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a className="link link-hover">Courses</a></li>
              <li><a className="link link-hover">Success Stories</a></li>
              <li><a className="link link-hover">FAQ</a></li>
              <li><a className="link link-hover">Support</a></li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h3 className="font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-4 mt-1">

              <a
                href="#"
                className="text-xl opacity-70 hover:opacity-100 transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="text-xl opacity-70 hover:opacity-100 transition"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                className="text-xl opacity-70 hover:opacity-100 transition"
              >
                <FaGithub />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className=" mt-10 pt-5 text-center text-sm text-base-content/70">
          © {new Date().getFullYear()} SkillSpace — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
