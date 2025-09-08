import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Sparkles, MessageSquare, Edit3, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const UploadPrompts = ({
  onSendPrompt,
  isLoading,
  disabled = false,
  processingStage,
  messages,
  onSendChat,
}) => {
  const [mode, setMode] = useState("prompt"); // 'prompt' or 'chat'
  const [prompt, setPrompt] = useState("");
  const [timing, setTiming] = useState("before");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (mode === "chat") {
      const newMessage = { role: "user", content: prompt.trim() };
      onSendChat(newMessage);
      setPrompt("");
    } else {
      onSendPrompt(prompt.trim(), mode);
    }
  };

  const getSuggestedPrompts = () => {
    if (processingStage === "upload" || processingStage === "processing") {
      return [
        "Extract all line items with quantities and prices",
        "Focus on extracting vendor and client information",
        "Make sure to capture all tax-related fields",
        "Extract payment terms and due dates",
      ];
    } else {
      return [
        "Verify the total amount calculation",
        "Check if vendor information is complete",
        "Validate all required fields are filled",
        "Review extracted line items for accuracy",
      ];
    }
  };

  const getTimingOptions = () => {
    if (processingStage === "upload") {
      return [{ value: "before", label: "Before Extraction", disabled: false }];
    } else if (processingStage === "extracted") {
      return [{ value: "after", label: "After Extraction", disabled: false }];
    } else {
      return [
        { value: "before", label: "Before Extraction", disabled: true },
        { value: "after", label: "After Extraction", disabled: true },
      ];
    }
  };

  return (
    <Card className="p-4 bg-card h-full flex flex-col">
      {/* Top Rounded Menu Bar */}
      <div className="flex justify-center gap-4 mb-4 bg-muted p-2 rounded-full max-w-md mx-auto">
        <Button
          variant={mode === "prompt" ? "default" : "outline"}
          className="rounded-full px-4"
          onClick={() => setMode("prompt")}
          disabled={isLoading}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Prompt
        </Button>
        <Button
          variant={mode === "chat" ? "default" : "outline"}
          className="rounded-full px-4"
          onClick={() => setMode("chat")}
          disabled={isLoading}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {mode === "chat" ? "Chat with AI" : "AI Prompt"}
        </Label>
        {mode === "prompt" && (
          <div className="flex gap-2 h-full">
            {getTimingOptions().map((option) => (
              <Badge
                key={option.value}
                variant={timing === option.value ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  option.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => !option.disabled && setTiming(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {mode === "chat" ? (
        <div className="flex flex-col h-full space-y-2 overflow-y-auto mb-4">
          {messages &&
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-primary text-black self-end"
                    : "bg-muted self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
          {isLoading && (
            <div className="p-2 rounded-md max-w-[60%] bg-muted self-start flex items-center gap-2 animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is typing...</span>
            </div>
          )}
        </div>
      ) : (
        <Textarea
          placeholder={`Enter your ${
            timing === "before" ? "pre-processing" : "post-processing"
          } instructions...`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[150px] resize-none mb-4"
          disabled={disabled}
        />
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {getSuggestedPrompts().map((suggestion, index) => (
          <Badge
            key={index}
            variant="outline"
            className="cursor-pointer hover:bg-accent text-xs"
            onClick={() => setPrompt(suggestion)}
          >
            {suggestion}
          </Badge>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        {mode === "chat" && (
          <Textarea
            placeholder={"Type a message"}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 min-h-[40px] resize-none"
            disabled={disabled}
          />
        )}
        {mode === "chat" ? (
          <Button
            type="submit"
            name="chat"
            disabled={disabled || !prompt.trim()}
            className="bg-primary hover:bg-primary-hover"
          >
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            name="prompt"
            disabled={disabled || !prompt.trim() || isLoading}
            className="w-full bg-primary hover:bg-primary-hover"
          >
            {isLoading ? (
              <>
                <Loader2 className=" h-4 w-4 mr-2 animate-spin" />
                Updating prompt
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" /> Send prompt
              </>
            )}
          </Button>
        )}
      </form>
    </Card>
  );
};
