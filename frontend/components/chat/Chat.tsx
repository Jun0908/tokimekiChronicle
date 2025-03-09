"use client";

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChatCompletionRequestMessage } from "openai"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

import ChatMessages from "@/components/chat/ChatMessages"
import ChatForm from "@/components/chat/ChatForm"
import ChatScroll from "@/components/chat/ChatScroll"

import * as z from "zod"
import axios from "axios"

// キャラクター情報の型
type CharacterType = {
  name: string
  value: string
}

// キャラクターの選択肢
const Characters: CharacterType[] = [
  { name: "Vitalik", value: "vitalik" },
  { name: "Elon Musk", value: "elon" },
  { name: "Bill Gates", value: "gates" },
  { name: "Edward Snowden", value: "snowden" },
]

// 音声機能を有効にするかのフラグ（環境変数で制御）
const useAudio = process.env.NEXT_PUBLIC_USE_AUDIO === "true"

// フォームのバリデーションスキーマ
const FormSchema = z.object({
  prompt: z.string().min(2, {
    message: "2文字以上入力する必要があります。",
  }),
})

// `FormValues` をエクスポート
export type FormValues = z.infer<typeof FormSchema>


export default function Chat() {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
  const [character, setCharacter] = useState<CharacterType>(Characters[0])
  const router = useRouter()
  const { toast } = useToast()

  // React Hook Form
  const form = useForm<FormValues>({
    defaultValues: { prompt: "" },
    resolver: zodResolver(FormSchema),
  })
  const loading = form.formState.isSubmitting

  // 音声再生（useAudio が true のときのみ有効）
  const playAudio = async (text: string, speaker: string) => {
    if (!useAudio) return

    try {
      const response = await axios.post("/api/audio", { text, speaker })
      const base64Audio = response?.data?.response
      const byteArray = Buffer.from(base64Audio, "base64")
      const audioBlob = new Blob([byteArray], { type: "audio/x-wav" })
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.volume = 1
      audio.play()
    } catch (err) {
      console.error(err)
    }
  }

  // フォーム送信時の処理
  const onSubmit = async (data: FormValues) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: data.prompt,
      }
      const newMessages = [...messages, userMessage]
      setMessages(newMessages)

      // 選択されたキャラクターを一緒に送信
      const response = await axios.post("/api/chat", {
        messages: newMessages,
        character: character.value, // ←これが重要
      })

      if (response.status === 200) {
        const updatedMessages = [...newMessages, response.data]
        setMessages(updatedMessages)

        if (useAudio) {
          const latestContent =
            typeof response.data.content === "string"
              ? response.data.content
              : data.prompt
          await playAudio(latestContent, character.value)
        }

        form.reset()
      } else {
        toast({
          variant: "destructive",
          title: "メッセージの取得に失敗しました",
          description: "内容をご確認ください",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "メッセージの取得に失敗しました",
        description: "内容をご確認ください",
      })
    } finally {
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* メッセージ一覧 */}
      <ChatMessages messages={messages} loading={loading} />

      {/* 自動スクロール領域 */}
      <ChatScroll messages={messages} />

      {/* 入力フォーム */}
      <div className="pb-4 inset-x-0 max-w-screen-md px-5 mx-auto bg-white">
        <ChatForm
          form={form}
          onSubmit={onSubmit}
          loading={loading}
        />
      </div>

      {/* キャラクター選択ドロップダウン */}
      <div className="flex gap-4 p-4">
        <label className="font-medium">Select Character:</label>
        <select
          className="p-2 border rounded-md"
          onChange={(e) => {
            const selected = Characters.find((c) => c.value === e.target.value)
            if (selected) {
              setCharacter(selected)
            }
          }}
          value={character.value}
        >
          {Characters.map((char) => (
            <option key={char.value} value={char.value}>
              {char.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

