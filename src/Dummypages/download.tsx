import { FaTimesCircle } from 'react-icons/fa';
import Image from 'next/image';

const VideoPopup = ({
  showPopup,
  metadata,
  closePopup,
  resolution,
  setResolution,
  loading,
  loadingWithWatermark,
  loadingNoWatermark,
  handleDownloadVideo,
  videoSize,
  formatFileSize,
  error,
  t
}) => {
  return (
    {showPopup && metadata && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-85 flex items-center justify-center z-50 p-6 transition-opacity duration-600 ease-in-out">
        <div className="bg-white rounded-3xl p-8 max-w-3xl w-full mx-auto shadow-2xl relative overflow-hidden">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-50 to-blue-50 opacity-40 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                {t("heroSection.popup.title")}
              </h3>
              <button
                onClick={closePopup}
                className="text-gray-600 transition-colors duration-200"
                aria-label="Close popup"
              >
                <FaTimesCircle size={28} />
              </button>
            </div>

            {/* Thumbnail */}
            {metadata.formats?.thumbnail ? (
              <div className="relative w-full h-64 mb-6 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={metadata.formats.thumbnail}
                  alt="Video Thumbnail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1024px"
                  priority
                />
              </div>
            ) : (
              <p className="text-red-600 mb-6 text-center font-medium animate-pulse">
                {t("heroSection.errors.noThumbnailFound")}
              </p>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl shadow-inner">
              <p className="text-gray-700 text-sm">
                <strong className="font-semibold text-gray-900">
                  {t("heroSection.metadata.title")}:
                </strong>{" "}
                {metadata.title}
              </p>
              <p className="text-gray-700 text-sm">
                <strong className="font-semibold text-gray-900">
                  {t("heroSection.metadata.author")}:
                </strong>{" "}
                {metadata.author}
              </p>
              <p className="text-gray-700 text-sm">
                <strong className="font-semibold text-gray-900">
                  {t("heroSection.popup.duration")}:
                </strong>{" "}
                {metadata.formats?.duration || "Unknown"} seconds
              </p>
              <p className="text-gray-700 text-sm">
                <strong className="font-semibold text-gray-900">
                  {t("heroSection.popup.size")}:
                </strong>{" "}
                {videoSize ? formatFileSize(videoSize) : "Calculating..."}
              </p>
            </div>

            {/* Resolution Selector */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-gray-900">
                {t("heroSection.metadata.selectResolution")}:
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
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

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <button
                onClick={() => handleDownloadVideo(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center transition-all duration-200 shadow-md"
                disabled={loadingWithWatermark || loadingNoWatermark}
              >
                {loadingWithWatermark ? (
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : null}
                {t("heroSection.metadata.downloadVideo")}
              </button>
              <button
                onClick={() => handleDownloadVideo(false)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center transition-all duration-200 shadow-md"
                disabled={loadingWithWatermark || loadingNoWatermark}
              >
                {loadingNoWatermark ? (
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : null}
                {t("heroSection.popup.downloadNoWatermark")}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 mt-6 text-center font-medium animate-pulse">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    )}
  );
};

export default VideoPopup;