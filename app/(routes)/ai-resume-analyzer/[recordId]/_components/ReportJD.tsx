import React from "react";

interface CVJDAnalysisContentType {
  overall_score: number;
  overall_feedback: string;
  summary_comment: string;
  fit_score: number;
  verdict: string;
  matching_points: string[];
  missing_skills: string[];
  missing_experience: string[];
  recommendations: string[];
  sections: {
    contact_info: {
      score: number;
      comment: string;
      tips_for_improvement: string[];
      whats_good: string[];
      needs_improvement: string[];
    };
    experience: {
      score: number;
      comment: string;
      tips_for_improvement: string[];
      whats_good: string[];
      needs_improvement: string[];
    };
    education: {
      score: number;
      comment: string;
      tips_for_improvement: string[];
      whats_good: string[];
      needs_improvement: string[];
    };
    skills: {
      score: number;
      comment: string;
      tips_for_improvement: string[];
      whats_good: string[];
      needs_improvement: string[];
    };
  };
}

const CVJDAnalysisComponent = ({
  content,
}: {
  content: CVJDAnalysisContentType | null;
}) => {
  // Helper function to filter out empty strings
  const filterEmptyStrings = (arr: string[]): string[] => {
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

  // Helper function to get verdict color and icon
  const getVerdictStyle = (verdict: string) => {
    const verdictLower = verdict.toLowerCase();
    if (verdictLower.includes("excellent") || verdictLower.includes("high")) {
      return {
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "🎯",
      };
    }
    if (verdictLower.includes("good") || verdictLower.includes("strong")) {
      return {
        color: "text-green-500",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "✅",
      };
    }
    if (verdictLower.includes("moderate")) {
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        icon: "⚡",
      };
    }
    if (verdictLower.includes("low") || verdictLower.includes("weak")) {
      return {
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "⚠️",
      };
    }
    return {
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "❌",
    };
  };

  // Loading state when content is null
  if (!content) {
    return (
      <div className="col-span-2 overflow-y-auto border-r h-full bg-gray-50">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CV vs JD Analysis Results
            </h2>
          </div>

          {/* Loading skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded mb-3 w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const verdictStyle = getVerdictStyle(content.verdict);
  const sections = [
    { key: "contact_info", title: "Contact Info", icon: "fas fa-user-circle" },
    { key: "experience", title: "Experience", icon: "fas fa-briefcase" },
    { key: "education", title: "Education", icon: "fas fa-graduation-cap" },
    { key: "skills", title: "Skills", icon: "fas fa-lightbulb" },
  ];

  return (
    <div className="col-span-2 overflow-y-auto border-r h-full bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          CV vs JD Analysis Results
        </h2>
      </div>

      {/* Overall Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Overall Score */}
        <div
          className={`bg-white rounded-xl shadow-lg p-6 border-2 ${getBorderColor(
            content.overall_score
          )}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-700 flex items-center">
              <span className="text-2xl mr-3">📊</span>
              Overall Score
            </h3>
            <span
              className={`text-4xl font-black ${getScoreColor(
                content.overall_score
              )}`}
            >
              {content.overall_score}%
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
            {content.overall_feedback}
          </p>
        </div>

        {/* Fit Score & Verdict */}
        <div
          className={`bg-white rounded-xl shadow-lg p-6 border-2 ${verdictStyle.border}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-700 flex items-center">
              <span className="text-2xl mr-3">{verdictStyle.icon}</span>
              Job Fit Assessment
            </h3>
            <span
              className={`text-4xl font-black ${getScoreColor(
                content.fit_score
              )}`}
            >
              {content.fit_score}%
            </span>
          </div>
          <div
            className={`${verdictStyle.bg} p-4 rounded-lg border ${verdictStyle.border}`}
          >
            <p className={`font-semibold ${verdictStyle.color} mb-2`}>
              Verdict: {content.verdict}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {content.summary_comment}
            </p>
          </div>
        </div>
      </div>

      {/* Matching Points */}
      {filterEmptyStrings(content.matching_points).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-green-200">
          <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center">
            <span className="text-2xl mr-3">✅</span>
            Matching Points
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filterEmptyStrings(content.matching_points).map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400"
              >
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills & Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Missing Skills */}
        {filterEmptyStrings(content.missing_skills).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">🔧</span>
              Missing Skills
            </h3>
            <ul className="space-y-3">
              {filterEmptyStrings(content.missing_skills).map(
                (skill, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 text-sm leading-relaxed">
                      {skill}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Missing Experience */}
        {filterEmptyStrings(content.missing_experience).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">💼</span>
              Missing Experience
            </h3>
            <ul className="space-y-3">
              {filterEmptyStrings(content.missing_experience).map(
                (exp, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 text-sm leading-relaxed">
                      {exp}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {filterEmptyStrings(content.recommendations).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center">
            <span className="text-2xl mr-3">💡</span>
            Recommendations
          </h3>
          <div className="space-y-4">
            {filterEmptyStrings(content.recommendations).map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400"
              >
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                  {index + 1}
                </span>
                <p className="text-gray-700 text-sm leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Analysis */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center">
          <span className="text-2xl mr-3">📋</span>
          Detailed Section Analysis
        </h3>
        <div className="flex flex-col gap-6">
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
                  <h4 className="text-xl font-bold text-gray-700 flex items-center">
                    <i className={`${icon} text-gray-500 mr-3 text-lg`}></i>
                    {title}
                  </h4>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-3xl font-black ${getScoreColor(
                        section.score
                      )}`}
                    >
                      {section.score}%
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <div
                        className={`w-6 h-6 rounded-full ${getProgressBarColor(
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
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-8 text-center">
        <h3 className="text-3xl font-bold mb-4">
          Ready to improve your CV match? 🎯
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Optimize your resume to better match job requirements and increase
          your chances of landing the perfect role.
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-full shadow-lg text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 hover:scale-105"
        >
          Get Premium Analysis
          <i className="fas fa-arrow-right ml-3 text-blue-600"></i>
        </button>
      </div>
    </div>
  );
};

export default CVJDAnalysisComponent;
