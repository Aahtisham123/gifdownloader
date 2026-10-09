export type IconName =
  | "download"
  | "chat"
  | "pin"
  | "bubble"
  | "frames"
  | "heart"
  | "meme"
  | "spark"
  | "checker"
  | "caption"
  | "hand"
  | "type";

export type SketchName =
  | "heart"
  | "meme"
  | "beloved"
  | "transparent"
  | "caption"
  | "pet"
  | "text";

export type ToolKind = "downloader" | "maker" | "hub";

export type ToolFaq = { question: string; answer: string };

export type Tool = {
  slug: string;
  href: string;
  kind: ToolKind;
  name: string;
  navLabel: string;
  card: string;
  description: string;
  lede: string;
  accent: string;
  onAccent: string;
  icon: IconName;
  sketch?: SketchName;
  steps: string[];
  options: { title: string; body: string }[];
  tips: string[];
  issues: { title: string; body: string }[];
  faqs: ToolFaq[];
  related: string[];
  guides: string[];
};

const sizeTips = [
  "Export near 480 pixels on the long side unless a platform asks for a specific size. A 1080-wide GIF is often several times heavier.",
  "12 to 15 frames per second is enough for most loops. Higher frame rates mostly add file size.",
  "Cut the color count before you cut the picture. 64 to 128 colors with dithering stays readable in chat.",
];

export const tools: Tool[] = [
  {
    slug: "gif-downloader",
    href: "/gif-downloader",
    kind: "downloader",
    name: "Gif Downloader",
    navLabel: "Gif Downloader",
    card: "Paste a page or a direct GIF link and collect the animations it exposes.",
    description:
      "Gif Downloader finds GIFs, animated WebP, and MP4 loops on a public page, then lets you save the ones you choose.",
    lede: "Gif Downloader is the tool for a normal website. Paste the page link, or a direct GIF address. It reads the public HTML, lists the animations it can save, and lets you download one file or a zip. MP4 loops can be converted to GIF in the browser.",
    accent: "#7C3AED",
    onAccent: "#FFF8EE",
    icon: "download",
    steps: [
      "Copy the page address, or the direct .gif address if you already have it.",
      "Paste it here and check that it is a public http or https link.",
      "Review the results, filter them, and download one file or a zip. MP4 items can be converted to GIF here.",
    ],
    options: [
      {
        title: "What the page scan looks for",
        body: "Image sources (including srcset and common lazy-load attributes), picture and video sources, Open Graph and Twitter card media, JSON-LD contentUrl, CSS background images, and links that end in .gif.",
      },
      {
        title: "GIF check",
        body: "A file named .gif is not always a GIF. The downloader confirms the header bytes GIF87a or GIF89a, and notes animated WebP when the file gives that away.",
      },
      {
        title: "MP4 items",
        body: "Many sites serve “GIFs” as silent MP4. Those stay videos until you convert them, with frame rate, width, trim, and quality.",
      },
    ],
    tips: [
      "A direct file link is more reliable than a page that builds its gallery in JavaScript.",
      "Download the largest honest version, then shrink it in a maker if you need a smaller file.",
      "If the same animation appears three times, the grid keeps one.",
    ],
    issues: [
      {
        title: "Nothing useful shows up",
        body: "The page may inject images after load. Open the image in a new tab and paste that file link instead.",
      },
      {
        title: "The link is refused",
        body: "Private, local, and non-http addresses are rejected on purpose. Log in on the original site and copy a public file link if you are allowed to use it.",
      },
      {
        title: "A download is rate limited",
        body: "Wait a moment and try again. The limit is per network, and the message will say so instead of failing silently.",
      },
    ],
    faqs: [
      {
        question: "Can this download from any website?",
        answer:
          "It can read public pages and direct media links. It cannot see login-only posts, and it misses images that exist only after JavaScript runs.",
      },
      {
        question: "Do you keep the pages I paste?",
        answer:
          "The address is used to fetch media and is not stored. Query strings are not written to logs.",
      },
      {
        question: "Will the saved GIF have a watermark?",
        answer: "No. Gif Downloader does not stamp files.",
      },
      {
        question: "Can I turn a found MP4 into a GIF?",
        answer:
          "Yes, in the browser, once conversion is connected. You choose frame rate, width, trim, and quality. The video is not re-uploaded to make that conversion.",
      },
    ],
    related: [
      "twitter-gif-downloader",
      "pinterest-gif-downloader",
      "discord-gif-downloader",
      "gif-maker",
    ],
    guides: [
      "gif-vs-mp4-vs-webp",
      "how-to-save-gifs-on-iphone-and-android",
      "how-to-reduce-gif-file-size",
    ],
  },
  {
    slug: "twitter-gif-downloader",
    href: "/twitter-gif-downloader",
    kind: "downloader",
    name: "Twitter Gif Downloader",
    navLabel: "Twitter Gif Downloader",
    card: "Save the animation from a public Twitter or X post, as MP4 or as a real GIF.",
    description:
      "Twitter Gif Downloader saves GIFs from public Twitter and X posts. The platform stores them as MP4, and you can keep the video or convert it.",
    lede: "Twitter Gif Downloader takes a public post link from twitter.com, x.com, or a mirror such as fxtwitter.com. Twitter does not keep these loops as GIF files. The animation is an MP4 marked animated_gif, so you can download the video or convert it to a GIF on this page. Protected and deleted posts have nothing public to save.",
    accent: "#0369A1",
    onAccent: "#FFF8EE",
    icon: "chat",
    steps: [
      "Open the post and copy its link. It should contain /status/ and a numeric id.",
      "Paste it here. Mobile, fxtwitter, and vxtwitter links are accepted.",
      "Save the MP4, or convert it to GIF with a frame rate, width, trim, and loop.",
    ],
    options: [
      {
        title: "MP4 download",
        body: "The original video is the sharpest copy and usually the smallest. Use it when the destination plays video.",
      },
      {
        title: "GIF conversion",
        body: "Conversion runs in the browser with a generated palette so flat colors stay clean. You set frame rate, width, in and out points, and looping.",
      },
      {
        title: "Several attachments",
        body: "A post can hold more than one animation. Each one is listed. Plain video is offered as video, with convert as a separate action.",
      },
    ],
    tips: [
      "If you only need to reply on X, keep the MP4. Convert when the other app insists on a .gif file.",
      "Trim before you widen the picture. Extra seconds cost more than a few extra pixels.",
      ...sizeTips.slice(0, 1),
    ],
    issues: [
      {
        title: "Protected or deleted post",
        body: "There is nothing public to fetch. The page says so instead of showing a broken player.",
      },
      {
        title: "The link is a profile, not a post",
        body: "Copy the post itself. A profile address has no status id.",
      },
      {
        title: "The unofficial lookup fails",
        body: "X does not offer a stable public GIF API. The tool tries a second public source and, if both fail, tells you rather than inventing a file.",
      },
    ],
    faqs: [
      {
        question: "Why does Twitter Gif Downloader save an MP4?",
        answer:
          "Twitter transcodes uploaded GIFs to silent video. The post still looks like a GIF, but the file is MP4 until you convert it.",
      },
      {
        question: "Which links work?",
        answer:
          "Public status links on x.com, twitter.com, mobile.twitter.com, fxtwitter.com, and vxtwitter.com.",
      },
      {
        question: "Can I download a protected account?",
        answer: "No. Twitter Gif Downloader only uses what that post already exposes publicly.",
      },
      {
        question: "Does conversion upload my video?",
        answer:
          "No. Palette conversion runs in your browser after the file has been saved to the page.",
      },
    ],
    related: ["gif-downloader", "discord-gif-downloader", "gif-meme-maker"],
    guides: [
      "how-to-download-gifs-from-x",
      "gif-vs-mp4-vs-webp",
      "why-platforms-convert-gifs-to-video",
    ],
  },
  {
    slug: "pinterest-gif-downloader",
    href: "/pinterest-gif-downloader",
    kind: "downloader",
    name: "Pinterest GIF Downloader",
    navLabel: "Pinterest GIF Downloader",
    card: "Save a public pin’s GIF, including the original size when Pinterest offers it.",
    description:
      "Pinterest GIF Downloader saves GIFs from public pins on desktop and mobile, including original, 736x, and 564x sizes.",
    lede: "Pinterest GIF Downloader accepts a public pin link, including regional Pinterest domains and pin.it short links. It looks for i.pinimg.com GIF files, prefers the original, and lists the 736 and 564 sizes when the pin page offers them.",
    accent: "#BE123C",
    onAccent: "#FFF8EE",
    icon: "pin",
    steps: [
      "Open the pin and copy the address, or share the pin.it link.",
      "Paste it here. Regional hosts such as uk.pinterest.com are fine.",
      "Choose a size. Originals are the full file. 736x and 564x are the smaller copies Pinterest generates.",
    ],
    options: [
      {
        title: "Sizes",
        body: "When the pin page lists them, you get originals, 736x, and 564x. Start from originals if you plan to edit.",
      },
      {
        title: "Video pins",
        body: "A direct MP4 can be saved. An HLS playlist (.m3u8) is not a single file, and the page will say that plainly instead of handing you a playlist.",
      },
      {
        title: "Short links",
        body: "pin.it redirects to the pin. The redirect is followed only as far as the public pin page, with the same private-network blocks as every other fetch.",
      },
    ],
    tips: [
      "On a phone, use the pin’s share sheet and copy the link rather than saving the preview image.",
      "The preview in the grid is often the small size. Check the size label before you download.",
      "A still thumbnail is not the animation. Look for the GIF badge.",
    ],
    issues: [
      {
        title: "The pin is only a picture",
        body: "Not every pin is a GIF. You will get the still image if that is all the page exposes, labeled as an image.",
      },
      {
        title: "Only an m3u8 link is present",
        body: "That is a streaming playlist, not an MP4. Pinterest GIF Downloader does not treat a playlist as a video file.",
      },
      {
        title: "The short link does not resolve",
        body: "The pin may be private or removed. Open it while logged out. If you cannot see it, the tool cannot either.",
      },
    ],
    faqs: [
      {
        question: "Does this work on the Pinterest app?",
        answer:
          "Copy the pin link from the share sheet and paste it here. You do not need the Pinterest app installed on a computer.",
      },
      {
        question: "Which size should I save?",
        answer:
          "Originals, when listed. Use 736x or 564x only when you want a smaller file and will not edit further.",
      },
      {
        question: "Can I download a private board?",
        answer: "No. The pin has to be visible without logging in.",
      },
      {
        question: "Are you affiliated with Pinterest?",
        answer: "No. Pin names are used so you know which link to paste.",
      },
    ],
    related: ["gif-downloader", "twitter-gif-downloader", "transparent-gif-maker"],
    guides: [
      "how-to-download-gifs-from-pinterest",
      "how-to-save-gifs-on-iphone-and-android",
    ],
  },
  {
    slug: "discord-gif-downloader",
    href: "/discord-gif-downloader",
    kind: "downloader",
    name: "Discord GIF Downloader",
    navLabel: "Discord GIF Downloader",
    card: "Save a Discord attachment, a Tenor GIF, or a Giphy GIF, then fit an emoji size.",
    description:
      "Discord GIF Downloader saves GIFs from Discord CDN links, Tenor, and Giphy, with an emoji-sized export.",
    lede: "Discord GIF Downloader does not read a server. Paste the link you can copy: a Discord CDN attachment, a Tenor page, or a Giphy page. Save the file, or export it at Discord’s 128×128 emoji size.",
    accent: "#5B4DFF",
    onAccent: "#FFF8EE",
    icon: "bubble",
    steps: [
      "On desktop, open the GIF and copy the link. On mobile, use Share and copy the media link.",
      "Paste a cdn.discordapp.com, media.discordapp.net, tenor.com, or giphy.com address.",
      "Save the file, or use the emoji preset when you need 128×128 under the size target.",
    ],
    options: [
      {
        title: "Discord CDN",
        body: "Attachment links carry an expiry signature. A fresh link from the app is required after that signature dies.",
      },
      {
        title: "Tenor and Giphy",
        body: "Tenor comes from the GIF picker. The page prefers a GIF and also offers MP4. Giphy uses the id at the end of the slug.",
      },
      {
        title: "Emoji preset",
        body: "128×128, with colors and frame rate reduced until the file fits the size target in the platform config (256 KB by default).",
      },
    ],
    tips: [
      "Copy the link from the GIF message, not from the channel name.",
      "If Discord says the emoji is too big, run the emoji preset instead of scaling the GIF by hand in a photo app.",
      "Tenor’s MP4 is smaller than its GIF. Convert only if you need an actual GIF file.",
    ],
    issues: [
      {
        title: "The CDN link expired",
        body: "Go back to Discord and copy the attachment again. Old signatures cannot be refreshed from here.",
      },
      {
        title: "You pasted a channel link",
        body: "discord.com/channels addresses are not files. Use the attachment, Tenor, or Giphy link.",
      },
      {
        title: "The emoji is still over the limit",
        body: "Shorten the loop or drop the frame rate again. The preset can only shrink what the animation contains.",
      },
    ],
    faqs: [
      {
        question: "How do I copy a GIF link on desktop?",
        answer:
          "Hover the image, open the context menu, and copy the link. If it is a Tenor result, copy the tenor.com address.",
      },
      {
        question: "How do I copy it on mobile?",
        answer:
          "Long-press the GIF, choose Share, and copy the link. If Share only offers the app, open the GIF and copy the media address.",
      },
      {
        question: "What size is a Discord emoji?",
        answer:
          "Discord displays custom emoji at 128×128. The default file-size target in Gif Downloader is 256 KB, set in the platform config.",
      },
      {
        question: "Can you read my Discord messages?",
        answer:
          "No. Nothing is fetched unless you paste a link, and server channels are not public pages.",
      },
    ],
    related: ["pet-gif-maker", "text-gif-maker", "gif-downloader"],
    guides: [
      "how-to-save-gifs-from-discord",
      "how-to-make-a-pet-pet-gif",
      "best-gif-sizes-and-limits",
    ],
  },
  {
    slug: "gif-maker",
    href: "/gif-maker",
    kind: "hub",
    name: "GIF maker",
    navLabel: "All GIF makers",
    card: "Seven makers that draw every frame in your browser.",
    description:
      "Make a GIF in the browser: heart locket, meme, caption, pet, transparent, beloved, or animated text.",
    lede: "The GIF maker collects every editor on Gif Downloader. Each one draws frames on your device, so the pictures you add are not uploaded. Start with text for a quick loop, or open a photo maker if you already have an image.",
    accent: "#FF3D7F",
    onAccent: "#0E0B1A",
    icon: "frames",
    steps: [
      "Choose the maker that matches the joke, the message, or the edit.",
      "Add a photo, a GIF, or text. Crop and timing live in that maker.",
      "Export a GIF, an MP4, or a zip of PNG frames.",
    ],
    options: [
      {
        title: "Shared export",
        body: "Every maker shares size presets, frame rate, loop count, colors, dithering, and a file name you can edit.",
      },
      {
        title: "Shared edits",
        body: "Makers that take a GIF or video will crop, resize, trim, reverse, boomerang, and change speed.",
      },
      {
        title: "Privacy",
        body: "Encoding runs in a worker on your device. The privacy line on each maker is there because the file does not leave the browser.",
      },
    ],
    tips: sizeTips,
    issues: [
      {
        title: "The tab gets heavy",
        body: "Lower the size or the frame count. The worker will say so if it runs out of memory, instead of freezing the page.",
      },
      {
        title: "A preset disappeared",
        body: "Custom presets live in this browser’s local storage. A private window or a cleared site storage removes them.",
      },
    ],
    faqs: [
      {
        question: "Do I need an account?",
        answer: "No.",
      },
      {
        question: "Are the makers free?",
        answer: "Yes. There is no watermark and no download gate.",
      },
      {
        question: "Which maker should I open first?",
        answer:
          "Text for a message, meme or caption for an existing GIF, pet for a Discord emoji, heart locket or beloved for a photo, transparent to remove a flat background.",
      },
      {
        question: "Will this work on my phone?",
        answer:
          "Yes. Controls are sized for touch, and export can use the share sheet when the browser allows it.",
      },
    ],
    related: ["text-gif-maker", "gif-meme-maker", "heart-locket-gif-maker"],
    guides: ["how-to-reduce-gif-file-size", "best-gif-sizes-and-limits"],
  },
  {
    slug: "heart-locket-gif-maker",
    href: "/heart-locket-gif-maker",
    kind: "maker",
    name: "Heart locket GIF maker",
    navLabel: "Heart locket",
    card: "Two photos inside an opening heart locket.",
    description:
      "Make a heart locket GIF from two photos, with metal, engraving, chain, and an open-and-close loop.",
    lede: "The heart locket GIF maker opens two photos inside a drawn heart. Choose gold, silver, rose, or black metal, add an engraving and a chain, then export the loop.",
    accent: "#BE123C",
    onAccent: "#FFF8EE",
    icon: "heart",
    sketch: "heart",
    steps: [
      "Add the left photo and the right photo. Drag each one to crop, zoom, and position it.",
      "Pick a metal, a heart style, and optional engraving. Turn the chain and sparkle up or down.",
      "Choose open-only or an open-hold-close loop, then export.",
    ],
    options: [
      {
        title: "Metal and shape",
        body: "Gold, silver, rose gold, black chrome, or a custom color. Heart styles are classic, rounded, and vintage engraved.",
      },
      {
        title: "Engraving and chain",
        body: "Front text has its own font and size. The chain can swing or stay off.",
      },
      {
        title: "Photos and filters",
        body: "Each photo has its own crop. Filters are none, sepia, black and white, vintage, and soft glow.",
      },
      {
        title: "Motion and background",
        body: "Set open speed and hold time. Backgrounds are transparent, solid, gradient, or soft bokeh. A shine sweep and sparkle amount sit on top.",
      },
    ],
    tips: [
      "Use two faces shot from a similar distance so the locket does not pair a portrait with a tiny figure.",
      "Transparent background is the right export when you will paste the locket onto another story.",
      ...sizeTips.slice(1, 2),
    ],
    issues: [
      {
        title: "A photo looks soft",
        body: "You zoomed past the pixels. Pull the zoom back until the face is sharp inside the heart.",
      },
      {
        title: "The engraving does not fit",
        body: "Shorten the line or reduce the size. The locket will not shrink the letters into an unreadable stroke.",
      },
    ],
    faqs: [
      {
        question: "Are the locket graphics from the trend I saw?",
        answer:
          "No. The heart, metal, and chain are drawn for Gif Downloader. Do not upload artwork you do not have rights to use as the photos either.",
      },
      {
        question: "Can the two photos move separately?",
        answer: "Yes. Crop, zoom, and position are per photo.",
      },
      {
        question: "What are the presets?",
        answer: "Classic Gold, Vintage, Pink Love, and Minimal Silver.",
      },
      {
        question: "Can I hide the chain?",
        answer: "Yes. Chain on or off is its own control, separate from the swing.",
      },
    ],
    related: ["my-beloved-gif-maker", "gif-meme-maker", "text-gif-maker"],
    guides: ["the-heart-locket-gif-trend", "how-to-reduce-gif-file-size"],
  },
  {
    slug: "gif-meme-maker",
    href: "/gif-meme-maker",
    kind: "maker",
    name: "GIF meme maker",
    navLabel: "Meme",
    card: "Classic top and bottom text, plus extra lines timed to frames.",
    description:
      "Add meme captions to a GIF, video, or still, with outlined text, stickers, and frame timing.",
    lede: "The GIF meme maker puts Impact-style text on a GIF, a video, or a still. Use the classic top-and-bottom layout, or center both lines on the picture.",
    accent: "#D97706",
    onAccent: "#0E0B1A",
    icon: "meme",
    sketch: "meme",
    steps: [
      "Drop in a GIF, video, or image, or start from a blank frame.",
      "Add top and bottom text, or drag extra text and sticker layers where you want them.",
      "Trim, reverse, or boomerang, then export.",
    ],
    options: [
      {
        title: "Text layers",
        body: "Unlimited layers. Each has font, size, color, stroke, shadow, alignment, rotation, and a frame range.",
      },
      {
        title: "Classic caption",
        body: "Anton, uppercase toggle, white fill, black stroke, and a size that fits the width.",
      },
      {
        title: "Stickers",
        body: "Emoji drawn by the canvas, plus original SVG stickers. No third-party character art.",
      },
      {
        title: "Clip edits",
        body: "Crop, resize, trim, reverse, boomerang, and speed, shared with the other makers that accept a clip.",
      },
    ],
    tips: [
      "Keep meme text to a few words. The stroke needs room or the letters fuse together.",
      "Time a punchline to the frame where the action lands, not the first frame.",
      ...sizeTips.slice(0, 1),
    ],
    issues: [
      {
        title: "The stroke ate the letters",
        body: "Lower the stroke width or raise the font size. Tiny text with a thick outline becomes blobs.",
      },
      {
        title: "Video import is slow",
        body: "The first conversion loads the encoder. After that, progress stays on screen and the page should stay usable.",
      },
    ],
    faqs: [
      {
        question: "Can I use my own font?",
        answer:
          "You can switch among the fonts the maker loads. Anton is the default because it reads as the classic meme face.",
      },
      {
        question: "Can text show up halfway through?",
        answer: "Yes. Every layer has a start frame and an end frame.",
      },
      {
        question: "Do you store my meme?",
        answer: "No. The file is encoded in the browser.",
      },
      {
        question: "Can I start with no image?",
        answer: "Yes. Blank canvas is a first-class input.",
      },
    ],
    related: ["gif-caption-maker", "text-gif-maker", "gif-downloader"],
    guides: ["how-to-add-captions-to-a-gif", "how-to-reduce-gif-file-size"],
  },
  {
    slug: "my-beloved-gif-maker",
    href: "/my-beloved-gif-maker",
    kind: "maker",
    name: "My beloved GIF maker",
    navLabel: "My beloved",
    card: "A portrait, the words “my beloved,” and a frame that twinkles.",
    description:
      "Turn a photo into a my beloved GIF with frames, sparkles, and script or pixel lettering.",
    lede: "The my beloved GIF maker crops one photo into a circle, a rounded square, or a heart, then writes a script line under the portrait. Float, pulse, or sway the frame.",
    accent: "#DB2777",
    onAccent: "#FFF8EE",
    icon: "spark",
    sketch: "beloved",
    steps: [
      "Add a photo and adjust the center crop.",
      "Edit the line, pick a font and a frame, then turn on the motions you want together.",
      "Set the background, including transparent, and export.",
    ],
    options: [
      {
        title: "Frames",
        body: "Glitter hearts, twinkling stars, flower crown, Y2K pixel, soft glow vignette, and polaroid.",
      },
      {
        title: "Motion",
        body: "Twinkle, floating hearts, a rotating sparkle ring, pulsing glow, rainbow shimmer on the text, and a gentle bounce. They combine.",
      },
      {
        title: "Type",
        body: "Great Vibes, Pacifico, Press Start 2P, and Bricolage Grotesque, plus color and glow.",
      },
    ],
    tips: [
      "One motion reads as charming. All of them at once reads as noise. Start with twinkle or the sparkle ring.",
      "Script fonts need a short line. “my beloved” fits. A sentence will not.",
      "Pixel font wants the Y2K frame. Mixing it with a flower crown fights itself.",
    ],
    issues: [
      {
        title: "The face is cut off",
        body: "Drag the crop. Auto center is only the starting guess.",
      },
      {
        title: "The glow muddy the photo",
        body: "Turn the text glow down, or move the line off the face.",
      },
    ],
    faqs: [
      {
        question: "Can I change the words?",
        answer: "Yes. “my beloved” is only the default.",
      },
      {
        question: "Where can the text sit?",
        answer: "Above the photo, below it, or over it.",
      },
      {
        question: "Can the background be transparent?",
        answer: "Yes, along with solid and gradient.",
      },
      {
        question: "Are the frames stock stickers?",
        answer: "No. They are drawn for this maker.",
      },
    ],
    related: ["heart-locket-gif-maker", "text-gif-maker", "pet-gif-maker"],
    guides: ["10-creative-ways-to-use-gifs", "how-to-reduce-gif-file-size"],
  },
  {
    slug: "transparent-gif-maker",
    href: "/transparent-gif-maker",
    kind: "maker",
    name: "Transparent GIF maker",
    navLabel: "Transparent",
    card: "Knock out a flat background without a halo around the edges.",
    description:
      "Make a transparent GIF from a GIF, video, or image with color keying, a matte, and an alpha threshold.",
    lede: "The transparent GIF maker keys out a flat background, including white, black, or a green screen. Set the tolerance and a matte so the fringe matches the page where you will place the file.",
    accent: "#0891B2",
    onAccent: "#FFF8EE",
    icon: "checker",
    sketch: "transparent",
    steps: [
      "Add a GIF, video, or still with a fairly flat background.",
      "Pick the background with the eyedropper, or use the corner sample. Raise tolerance until the backdrop disappears and the subject stays.",
      "Set the alpha threshold and a light, dark, or custom matte. Preview on the checkerboard before you export.",
    ],
    options: [
      {
        title: "Color key",
        body: "Eyedropper, corner detection, tolerance, more than one key color, edge feather, and despill.",
      },
      {
        title: "Matte and threshold",
        body: "The threshold decides which soft pixels become clear. The matte tints the remaining edge so it does not glow on the destination background.",
      },
      {
        title: "Preview",
        body: "Checkerboard, white, dark, or a custom color. The preview background is not baked into the file.",
      },
      {
        title: "Harder backgrounds",
        body: "An optional per-frame segmenter can load when color keying is not enough. It stays unloaded until you ask for it.",
      },
    ],
    tips: [
      "Keying wants a flat wall or a studio color. A busy photo of a street will not come out clean.",
      "Match the matte to the page behind the GIF. Light matte on a light site, dark matte on a dark site.",
      "Export only as GIF if you need GIF transparency. MP4 cannot carry a transparent pixel the same way.",
    ],
    issues: [
      {
        title: "The subject has holes",
        body: "Tolerance is too high, or a key color also appears in the subject. Remove that extra key.",
      },
      {
        title: "A pale fringe remains",
        body: "Switch the matte, then move the alpha threshold. Feather cleans stair-steps; it does not replace the matte.",
      },
      {
        title: "The checkerboard was saved into the GIF",
        body: "That means transparency was off in export. Turn it on. The checkerboard is only a preview.",
      },
    ],
    faqs: [
      {
        question: "Why do transparent GIFs look harsh?",
        answer:
          "The format has no partial opacity. Soft edges have to become solid or clear, which is what the threshold controls.",
      },
      {
        question: "Can I key more than one color?",
        answer: "Yes. Add a key for each backdrop color you need gone.",
      },
      {
        question: "Do you upload the video to remove the background?",
        answer: "No. Keying runs locally. A segmentation model, if you enable it, also runs on device.",
      },
      {
        question: "What if the background is a person in a room?",
        answer:
          "Color key will struggle. That is the case for the optional segmenter, not for a higher tolerance.",
      },
    ],
    related: ["pet-gif-maker", "gif-meme-maker", "text-gif-maker"],
    guides: [
      "how-to-make-a-gif-transparent",
      "how-gif-compression-works",
    ],
  },
  {
    slug: "gif-caption-maker",
    href: "/gif-caption-maker",
    kind: "maker",
    name: "GIF caption maker",
    navLabel: "Caption",
    card: "Subtitle bars, overlays, and speech bubbles on a timeline.",
    description:
      "Add timed captions to a GIF with bars, overlays, or speech bubbles, and wrapping that stays on screen.",
    lede: "The GIF caption maker puts words on a GIF as a bar, a speech bubble, an overlay, or a lower third. The caption can wait until the frame you choose.",
    accent: "#059669",
    onAccent: "#FFF8EE",
    icon: "caption",
    sketch: "caption",
    steps: [
      "Add the GIF or video.",
      "Create a caption, pick a style, and drag its range on the timeline.",
      "Set wrap, padding, color, and type, then export.",
    ],
    options: [
      {
        title: "Styles",
        body: "White bar with black text above, the same bar below, overlay subtitles, and a speech bubble.",
      },
      {
        title: "Timeline",
        body: "Several captions. Each has a start and end you can drag.",
      },
      {
        title: "Type",
        body: "Wrapping, padding, bar color, font, size, alignment, emoji, and an outline or shadow on overlays.",
      },
    ],
    tips: [
      "One line per caption reads faster than a paragraph in a 2-second loop.",
      "Overlays need a shadow or stroke. Bars do not, because the bar is the contrast.",
      "Leave a gap of a few frames between speakers so the eye notices the change.",
    ],
    issues: [
      {
        title: "The last word wraps onto its own line",
        body: "Shorten the caption or widen the GIF slightly. Auto wrap will not hyphenate a word in half.",
      },
      {
        title: "Two captions overlap and both show",
        body: "That is allowed. Drag one range if you meant them to take turns.",
      },
    ],
    faqs: [
      {
        question: "How is this different from the meme maker?",
        answer:
          "Meme text is the classic outlined shout. Captions are timed lines: bars, subtitles, and bubbles.",
      },
      {
        question: "Can I use emoji in a caption?",
        answer: "Yes.",
      },
      {
        question: "Can captions cover the whole loop?",
        answer: "Yes. Set the range from the first frame to the last.",
      },
      {
        question: "Does the bar get saved into the GIF?",
        answer: "Yes. Only the preview chrome stays out of the file.",
      },
    ],
    related: ["gif-meme-maker", "text-gif-maker", "gif-downloader"],
    guides: ["how-to-add-captions-to-a-gif", "gif-vs-mp4-vs-webp"],
  },
  {
    slug: "pet-gif-maker",
    href: "/pet-gif-maker",
    kind: "maker",
    name: "Pet GIF maker",
    navLabel: "Pet",
    card: "The pet-pet pat: a hand, a squish, a loop.",
    description:
      "Make a pet-pet GIF from a photo or emoji, with an original hand and Discord-sized presets.",
    lede: "The pet GIF maker turns an avatar, a pet photo, or an emoji into a patting loop. An original hand squishes the picture in time with the pat. The hand is drawn for Gif Downloader, not traced from an existing sprite sheet.",
    accent: "#EA580C",
    onAccent: "#FFF8EE",
    icon: "hand",
    sketch: "pet",
    steps: [
      "Add an image. Choose a circle crop, a rounded crop, or none.",
      "Set squish, speed, frame count, hand style, and skin tone or a custom hand color.",
      "Pick 128 for a Discord emoji or 112 for the classic small loop. Transparent is the default background.",
    ],
    options: [
      {
        title: "Crop and squish",
        body: "Circle, rounded, or uncropped. Squish intensity follows the hand so the pat reads.",
      },
      {
        title: "Hand",
        body: "More than one hand drawing, skin-tone choices, and a custom color if you want a glove or a creature paw.",
      },
      {
        title: "Sizes",
        body: "Discord emoji at 128×128 and the classic 112×112 loop, plus the shared custom size.",
      },
    ],
    tips: [
      "A face or a simple icon reads at 128 pixels. A full-body photo becomes a smudge.",
      "Four to eight frames is the whole joke. More frames do not make a better pat.",
      "Leave the background transparent if the emoji will sit on a colored Discord role.",
    ],
    issues: [
      {
        title: "The hand covers the face",
        body: "Reduce the hand size. The squish still plays if the palm stays near the top of the crop.",
      },
      {
        title: "The emoji file is over the Discord limit",
        body: "Use the 128 preset and fewer colors. The size target lives in the platform config.",
      },
    ],
    faqs: [
      {
        question: "Is this the same sprite as the pet I have seen elsewhere?",
        answer: "No. The hand is an original drawing, so it will not match that sprite sheet pixel for pixel.",
      },
      {
        question: "Can I pet an emoji?",
        answer: "Yes. Emoji can be the picture.",
      },
      {
        question: "What is the default background?",
        answer: "Transparent.",
      },
      {
        question: "Which size is the Discord one?",
        answer: "128×128. 112×112 is the smaller classic loop.",
      },
    ],
    related: ["discord-gif-downloader", "text-gif-maker", "transparent-gif-maker"],
    guides: ["how-to-make-a-pet-pet-gif", "best-gif-sizes-and-limits"],
  },
  {
    slug: "text-gif-maker",
    href: "/text-gif-maker",
    kind: "maker",
    name: "Text GIF maker",
    navLabel: "Text",
    card: "Animated words: typewriter, wave, neon, marquee, and more.",
    description:
      "Make a text GIF with animated effects, outline, glow, and banner or emoji sizes.",
    lede: "The text GIF maker animates a line with wave, neon, glitch, spin, slide, and other motions. Pick a font, then export a banner or status loop without a photo.",
    accent: "#65A30D",
    onAccent: "#0E0B1A",
    icon: "type",
    sketch: "text",
    steps: [
      "Write the text. Set alignment, letter spacing, and line height.",
      "Choose an effect, a fill, a stroke, and a background.",
      "Pick a size preset and export.",
    ],
    options: [
      {
        title: "Effects",
        body: "Typewriter, wave, bounce, glitch, neon flicker, rainbow, zoom in, shake, per-letter fade, 3D extrude, marquee, and sparkle.",
      },
      {
        title: "Type",
        body: "A curated set of more than 25 fonts, loaded when selected. Solid or gradient fill, stroke, shadow, and glow.",
      },
      {
        title: "Background and size",
        body: "Transparent, solid, gradient, or an animated gradient. Presets include 728×90, 468×60, Discord emoji, Twitch emote, and square.",
      },
    ],
    tips: [
      "Marquee and typewriter need a longer loop than a shake. Do not export them at six frames.",
      "Neon on a busy gradient loses the glow. Use a dark solid behind neon.",
      "Banner presets are short. Two or three words, not a paragraph.",
      ...sizeTips.slice(1, 2),
    ],
    issues: [
      {
        title: "A font looks like a fallback",
        body: "It is still loading. The line stays put until the file arrives, then the preview redraws.",
      },
      {
        title: "The extrude is cut off",
        body: "The depth needs padding. Reduce the size or add line height so the shadow stays inside the frame.",
      },
    ],
    faqs: [
      {
        question: "Which effect should I use for a banner?",
        answer: "Marquee or a slow wave. Shake and glitch are hard to read at 90 pixels tall.",
      },
      {
        question: "Can the background be transparent?",
        answer: "Yes.",
      },
      {
        question: "How many fonts are there?",
        answer: "More than 25, loaded one at a time so the page does not fetch them all up front.",
      },
      {
        question: "Does the text tool accept a photo?",
        answer:
          "No. Use the meme or caption maker when the words need to sit on a clip. This one is type and background.",
      },
    ],
    related: ["gif-caption-maker", "gif-meme-maker", "pet-gif-maker"],
    guides: ["how-to-add-captions-to-a-gif", "best-gif-sizes-and-limits"],
  },
];

export function getTool(slug: string): Tool {
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) {
    throw new Error(`Unknown tool: ${slug}`);
  }
  return tool;
}

export const downloaders = tools.filter((tool) => tool.kind === "downloader");
export const makers = tools.filter((tool) => tool.kind === "maker");
export const makerHub = getTool("gif-maker");
