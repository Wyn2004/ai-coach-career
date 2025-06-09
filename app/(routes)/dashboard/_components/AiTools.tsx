import { aiToolsList } from "@/constants/ai-tools-list";
import React from "react";
import AiToolCard from "./AiToolCard";

const AiTools = () => {
  return (
    <div className="mt-7 p-5 bg-white rounded-xl border flex flex-col gap-2">
      <h2 className="text-lg font-bold">Available AI Tools</h2>
      <p className="text-gray-500">
        Start Building and Shape Your Career with this exclusive AI Tools
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {aiToolsList.map((tool, index) => (
          <AiToolCard key={index} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default AiTools;
