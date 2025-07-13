"use client";
import React, { useEffect, useState } from "react";
import { ClipboardPaste, Loader2 } from "lucide-react";
import Image from "next/image";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getVideoMetadata, downloadVideo, downloadAudio, VideoMetadata } from "../service/api";

interface Review {
  name: string;
  flag: string;
  stars: string;
  comment: string;
}

const Home: React.FC = () => {
  const { t } = useTranslation("common");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [resolution, setResolution] = useState<"240p" | "360p" | "480p" | "720p" | "1080p" | "mp3">("720p");
  const [loading, setLoading] = useState(false);
  const [loadingWithWatermark, setLoadingWithWatermark] = useState(false);
  const [loadingNoWatermark, setLoadingNoWatermark] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [videoSize, setVideoSize] = useState<number | null>(null);

  const reviews: Review[] = t("userReviewsSection.reviews", { returnObjects: true }) as Review[];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setVideoUrl(text);
      setError("");
    } catch (err) {
      setError(t("heroSection.errors.pasteFailed"));
    }
  };

  const handleGetMetadata = async () => {
    if (!videoUrl) {
      setError(t("heroSection.errors.emptyUrl"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getVideoMetadata(videoUrl);

      // Check if data is ErrorResponse
      if ("message" in data) {
        throw new Error(data.message);
      }

      // At this point, TypeScript knows data is VideoMetadata
      if (!data.formats?.noWatermark) {
        throw new Error(t("heroSection.errors.noVideoFound"));
      }

      setMetadata(data);
      const size = await fetchVideoSize(videoUrl);
      setVideoSize(size);
      setShowPopup(true);
    } catch (err: any) {
      if (err.message.includes("Rate limit exceeded")) {
        setError(t("heroSection.errors.rateLimit"));
      } else {
        setError(err.message || t("heroSection.errors.fetchFailed"));
      }
      setShowPopup(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoSize = async (url: string): Promise<number> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/tiktok/size?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch video size");
      }
      const data = await response.json();
      return data.size || 0;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.warn("Error fetching video size:", errorMessage);
      return 0;
    }
  };

  const handleDownloadVideo = async (watermark: boolean) => {
    if (resolution === "mp3") {
      await handleDownloadAudio();
      return;
    }
    setError("");
    if (watermark) {
      setLoadingWithWatermark(true);
    } else {
      setLoadingNoWatermark(true);
    }
    try {
      const blob = await downloadVideo(videoUrl, resolution as "240p" | "360p" | "480p" | "720p" | "1080p", watermark);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tikosave-video-${resolution}${watermark ? "-watermark" : ""}.mp4`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || t("heroSection.errors.downloadVideoFailed"));
    } finally {
      if (watermark) {
        setLoadingWithWatermark(false);
      } else {
        setLoadingNoWatermark(false);
      }
    }
  };

  const handleDownloadAudio = async () => {
    setLoadingNoWatermark(true);
    setError("");
    try {
      const blob = await downloadAudio(videoUrl);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tikosave-audio.mp3";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || t("heroSection.errors.downloadAudioFailed"));
    } finally {
      setLoadingNoWatermark(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setMetadata(null);
    setVideoSize(null);
    setError("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "Unknown";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <>
      {/* Hero Section */}
      <div className="h-96 flex flex-col items-center justify-center text-center mt-1 py-4 relative bg-teal-400">
        <h2 className="text-3xl font-bold text-white">{t("heroSection.title")}</h2>
        <p className="hidden md:flex text-white text-md mt-2">{t("heroSection.description")}</p>
        <div className="block md:flex mt-4 w-full px-4 md:px-0 max-w-2xl lg:max-w-3xl xl:max-w-5xl transition-all duration-300">
          <div className="flex w-full items-center bg-white px-4 rounded-xl md:rounded-l-xl md:rounded-r-none">
            <input
              type="text"
              placeholder={t("heroSection.inputPlaceholder")}
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full pl-2 outline-none text-black py-5"
              disabled={loading}
            />
            <button
              onClick={handlePaste}
              className="flex items-center space-x-2 my-auto rounded-xl text-black font-semibold transition-all mr-2 hover:text-blue-600 border border-gray-300 hover:border-blue-400 px-4 py-2 shadow-sm hover:shadow-md bg-white"
              disabled={loading}
            >
              <ClipboardPaste size={18} />
              <span>{t("heroSection.pasteButton")}</span>
            </button>
          </div>
          <div className="w-full md:w-auto bg-none md:bg-white flex items-center justify-center p-2 rounded-b-xl md:rounded-r-xl md:rounded-l-none">
            <button
              onClick={handleGetMetadata}
              className="w-full md:w-52 bg-blue-600 py-3 text-white px-6 font-semibold cursor-pointer rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
              disabled={loading || !videoUrl}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  {t("heroSection.loading")}
                </>
              ) : (
                t("heroSection.downloadButton")
              )}
            </button>
          </div>
        </div>
        {error && !showPopup && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Download Card Popup */}
      {showPopup && metadata && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{t("heroSection.popup.title")}</h3>
              <button onClick={closePopup} className="text-gray-500 hover:text-gray-700">
                <FaTimesCircle size={24} />
              </button>
            </div>
            {metadata.formats?.thumbnail ? (
              <Image
                src={metadata.formats.thumbnail}
                alt="Video Thumbnail"
                width={640}
                height={360}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            ) : (
              <p className="text-red-500 mb-4">{t("heroSection.errors.noThumbnailFound")}</p>
            )}
            <div className="space-y-2">
              <p>
                <strong>{t("heroSection.metadata.title")}:</strong> {metadata.title}
              </p>
              <p>
                <strong>{t("heroSection.metadata.author")}:</strong> {metadata.author}
              </p>
              <p>
                <strong>{t("heroSection.popup.duration")}:</strong>{" "}
                {metadata.formats?.duration || "Unknown"} seconds
              </p>
              <p>
                <strong>{t("heroSection.popup.size")}:</strong>{" "}
                {videoSize ? formatFileSize(videoSize) : "Calculating..."}
              </p>
            </div>
            <div className="mt-4">
              <label className="block mb-2 font-semibold">{t("heroSection.metadata.selectResolution")}:</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as "240p" | "360p" | "480p" | "720p" | "1080p" | "mp3")}
                className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-blue-500"
                disabled={loading || loadingWithWatermark || loadingNoWatermark}
              >
                <option value="240p">240p</option>
                <option value="360p">360p</option>
                <option value="480p">480p (SD)</option>
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
                <option value="mp3">MP3</option>
              </select>
            </div>
            <div className="mt-6 flex flex-col space-y-3">
              <button
                onClick={() => handleDownloadVideo(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center transition-all"
                disabled={loadingWithWatermark || loadingNoWatermark}
              >
                {loadingWithWatermark ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                {t("heroSection.metadata.downloadVideo")}
              </button>
              <button
                onClick={() => handleDownloadVideo(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-all"
                disabled={loadingWithWatermark || loadingNoWatermark}
              >
                {loadingNoWatermark ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                {t("heroSection.popup.downloadNoWatermark")}
              </button>
            </div>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
        </div>
      )}

      {/* App Download Section */}
      <div>
        <h1 className="w-full mt-9 text-3xl font-semibold text-center text-gray-700">
          {t("appDownloadSection.title")}
        </h1>
        <p className="text-gray-600 text-center mt-4 font-semibold">{t("appDownloadSection.description")}</p>
        <div className="w-full flex justify-center mt-5">
          <Image src="/playstoreImg.webp" alt="playstore image" width={350} height={350} />
        </div>
      </div>

      {/* Introduction Section */}
      <div className="w-full max-w-7xl bg-gray-50 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="w-full mt-6 text-2xl sm:text-3xl font-semibold text-center text-gray-700 leading-tight">
          {t("introductionSection.title")}
        </h1>
        {(t("introductionSection.paragraphs", { returnObjects: true }) as string[]).map((paragraph, index) => (
          <p key={index} className="mt-4 leading-7 text-gray-600 text-base sm:text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      {/* How to Download Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="w-full mt-4 text-2xl sm:text-3xl font-semibold text-center text-white bg-teal-500 py-3 rounded-md">
          {t("howToDownloadSection.title")}
        </h1>
        <p className="mt-4 leading-7 text-gray-600 text-base sm:text-lg">{t("howToDownloadSection.description")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {(
            t("howToDownloadSection.steps", { returnObjects: true }) as { title: string; description: string; image: string }[]
          ).map((step, index) => (
            <div key={index} className="p-6 rounded-lg shadow-lg flex flex-col items-center">
              <Image src={step.image} alt={`Step ${index + 1} Icon`} width={52} height={52} className="mb-2" />
              <h3 className="text-xl font-bold mt-2 text-gray-700">{step.title}</h3>
              <p className="mt-2 text-center text-gray-600 font-poppins">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Need Downloader Section */}
      <div className="w-full max-w-7xl bg-gray-100 mx-auto px-4 sm:px-6 lg:px-8 py-8 rounded-xl">
        <h1 className="w-full mt-6 text-3xl sm:text-4xl font-bold text-center text-gray-700 leading-tight">
          {t("whyNeedDownloaderSection.title")}
        </h1>
        {(t("whyNeedDownloaderSection.paragraphs", { returnObjects: true }) as string[]).map((paragraph, index) => (
          <p key={index} className="mt-4 leading-7 text-gray-600 text-base sm:text-md text-center">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Download on Android Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="w-full mt-4 text-2xl sm:text-3xl font-semibold text-center text-white bg-teal-500 py-3 rounded-md">
          {t("downloadOnAndroidSection.title")}
        </h1>
        <p className="mt-4 leading-7 text-gray-600 text-base sm:text-lg">{t("downloadOnAndroidSection.description")}</p>
        <ul className="mt-4 sm:mt-6 ml-4 sm:ml-6 leading-8 text-gray-600 text-base sm:text-lg list-disc list-inside">
          {(t("downloadOnAndroidSection.steps", { returnObjects: true }) as string[]).map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>

      {/* Download on PC Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="w-full mt-4 text-2xl sm:text-3xl font-semibold text-center text-white bg-teal-500 py-3 rounded-md">
          {t("downloadOnPCSection.title")}
        </h1>
        <p className="mt-4 leading-7 text-gray-600 text-base sm:text-lg">{t("downloadOnPCSection.description")}</p>
      </div>

      {/* Download on iOS Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="w-full mt-4 text-2xl sm:text-3xl font-semibold text-center text-white bg-teal-500 py-3 rounded-md">
          {t("downloadOnIOSSection.title")}
        </h1>
        {(t("downloadOnIOSSection.paragraphs", { returnObjects: true }) as string[]).map((paragraph, index) => (
          <p key={index} className="mt-3 leading-7 text-gray-600 text-base sm:text-lg">
            {paragraph}
          </p>
        ))}
        <ul className="mt-4 sm:mt-6 ml-4 sm:ml-6 leading-8 text-gray-600 text-base sm:text-lg list-disc list-inside">
          {(t("downloadOnIOSSection.steps", { returnObjects: true }) as string[]).map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>

      {/* Download MP3 Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="w-full mt-4 text-2xl sm:text-3xl font-semibold text-center text-white bg-teal-500 py-3 rounded-md">
          {t("downloadMP3Section.title")}
        </h1>
        {(t("downloadMP3Section.paragraphs", { returnObjects: true }) as string[]).map((paragraph, index) => (
          <p key={index} className="mt-3 leading-7 text-gray-600 text-base sm:text-lg">
            {paragraph}
          </p>
        ))}
        <ul className="mt-4 sm:mt-6 ml-4 sm:ml-6 leading-8 text-gray-600 text-base sm:text-lg list-disc list-inside">
          {(t("downloadMP3Section.steps", { returnObjects: true }) as string[]).map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>

      {/* Pros & Cons Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-4">{t("prosAndConsSection.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold text-green-500 mb-5">{t("prosAndConsSection.pros.title")}</h3>
            <ul className="text-left text-lg mt-2 space-y-4">
              {(t("prosAndConsSection.pros.items", { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index} className="flex items-center">
                  <FaCheckCircle className="text-green-500 text-2xl mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold text-red-500 mb-5">{t("prosAndConsSection.cons.title")}</h3>
            <ul className="text-left text-lg mt-2 space-y-4">
              {(t("prosAndConsSection.cons.items", { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index} className="flex items-center">
                  <FaTimesCircle className="text-red-500 text-2xl mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="w-full mt-4 text-2xl sm:text-3xl font-semibold text-center text-white bg-teal-500 py-3 rounded-md">
          {t("comparisonSection.title")}
        </h1>
        {(t("comparisonSection.paragraphs", { returnObjects: true }) as string[]).map((paragraph, index) => (
          <p key={index} className="mt-4 leading-7 text-gray-600 text-base sm:text-lg">
            {paragraph}
          </p>
        ))}
        <ul className="mt-4 sm:mt-6 ml-4 sm:ml-6 leading-10 text-gray-600 text-base sm:text-lg list-disc list-inside">
          {(t("comparisonSection.benefits", { returnObjects: true }) as string[]).map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>

      {/* User Reviews Section */}
      <div className="w-full md:max-w-7xl mx-auto rounded-md text-black md:px-4 py-8">
        <div className="w-full text-white p-6 text-center rounded-lg shadow-lg">
          <h2 className="text-md md:text-2xl font-bold bg-teal-500 py-6">{t("userReviewsSection.title")}</h2>
          <div className="bg-white text-black p-6 rounded-lg shadow-md shadow-gray-500 transition-transform duration-500 ease-in-out h-36 flex flex-col justify-center items-center">
            <h3 className="font-bold text-lg flex items-center">
              {reviews[currentIndex].name}
              <img src={reviews[currentIndex].flag} alt="flag" className="w-6 h-4 ml-2" />
            </h3>
            <p className="text-yellow-500 text-xl">{reviews[currentIndex].stars}</p>
            <p className="italic text-sm">"{reviews[currentIndex].comment}"</p>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {reviews.map((_, index) => (
              <span
                key={index}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-black" : "bg-gray-400"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Other Content Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="w-full mt-4 text-2xl sm:text-3xl font-bold text-gray-600">{t("otherContentSection.title")}</h1>
        <p className="mt-4 leading-7 text-teal-500 font-bold text-base sm:text-2xl">
          {t("otherContentSection.photoSlideshow.title")}
        </p>
        {(t("otherContentSection.photoSlideshow.paragraphs", { returnObjects: true }) as string[]).map(
          (paragraph, index) => (
            <p key={index} className="mt-2 leading-7 text-gray-600 text-base sm:text-md">
              {paragraph}
            </p>
          )
        )}
        <p className="mt-4 leading-7 text-teal-500 font-bold text-base sm:text-2xl">
          {t("otherContentSection.stories.title")}
        </p>
        {(t("otherContentSection.stories.paragraphs", { returnObjects: true }) as string[]).map((paragraph, index) => (
          <p key={index} className="mt-2 leading-7 text-gray-600 text-base sm:text-md">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Responsible Use Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="w-full mt-4 text-5xl sm:text-3xl font-semibold text-center text-white bg-teal-500 py-3 rounded-md">
          {t("responsibleUseSection.title")}
        </h1>
        {(t("responsibleUseSection.paragraphs", { returnObjects: true }) as string[]).map((paragraph, index) => (
          <p key={index} className="mt-4 leading-7 text-gray-600 text-base sm:text-lg">
            {paragraph}
          </p>
        ))}
        <ul className="mt-4 sm:mt-6 ml-4 sm:ml-6 leading-7 text-gray-600 text-base sm:text-md text-justify">
          {(t("responsibleUseSection.tips", { returnObjects: true }) as { title: string; description: string }[]).map(
            (tip, index) => (
              <li key={index}>
                <h1 className="text-xl font-semibold text-teal-500 my-4">{tip.title}</h1>
                {tip.description}
              </li>
            )
          )}
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-7xl mx-auto px-4 my-10 pb-10 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-600 py-5 rounded-t-lg mb-5">{t("faqSection.title")}</h2>
        <div>
          {(t("faqSection.questions", { returnObjects: true }) as string[]).map((question, index) => (
            <div
              key={index}
              className={`border-b ${openFAQ === index ? "border-purple-700" : "border-gray-300"}`}
            >
              <button
                className={`w-full text-left p-4 flex justify-between items-center transition duration-300 rounded-md 
                  ${openFAQ === index ? "bg-teal-400 text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-600"}`}
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold">{question}</span>
                <span
                  className={`transform transition-transform duration-300 ${
                    openFAQ === index ? "rotate-180 text-white" : "rotate-0 text-gray-600"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-transform duration-500 ease-in-out transform origin-top ${
                  openFAQ === index ? "scale-y-100 p-4 bg-white" : "scale-y-0 h-0"
                }`}
              >
                <p className="text-gray-700 pt-3 pl-4">
                  {(t("faqSection.answers", { returnObjects: true }) as string[])[index]}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-gray-600 text-base sm:text-md bg-gray-200 px-8 py-6 leading-relaxed">
          <b>{t("general.note")}</b> {t("faqSection.note")}
        </p>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Home;