import React, { Suspense } from "react";
import OverallScoreCard from "./OverallScoreCard";
import ReportRoleDecriptionComponent from "./ReportRoleDecriptionComponent";

const AnalyzerRole = ({ data }: { data: any }) => {
  return (
    <div>
      <h1 className="font-bold text-2xl"> Description role</h1>
      <h2>{data[0]?.decriptionRole}</h2>
      <div className="grid lg:grid-cols-5 grid-cols-1 mt-5">
        {/* report */}
        <div className="col-span-2">
          <Suspense fallback={<div>Loading...</div>}>
            <OverallScoreCard content={data.content} />
          </Suspense>
        </div>

        {/* cv preview */}
        <div className="col-span-3 mt-5">
          <h2 className="font-bold text-2xl">Resume Preview</h2>
          <iframe
            src={data.cvFileUrl + "#toolbar=0&navpanes=0&scrollbars=0"}
            width="100%"
            height={1200}
            className="min-w-lg mt-3"
            style={{ border: "none" }}
          />
        </div>
      </div>
      <div className="mt-10">
        <Suspense fallback={<div>Loading...</div>}>
          <ReportRoleDecriptionComponent content={data.content} />
        </Suspense>
      </div>
    </div>
  );
};

export default AnalyzerRole;
