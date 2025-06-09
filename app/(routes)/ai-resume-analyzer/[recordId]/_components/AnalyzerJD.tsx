import React, { Suspense } from "react";
import OverallScoreCard from "./OverallScoreCard";
import ReportRoleDecriptionComponent from "./ReportRoleDecriptionComponent";
import ReportJD from "./ReportJD";

const AnalyzerJD = ({ data }: { data: any }) => {
  return (
    <div>
      <div className="grid md:grid-cols-2 grid-cols-1 mt-5 gap-3">
        <div className="mt-5">
          <h2 className="font-bold text-2xl">JD Preview</h2>
          <iframe
            src={data.jdFileUrl + "#toolbar=0&navpanes=0&scrollbars=0"}
            width="100%"
            height={1200}
            className="min-w-lg mt-3"
            style={{ border: "none" }}
          />
        </div>
        <div className="mt-5">
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
      </div>
      {/* report */}
      <div className="col-span-2">
        <Suspense fallback={<div>Loading...</div>}>
          <OverallScoreCard content={data.content} />
        </Suspense>
      </div>
      <div className="mt-10">
        <Suspense fallback={<div>Loading...</div>}>
          <ReportJD content={data.content} />
        </Suspense>
      </div>
    </div>
  );
};

export default AnalyzerJD;
