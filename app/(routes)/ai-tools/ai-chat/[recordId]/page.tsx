"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import EmptyState from "../_components/EmptyState";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
type Message = {
  role: "user" | "assistant";
  content: string;
  type: "text" | "image";
};

const AiChat = () => {
  const { recordId } = useParams();
  const router = useRouter();

  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const onSend = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setMessages([
      ...messages,
      { role: "user", content: userInput, type: "text" },
    ]);
    setUserInput("");
    const response = await fetch(`/api/ai-coach-chat`, {
      method: "POST",
      body: JSON.stringify({ userInput, messages }),
    });
    const data = await response.json();
    setMessages((prev) => [...prev, data]);
    setLoading(false);
  };

  const getMessages = async () => {
    const result = await fetch(`/api/history?recordId=${recordId}`);
    const data = await result.json();
    setMessages(data[0]?.content);
  };

  const onUpdateMessage = async () => {
    await fetch("/api/history", {
      method: "PUT",
      body: JSON.stringify({ recordId, content: messages }),
    });
  };

  const onNewChat = async () => {
    const recordId = uuidv4();
    await fetch("/api/history", {
      method: "POST",
      body: JSON.stringify({ recordId: recordId, content: [] }),
    });
    router.replace(`/ai-tools/ai-chat/${recordId}`);
  };

  useEffect(() => {
    messages?.length > 0 && onUpdateMessage();
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    recordId && getMessages();
  }, [recordId]);

  return (
    <div className="px-10 md:px-24 lg:px-36 xl:px-48">
      <div className="flex justify-between items-center gap-8">
        <div>
          <h2 className="text-lg font-bold">AI Career Q/A Chat</h2>
          <p className="text-gray-500">
            Smarter career decisions start here — get tailored advice, real-time
            market insights
          </p>
        </div>
        <Button onClick={onNewChat}>+ New Chat</Button>
      </div>

      <div className="flex flex-col h-[70vh]">
        <div className="mt-5">
          {messages?.length === 0 && <EmptyState setUserInput={setUserInput} />}
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto flex-1 p-5">
          {messages?.length > 0 &&
            messages.map((item, index) => (
              <div key={index}>
                <div ref={messagesEndRef} />
                <div
                  className={`flex gap-2 ${
                    item.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg text-black ${
                      item.role === "user" ? "bg-gray-200 " : "bg-gray-50"
                    }`}
                  >
                    <ReactMarkdown>{item.content}</ReactMarkdown>
                  </div>
                </div>
                {loading && messages?.length - 1 === index && (
                  <div className="flex gap-2 items-center justify-start bg-gray-50 p-3 rounded-lg mt-4">
                    <Loader className="animate-spin" />
                    <p>Thinking...</p>
                  </div>
                )}
              </div>
            ))}
        </div>

        <div className="flex justify-between items-center gap-6 ">
          {/* Chat input */}
          <Input
            placeholder="Type your question here..."
            value={userInput}
            onChange={(even) => {
              setUserInput(even.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSend();
              }
            }}
          />
          <Button onClick={onSend} disabled={loading}>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
