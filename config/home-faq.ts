import { platforms } from "@/config/platforms";
import { formatBytes } from "@/lib/format";

export type HomeFaq = {
  question: string;
  answer: string;
};

export const homeFaqs: HomeFaq[] = [
  {
    question: "How do I download a GIF from a URL?",
    answer:
      "Paste a public page or file link into Gif Downloader. The tool lists the GIFs and videos it can save, and you download the ones you choose.",
  },
  {
    question: "Do files I make get uploaded?",
    answer: "No. The GIF makers draw and encode in your browser.",
  },
  {
    question: "Why is a GIF from Twitter actually a video?",
    answer: platforms.twitter.note,
  },
  {
    question: "Can every website be downloaded?",
    answer: "Public pages and direct files, yes. Login-only posts, no.",
  },
  {
    question: "What size should a Discord emoji be?",
    answer: `${platforms.discord.emoji.width}×${platforms.discord.emoji.height}, aiming for ${formatBytes(platforms.discord.emojiMaxBytes)} or smaller.`,
  },
];
