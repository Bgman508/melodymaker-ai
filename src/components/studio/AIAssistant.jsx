import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Lightbulb, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function AIAssistant({ tracks, onApplySuggestion }) {
  const [question, setQuestion] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a music production assistant. The user has tracks: ${tracks.map(t => t.name).join(', ')}. Question: ${question}. Give 3 actionable suggestions.`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  action: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setSuggestions(response.suggestions || []);
      toast.success('Got AI suggestions!');
    } catch (error) {
      console.error('AI Assistant error:', error);
      
      // Safe error handling
      let errorMessage = 'AI assistant failed';
      if (error && error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-[#7C61FF]/10 to-transparent border border-[#7C61FF]/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-[#7C61FF]" />
        <h3 className="font-bold text-lg">AI Assistant</h3>
      </div>
      
      <div className="flex gap-2 mb-3">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask: 'How can I improve my mix?' or 'Add variation to drums'"
          onKeyDown={(e) => e.key === 'Enter' && askAI()}
          className="flex-1 bg-white/5 border-white/10"
        />
        <Button
          onClick={askAI}
          disabled={loading || !question.trim()}
          className="bg-[#7C61FF] hover:bg-[#6B4FFF]"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((sug, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#7C61FF]/50 transition-all">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#FFD93D]" />
                  <span className="font-semibold text-sm">{sug.title}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onApplySuggestion(sug.action)}
                  className="h-6 px-2 text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Apply
                </Button>
              </div>
              <p className="text-xs text-white/60">{sug.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}