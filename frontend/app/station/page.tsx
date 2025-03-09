// app/page.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChatCompletionRequestMessage } from "openai";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import ChatMessages from "@/components/chat/ChatMessages";
import ChatForm from "@/components/chat/ChatForm";
import ChatScroll from "@/components/chat/ChatScroll";
import CharacterSelect, { Characters, CharacterType } from "@/components/chat/CharacterSelect";
import StoryEvent, { initialStoryMessage } from "@/components/story/stationEvent";
import Live2DComponent from "@/components/Live2D/pixi1";
import Navbar from "@/components/header/navbar";

import * as z from "zod";
import axios from "axios";

// Optional audio flag from env variables
const useAudio = process.env.NEXT_PUBLIC_USE_AUDIO === "true";

// Form validation schema
const FormSchema = z.object({
  prompt: z.string().min(2, { message: "2文字以上入力する必要があります。" }),
});
export type FormValues = z.infer<typeof FormSchema>;

// Extend Message type with an optional event property
export type Message = ChatCompletionRequestMessage & {
  event?: {
    embedPage?: {
      type: "iframe" | "component";
      url?: string;
      componentId?: string;
    };
  };
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([initialStoryMessage]);
  const [input, setInput] = useState("");
  const [showStory, setShowStory] = useState(false);
  const [character, setCharacter] = useState<CharacterType>(Characters[0]);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    defaultValues: { prompt: "" },
    resolver: zodResolver(FormSchema),
  });
  const loading = form.formState.isSubmitting;

  const playAudio = async (text: string, speaker: string) => {
    if (!useAudio) return;
    try {
      const response = await axios.post("/api/audio", { text, speaker });
      const base64Audio = response?.data?.response;
      const byteArray = Buffer.from(base64Audio, "base64");
      const audioBlob = new Blob([byteArray], { type: "audio/x-wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.volume = 1;
      audio.play();
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const userMessage: Message = { role: "user", content: data.prompt };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      // Check if the prompt contains the trigger phrase "snap photo"
      if (data.prompt.toLowerCase().includes("snap photo")) {
        console.log("Trigger phrase detected.");
        setShowStory(true);
        // Optionally, you could also append a narrative response here.
      } else {
        // Otherwise, send conversation to API as usual.
        const response = await axios.post("/api/chat", {
          messages: newMessages,
          character: character.value,
        });
        if (response.status === 200) {
          const updatedMessages = [...newMessages, response.data];
          setMessages(updatedMessages);
          if (useAudio) {
            const latestContent =
              typeof response.data.content === "string"
                ? response.data.content
                : data.prompt;
            await playAudio(latestContent, character.value);
          }
        } else {
          toast({
            variant: "destructive",
            title: "メッセージの取得に失敗しました",
            description: "内容をご確認ください",
          });
        }
      }
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "メッセージの取得に失敗しました",
        description: "内容をご確認ください",
      });
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Navbar />

      {/* Live2D Model */}
      <div className="flex justify-center mb-0">
        <Live2DComponent />
      </div> 

      {/* Chat messages */}
      <div className="mt-[-10rem]">
        <ChatMessages messages={messages} loading={loading} />
      </div>

      {/* Auto-scroll */}
      <ChatScroll messages={messages} />

      {/* Story Event Component */}
      {showStory && <StoryEvent />}

      {/* Chat input form */}
      <div className="pb-4 inset-x-0 max-w-screen-md px-5 mx-auto bg-white">
        <ChatForm form={form} onSubmit={onSubmit} loading={loading} />
      </div>
    </div>
  );
}


