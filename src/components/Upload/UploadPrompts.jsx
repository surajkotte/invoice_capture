import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const UploadPrompts = ({
  onSendPrompt,
  disabled = false,
  processingStage,
}) => {
  const [prompt, setPrompt] = useState("");
  const [timing, setTiming] = useState("before");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSendPrompt(prompt.trim(), timing);
      setPrompt("");
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
    <Card className="p-4 bg-card h-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Prompt
          </Label>
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
        </div>

        <Textarea
          placeholder={`Enter your ${
            timing === "before" ? "pre-processing" : "post-processing"
          } instructions...`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-full resize-none"
          disabled={disabled}
        />

        <div className="flex flex-wrap gap-2 mb-3">
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

        <Button
          type="submit"
          disabled={disabled || !prompt.trim()}
          className="w-full bg-primary hover:bg-primary-hover"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Prompt
        </Button>
      </form>
    </Card>
  );
};
