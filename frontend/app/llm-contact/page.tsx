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
import StoryEvent, { initialStoryMessage } from "@/components/story/templeEvent";
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
  
      // If the prompt includes "offer coins", execute a blockchain transaction
      if (data.prompt.toLowerCase().includes("offer coins")) {
        console.log("Trigger phrase detected. Executing Symbol transaction...");
  
        /* 
        // ETH contract execution code 
        const contractData = {
          recipient: "0x4DCf63CcD612bf1afC6E216EAFc20DDaf5071d40", // Recipient address
          amount: "0.01", // Amount of ETH to send
        };
  
        try {
          const contractResponse = await axios.post("http://localhost:3001/api/trigger-contract", contractData);
  
          if (contractResponse.status === 200) {
            console.log("Contract executed successfully:", contractResponse.data);
            const contractMessage: Message = {
              role: "system",
              content: `🎉 Contract executed successfully! TX Hash: ${contractResponse.data.txHash}`,
            };
            setMessages([...newMessages, contractMessage]);
          } else {
            console.error("Contract execution failed:", contractResponse);
            toast({
              variant: "destructive",
              title: "Contract execution failed",
              description: "Transaction failed.",
            });
          }
        } catch (contractError) {
          console.error("Error executing contract:", contractError);
          toast({
            variant: "destructive",
            title: "Contract execution error",
            description: "An error occurred.",
          });
        }
        */
  
        // Symbol transaction execution code
        const symbolData = {
          recipient: "TAPQ5YHDDMOXIZW7L4AAPBURJ57G6WVX5IJDPNQ", // Recipient's Symbol address
          mosaicAmount: "100000000", // Amount of mosaic to send (adjust as needed)
          message: "Offering coins via Symbol transaction", // Optional message
        };
  
        try {
          const symbolResponse = await axios.post("http://localhost:3001/api/trigger-transaction", symbolData);
  
          if (symbolResponse.status === 200) {
            console.log("Symbol transaction executed successfully:", symbolResponse.data);
            const symbolMessage: Message = {
              role: "system",
              content: `🎉 Symbol transaction executed successfully! TX Hash: ${symbolResponse.data.transactionHash}`,
            };
            setMessages([...newMessages, symbolMessage]);
          } else {
            console.error("Symbol transaction execution failed:", symbolResponse);
            toast({
              variant: "destructive",
              title: "Symbol transaction execution failed",
              description: "Transaction failed.",
            });
          }
        } catch (symbolError) {
          console.error("Error executing Symbol transaction:", symbolError);
          toast({
            variant: "destructive",
            title: "Symbol transaction execution error",
            description: "An error occurred.",
          });
        }
        
        form.reset();
        return;
      }
  
      // Normal chat processing
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
          title: "Failed to get message",
          description: "Please check the content.",
        });
      }
  
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to get message",
        description: "Please check the content.",
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
