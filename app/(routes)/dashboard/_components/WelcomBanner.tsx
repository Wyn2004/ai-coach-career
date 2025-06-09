import { Button } from "@/components/ui/button";
import React from "react";

const WelcomBanner = () => {
  return (
    <div className="p-5 bg-gradient-to-r from-[#BE575F] via-[#A338E3] to-[#AC76D6] rounded-lg">
      <h2 className="font-bold text-2xl text-white"> AI Carrer Coach Agent</h2>
      <p className="text-white">
        Smarter carrer decistions start here - get tailored advice real-time
        market insights, and a roadmap built just for you with the power of AI
        market in
      </p>
      <Button variant={"outline"} className="mt-3">
        Get Started
      </Button>
    </div>
  );
};

export default WelcomBanner;
