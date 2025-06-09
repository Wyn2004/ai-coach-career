import React from "react";

const questions = [
  "What skills do I need for a data analyst role?",
  "How do I switch careers to UX design?",
];

const EmptyState = ({
  setUserInput,
}: {
  setUserInput: (question: string) => void;
}) => {
  const handleSelectQuestion = (question: string): void => {
    setUserInput(question);
  };

  return (
    <div>
      <h2 className="font-bold text-xl text-center">
        Ask anything to AI career Agent
      </h2>
      <div className="flex flex-col gap-4 mt-5">
        {questions.map((item, index) => (
          <h2
            key={index}
            className="text-center border rounded-lg p-4 hover:border-primary cursor-pointer"
            onClick={() => handleSelectQuestion(item)}
          >
            {item}
          </h2>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
