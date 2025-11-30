import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check, Twitter, Facebook, Link } from "lucide-react";
import { toast } from "sonner";

export default function ShareModal({ project, open, onOpenChange }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl] = useState(`https://prompt2midi.app/share/${project?.id || 'demo'}`);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = `Check out this AI-generated MIDI composition I made with Prompt2MIDI Studio Pro!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--surface)] border-[var(--line)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[var(--mint)]" />
            Share Your Composition
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-[var(--mint)] text-black hover:bg-[var(--mint-hover)]"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={shareToTwitter}
              variant="outline"
              className="flex-1"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button
              onClick={shareToFacebook}
              variant="outline"
              className="flex-1"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="text-sm text-[var(--muted)] mb-2">Embed Code</div>
            <code className="text-xs bg-[var(--bg)] p-2 rounded block overflow-x-auto">
              {`<iframe src="${shareUrl}/embed" width="100%" height="400"></iframe>`}
            </code>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}