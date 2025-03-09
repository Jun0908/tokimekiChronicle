// components/story/templeEvent.tsx
import React from "react";
import { ChatCompletionRequestMessage } from "openai";

// Explicitly type the initial message so that role is recognized as a literal "system"
export const initialStoryMessage: ChatCompletionRequestMessage = {
  role: "system",
  content: "Welcome to the conversation game! Type 'snap photo' to trigger the event.",
};

export default function StoryEvent() {
  return (
    <div className="mt-4 border p-4">
      <h2 className="text-xl font-bold mb-2">Station Date Photo Event</h2>
      <p>
        駅の待合室で、主人公はデート中の女の子と心温まる時間を過ごしています。
      </p>
      <p>
        二人は、駅という日常の風景の中で、特別な思い出を写真に収めることに決めました。笑顔溢れるその瞬間を、カメラがそっと切り取ります。
      </p>
      <a
        href="/photo"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        詳細を見る
      </a>
    </div>
  );
}
