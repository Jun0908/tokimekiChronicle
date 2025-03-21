
import { useCallback, useEffect, useRef } from "react"
import { ChatCompletionRequestMessage } from "openai"

// ボトムスクロール
const ChatScroll = ({
  messages,
}: {
  messages: ChatCompletionRequestMessage[]
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null)

  // messagesを取得したらスクロール
  const scrollToBottom = useCallback(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  // 初回にボトムスクロール
  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  return <div ref={messageEndRef} />
}

export default ChatScroll
