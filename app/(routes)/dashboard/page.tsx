import React from "react";
import WelcomBanner from "./_components/WelcomBanner";
import AiTools from "./_components/AiTools";
import History from "./_components/History";

function Dashboard() {
  return (
    <div>
      <WelcomBanner />
      <AiTools />
      <History />
    </div>
  );
}

export default Dashboard;
