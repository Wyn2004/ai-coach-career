import React from "react";

interface ContentType {
  overall_score: number | "";
  fit_score: number | "";
  overall_feedback: string | "";
  summary_comment: string | "";
}

const OverallScoreCard = ({ content }: { content: ContentType }) => {
  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          AI Analysis Results
        </h2>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 h-10 px-6 py-2"
          type="button"
        >
          Re-analyze{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-sparkles"
          >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
          </svg>
        </button>
      </div>
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 mb-8 border border-purple-200 transform hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-1 ">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            Overall Score
          </h3>
          <div className="flex items-center justify-between mb-6">
            <span className="text-7xl font-black text-white">
              {content.overall_score}
              <span className="text-3xl opacity-80">/100</span>
            </span>
          </div>

          <div className="w-full bg-white/20 rounded-full h-4 mb-6">
            <div
              className="bg-white h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${content.overall_score}%` }}
            ></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            Fit Overall Score
          </h3>
          <div className="flex items-center justify-between mb-6">
            <span className="text-7xl font-black text-white">
              {content.fit_score}
              <span className="text-3xl opacity-80">/100</span>
            </span>
          </div>

          <div className="w-full bg-white/20 rounded-full h-4 mb-6">
            <div
              className="bg-white h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${content.fit_score}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-white/90 font-bold text-xl">Summary:</h2>
        <p className="text-white/90 text-base leading-relaxed">
          {content.summary_comment}
        </p>

        <h2 className="text-white/90 font-bold text-xl">Overall Feedback:</h2>
        <p className="text-white/90 text-base leading-relaxed">
          {content.overall_feedback}
        </p>
      </div>
    </div>
  );
};

export default OverallScoreCard;
