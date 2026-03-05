import { memo } from "react";
import type { ChatDockMessage } from "@/store/console-stores/chat-dock-store";
import { MarkdownContent } from "./MarkdownContent";
import { StreamingIndicator } from "./StreamingIndicator";

interface MessageBubbleProps {
  message: ChatDockMessage;
}

export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <>
            <MarkdownContent content={message.content} />
            {message.isStreaming && <StreamingIndicator />}
          </>
        )}
      </div>
    </div>
  );
});
