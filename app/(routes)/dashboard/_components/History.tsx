"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";

const History = () => {
  const [userhistory, setUserHistory] = useState([]);

  return (
    <div className="mt-5 p-3 border rounded-xl ">
      <h2 className="text-lg font-bold">Previous History</h2>
      <p className="text-gray-500">
        What Your previously work on, You can find here
      </p>

      {userhistory?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <Image src={"/idea.png"} alt="idea" width={70} height={70} />
          <h2 className="text-lg font-bold">No History Found</h2>
          <p className="text-gray-500">
            You can start working on your career by using the tools above
          </p>
          <Button>Explore AI Tools</Button>
        </div>
      )}
    </div>
  );
};

export default History;
