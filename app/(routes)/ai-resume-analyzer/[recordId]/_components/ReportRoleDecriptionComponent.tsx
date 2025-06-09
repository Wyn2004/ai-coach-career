import React from "react";

interface ContentType {
  sections: {
    contact_info: {
      score: number;
      comment: string;
      tips_for_improvement: string[] | [""];
      whats_good: string[] | [""];
      needs_improvement: string[] | [""];
    };
    experience: {
      score: number;
      comment: string;
      tips_for_improvement: string[] | [""];
      whats_good: string[] | [""];
      needs_improvement: string[] | [""];
    };
    education: {
      score: number;
      comment: string;
      tips_for_improvement: string[] | [""];
      whats_good: string[] | [""];
      needs_improvement: string[] | [""];
    };
    skills: {
      score: number;
      comment: string;
      tips_for_improvement: string[] | [""];
      whats_good: string[] | [""];
      needs_improvement: string[] | [""];
    };
  };
  tips_for_improvement: string[] | [""];
  whats_good: string[] | [""];
  needs_improvement: string[] | [""];
}

const ReportRoleDecriptionComponent = ({
  content,
}: {
  content: ContentType | null;
}) => {
  // Helper function to filter out empty strings
  const filterEmptyStrings = (arr: string[] | [""]): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item) => item && item.trim() !== "");
  };

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  // Helper function to get border color
  const getBorderColor = (score: number) => {
    if (score >= 90) return "border-green-600";
    if (score >= 80) return "border-green-500";
    if (score >= 70) return "border-yellow-500";
    if (score >= 60) return "border-orange-500";
    return "border-red-500";
  };

  // Helper function to get progress bar color
  const getProgressBarColor = (score: number) => {
    if (score >= 90) return "bg-green-600";
    if (score >= 80) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  // Helper function to get feedback emoji
  const getFeedbackEmoji = (feedback: string) => {
    const feedbackLower = feedback.toLowerCase();
    if (feedbackLower.includes("excellent") || feedbackLower.includes("great"))
      return "🌟";
    if (feedbackLower.includes("good")) return "👍";
    if (feedbackLower.includes("fair")) return "⚡";
    return "💪";
  };

  // Loading state when content is null
  if (!content) {
    return (
      <div className="col-span-2 overflow-y-auto border-r h-full bg-gray-50">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Analysis Results
            </h2>
          </div>

          {/* Loading skeleton */}
          <div className="space-y-6">
            {/* Sections Skeleton */}
            <div className="flex flex-col gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
                >
                  {/* Section Header Skeleton */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 bg-gray-200 rounded w-16"></div>
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>

                  {/* Analysis Section Skeleton */}
                  <div className="mb-6">
                    <div className="h-6 bg-gray-200 rounded mb-3 w-1/4"></div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>

                  {/* Details Grid Skeleton */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="h-5 bg-orange-200 rounded mb-3 w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-orange-200 rounded"></div>
                        <div className="h-3 bg-orange-200 rounded w-4/5"></div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="h-5 bg-green-200 rounded mb-3 w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-green-200 rounded"></div>
                        <div className="h-3 bg-green-200 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="h-5 bg-red-200 rounded mb-3 w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-red-200 rounded"></div>
                        <div className="h-3 bg-red-200 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sections = [
    { key: "contact_info", title: "Contact Info", icon: "fas fa-user-circle" },
    { key: "experience", title: "Experience", icon: "fas fa-briefcase" },
    { key: "education", title: "Education", icon: "fas fa-graduation-cap" },
    { key: "skills", title: "Skills", icon: "fas fa-lightbulb" },
  ];

  return (
    <div className="col-span-2 overflow-y-auto border-r h-full bg-gray-50">
      {/* Sections Grid */}
      <div className="flex flex-col gap-6 mb-8">
        {sections.map(({ key, title, icon }) => {
          const section =
            content.sections[key as keyof typeof content.sections];
          return (
            <div
              key={key}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 relative overflow-hidden group hover:shadow-xl transition-all duration-300 ${getBorderColor(
                section.score
              )}`}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold text-gray-700 flex items-center">
                  <i className={`${icon} text-gray-500 mr-3 text-xl`}></i>
                  {title}
                </h4>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-4xl font-black ${getScoreColor(
                      section.score
                    )}`}
                  >
                    {section.score}%
                  </span>
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <div
                      className={`w-8 h-8 rounded-full ${getProgressBarColor(
                        section.score
                      )} opacity-30`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Section Comment */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="text-lg mr-2">💬</span>
                  Analysis
                </h5>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {section.comment}
                </p>
              </div>

              {/* Section Details Grid */}
              <div className="flex flex-col gap-4">
                {/* Tips for Improvement */}
                {filterEmptyStrings(section.tips_for_improvement).length >
                  0 && (
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
                    <h6 className="text-md font-bold text-orange-700 mb-3 flex items-center">
                      <span className="text-md mr-2">💡</span>
                      Tips to Improve
                    </h6>
                    <ul className="space-y-2">
                      {filterEmptyStrings(section.tips_for_improvement).map(
                        (tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-orange-800 text-xs leading-relaxed">
                              {tip}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* What's Good */}
                {filterEmptyStrings(section.whats_good).length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                    <h6 className="text-md font-bold text-green-700 mb-3 flex items-center">
                      <span className="text-md mr-2">✅</span>
                      What's Good
                    </h6>
                    <ul className="space-y-2">
                      {filterEmptyStrings(section.whats_good).map(
                        (item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                            <span className="text-green-800 text-xs leading-relaxed">
                              {item}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Needs Improvement */}
                {filterEmptyStrings(section.needs_improvement).length > 0 && (
                  <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                    <h6 className="text-md font-bold text-red-700 mb-3 flex items-center">
                      <span className="text-md mr-2">⚠️</span>
                      Needs Work
                    </h6>
                    <ul className="space-y-2">
                      {filterEmptyStrings(section.needs_improvement).map(
                        (item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                            <span className="text-red-800 text-xs leading-relaxed">
                              {item}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom border animation */}
              <div
                className={`absolute inset-x-0 bottom-0 h-1 ${getProgressBarColor(
                  section.score
                )} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Tips for Improvement */}
      {filterEmptyStrings(content.tips_for_improvement).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center">
            <span className="text-2xl mr-3">💡</span>
            Tips for Improvement
          </h3>
          <div className="space-y-4">
            {filterEmptyStrings(content.tips_for_improvement).map(
              (tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400"
                >
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* What's Good vs Needs Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filterEmptyStrings(content.whats_good).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">✅</span>
              What's Good
            </h3>
            <ul className="space-y-3">
              {filterEmptyStrings(content.whats_good).map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600 text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {filterEmptyStrings(content.needs_improvement).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              Needs Improvement
            </h3>
            <ul className="space-y-3">
              {filterEmptyStrings(content.needs_improvement).map(
                (item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-8 text-center">
        <h3 className="text-3xl font-bold mb-4">
          Ready to refine your resume? 💪
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Make your application stand out with our premium insights and
          features.
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-full shadow-lg text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 hover:scale-105"
        >
          Upgrade to Premium
          <i className="fas fa-arrow-right ml-3 text-blue-600"></i>
        </button>
      </div>
    </div>
  );
};

export default ReportRoleDecriptionComponent;
