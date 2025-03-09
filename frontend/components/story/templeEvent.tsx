// components/story/templeEvent.tsx
import React from "react";
import { ChatCompletionRequestMessage } from "openai";

// Explicitly type the initial message so that role is recognized as a literal "system"
export const initialStoryMessage: ChatCompletionRequestMessage = {
  role: "system",
  content: "Welcome to the conversation game! Type 'offer coins' to trigger the event.",
};

export default function StoryEvent() {
  return (
    <div className="mt-4 border p-4">
      <h2 className="text-xl font-bold mb-2">Story Event</h2>
      <p>
        神社に到着しました。ボタンを押すと、お賽銭箱に賽銭を入れることができます。
      </p>
      <p>
        ボタンを押すと、あなたの願いが神様に届くかのような不思議な感覚を覚えます。この恋愛が実りますように。
      </p>
      <a
        href="/sendToken"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        詳細を見る
      </a>
    </div>
  );
}

