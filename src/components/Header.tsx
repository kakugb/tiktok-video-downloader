"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { languages } from "@/utils/data";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;

  const changeLanguage = (lng: string) => {
    router.push(router.pathname, router.asPath, { locale: lng });
    setIsDropdownOpen(false);
    setIsMobileDropdownOpen(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md text-gray-600">
      <nav className="flex justify-around items-center max-w-full mx-auto px-4 py-4 h-[90px]">
        {/* Logo */}
        <Link href="/" locale="en">
          <Image
            src="/tikologo.jpg"
            alt="Logo"
            width={220}
            height={220}
            priority
            className="cursor-pointer"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-12 items-center font-medium">
          <Link
            href="/"
            className="hover:text-gray-700 transition duration-300"
          >
            {t("general.saveTiktokVideo")}
          </Link>
          <Link
            href="/mp3"
            className="hover:text-gray-700 transition duration-300"
          >
            {t("general.tiktokMp3")}
          </Link>

          {/* Language Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center hover:text-gray-600 transition duration-300">
              {languages.find((lang) => lang.code === locale)?.flag && (
                <img
                  src={languages.find((lang) => lang.code === locale)?.flag}
                  alt={locale}
                  className="w-5 h-3 mr-2"
                />
              )}
              Languages{" "}
              <ChevronDown
                className={`ml-1 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                size={18}
              />
            </button>

            {hasMounted && (
              <div
                className={clsx(
                  "absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-xl overflow-hidden transition-all duration-300",
                  isDropdownOpen
                    ? "max-h-[600px] opacity-100 p-2"
                    : "max-h-0 opacity-0 p-0"
                )}
              >
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <div
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="flex items-center text-gray-800 hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer transition"
                    >
                      <img
                        src={lang.flag}
                        alt={lang.name}
                        className="w-5 h-3 mr-2"
                      />
                      <span>{lang.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden text-gray-800">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span
              className={`block transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "rotate-90 scale-110" : ""
              }`}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg p-4 space-y-3 animate-slide-down text-gray-800">
          <Link href="/" className="block hover:text-blue-600">
            {t("general.saveTiktokVideo")}
          </Link>
          <Link href="/mp3" className="block hover:text-blue-600">
            {t("general.tiktokMp3")}
          </Link>

          {/* Language Dropdown */}
          <div className="pt-2 border-t">
            <div
              className="flex gap-x-3 cursor-pointer"
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
            >
              {languages.find((lang) => lang.code === locale)?.flag && (
                <img
                  src={languages.find((lang) => lang.code === locale)?.flag}
                  alt={locale}
                  className="w-5 h-3 mr-2 my-auto"
                />
              )}
              Languages{" "}
              <ChevronDown
                className={`transition-transform duration-300 ${
                  isMobileDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                size={18}
              />
            </div>

            {hasMounted && (
              <div
                className={clsx(
                  "grid grid-cols-2 gap-2 transition-all duration-300 overflow-hidden",
                  isMobileDropdownOpen ? "max-h-[600px] mt-2" : "max-h-0"
                )}
              >
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="flex items-center hover:bg-gray-100 rounded-md px-2 py-1 transition cursor-pointer"
                  >
                    <img
                      src={lang.flag}
                      alt={lang.name}
                      className="w-5 h-3 mr-2"
                    />
                    <span>{lang.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
