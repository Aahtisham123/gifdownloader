export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export type Article = {
  slug: string;
  kind: "guide" | "blog";
  title: string;
  description: string;
  updated: string;
  toolSlug: string;
  related: string[];
  sections: ArticleSection[];
};

const updated = "2026-10-09";

export const articles: Article[] = [
  {
    slug: "how-to-download-gifs-from-x",
    kind: "guide",
    title: "How to download GIFs from X (Twitter) — and why they are actually MP4s",
    description:
      "X stores GIFs as silent MP4 video. Here is how to save a public post, and when to convert it back to a GIF.",
    updated,
    toolSlug: "twitter-gif-downloader",
    related: ["gif-vs-mp4-vs-webp", "why-platforms-convert-gifs-to-video"],
    sections: [
      {
        id: "why-mp4",
        heading: "Why the GIF is an MP4",
        paragraphs: [
          "When someone uploads a GIF to X, the site transcodes it. The post still loops like a GIF, but the file on X’s servers is a silent MP4 with the media type animated_gif. That is why a naive “save image” often gives you a still, and why a real download is a video.",
          "Video is smaller and sharper than a palette GIF of the same frames. Keep the MP4 if the next app plays video. Convert only when you need a .gif file, for example an app that rejects MP4.",
        ],
      },
      {
        id: "copy-the-post",
        heading: "Copy the post, not the profile",
        paragraphs: [
          "The link has to be a status. On x.com, twitter.com, mobile.twitter.com, fxtwitter.com, or vxtwitter.com, the path contains /status/ and a numeric id. A profile URL has no animation to fetch.",
          "Protected and deleted posts have nothing public to read. If you cannot see the post while logged out, [the Twitter Gif Downloader](/twitter-gif-downloader) cannot see it either.",
        ],
      },
      {
        id: "convert",
        heading: "Convert only if you need a GIF",
        paragraphs: [
          "Conversion should use a generated palette (palettegen and paletteuse), not a single shared palette across unrelated colors. Set the width and trim before you raise the frame rate. Extra frames cost more than a slightly narrower picture.",
          "Posts with several attachments should list every one. A normal video is still a video. Offer convert as a separate step so you do not turn a clip with sound into a silent GIF by accident.",
        ],
      },
    ],
  },
  {
    slug: "how-to-download-gifs-from-pinterest",
    kind: "guide",
    title: "How to download GIFs from Pinterest on desktop and mobile",
    description:
      "Copy a public pin link, including pin.it, and save the original GIF when Pinterest has one.",
    updated,
    toolSlug: "pinterest-gif-downloader",
    related: ["how-to-save-gifs-on-iphone-and-android", "best-gif-sizes-and-limits"],
    sections: [
      {
        id: "copy",
        heading: "Copy the pin link",
        paragraphs: [
          "On desktop, open the pin and copy the address from the browser. Regional sites such as uk.pinterest.com and in.pinterest.com are the same pin. On a phone, use the share sheet and copy the link. A screenshot of the pin is not the GIF.",
          "pin.it short links are fine. They redirect to the pin. If the pin is private or gone, the redirect has nothing public to open.",
        ],
      },
      {
        id: "sizes",
        heading: "Pick originals when you can",
        paragraphs: [
          "Pinterest often stores the same image at originals, 736x, and 564x on i.pinimg.com. Originals is the file to edit. The smaller widths are convenient when you only need to drop the GIF into a chat.",
          "Use [the Pinterest GIF downloader](/pinterest-gif-downloader) and check the size label. The thumbnail in a grid is frequently the small copy.",
        ],
      },
      {
        id: "video",
        heading: "Video pins are a different file",
        paragraphs: [
          "Some pins are video. A direct MP4 can be saved. A link that ends in .m3u8 is an HLS playlist, a list of chunks, not one video. A downloader should say that, not rename the playlist to .mp4.",
          "Still pins are stills. A GIF badge means the file loops. A plain image download will not start looping later.",
        ],
      },
    ],
  },
  {
    slug: "how-to-save-gifs-from-discord",
    kind: "guide",
    title: "How to save and download GIFs from Discord",
    description:
      "Discord has no public GIF page. Save CDN attachments, Tenor links, and Giphy links, and fit an emoji.",
    updated,
    toolSlug: "discord-gif-downloader",
    related: ["how-to-make-a-pet-pet-gif", "best-gif-sizes-and-limits"],
    sections: [
      {
        id: "which-link",
        heading: "Which link to copy",
        paragraphs: [
          "A channel URL (discord.com/channels/...) is not a file. You want one of three things: the attachment on cdn.discordapp.com or media.discordapp.net, a tenor.com/view link from the GIF picker, or a giphy.com/gifs link.",
          "On desktop, open the image menu and copy the link. On mobile, long-press the GIF, choose Share, and copy the media link. [The Discord GIF downloader](/discord-gif-downloader) accepts those three and refuses channel URLs on purpose.",
        ],
      },
      {
        id: "expiry",
        heading: "CDN links expire",
        paragraphs: [
          "Discord signs attachment URLs. When the signature expires, the file 404s even though the message is still in your history. Copy a fresh link from the app. Nothing on our side can renew Discord’s signature.",
        ],
      },
      {
        id: "emoji",
        heading: "Making it emoji-sized",
        paragraphs: [
          "Custom emoji display at 128×128. Gif Downloader’s default size target is 256 KB, stored in the platform config so it can change in one place. Fewer colors and a shorter loop get you under that cap faster than shaving a pixel off the width.",
          "Tenor often has both a GIF and an MP4. The MP4 is smaller. Convert it only if the destination demands a GIF.",
        ],
      },
    ],
  },
  {
    slug: "how-to-save-gifs-on-iphone-and-android",
    kind: "guide",
    title: "How to save GIFs on iPhone and Android",
    description:
      "Photos on iPhone often stores a GIF as a looping video. Here is how to keep an actual GIF file on either phone.",
    updated,
    toolSlug: "gif-downloader",
    related: ["how-to-download-gifs-from-pinterest", "gif-vs-mp4-vs-webp"],
    sections: [
      {
        id: "iphone",
        heading: "iPhone",
        paragraphs: [
          "The Photos app likes video. Saving a GIF from Safari or Messages often stores a Live Photo or a silent movie, and AirDrop back to a computer then gives you an MOV. If you need a .gif file, save it to Files, or use the share sheet on the download instead of Add to Photos.",
          "A download with Content-Disposition, which is how Gif Downloader’s proxy is meant to work, lands in the Files app downloads. Check the extension before you import it into Photos.",
        ],
      },
      {
        id: "android",
        heading: "Android",
        paragraphs: [
          "Chrome can download a GIF directly. Long-press a direct image, or use the browser download when the site sends the file. The file stays a GIF in Downloads, and you can share it from Files.",
          "Some keyboards and chat apps convert again on the way out. If the receiver sees a still, send the file as a document rather than as a photo.",
        ],
      },
      {
        id: "either",
        heading: "Either phone",
        paragraphs: [
          "Paste the page link into [the universal downloader](/gif-downloader) rather than taking a screen recording. A recording is a new, blurrier video of the GIF, not the GIF.",
          "Makers on Gif Downloader export in the browser, then the share sheet can hand the file to Files, Drive, or a chat app. The export does not need the GIF to pass through Photos first.",
        ],
      },
    ],
  },
  {
    slug: "how-to-make-a-gif-transparent",
    kind: "guide",
    title: "How to make a GIF transparent (without ugly edges)",
    description:
      "GIF transparency is on or off per pixel. Use a matte and an alpha threshold so the edge matches the background.",
    updated,
    toolSlug: "transparent-gif-maker",
    related: ["how-gif-compression-works", "how-to-reduce-gif-file-size"],
    sections: [
      {
        id: "one-bit",
        heading: "GIF transparency is 1-bit",
        paragraphs: [
          "A GIF pixel is fully opaque or fully clear. There is no 40% opacity. Soft edges from a photo or a video matte have to be pushed one way or the other. That decision is the alpha threshold.",
          "If you leave the half-transparent pixels opaque, you see a halo of the old background. If you clear too many, the subject gets bitten into. [The transparent GIF maker](/transparent-gif-maker) puts that slider in front of you instead of guessing silently.",
        ],
      },
      {
        id: "matte",
        heading: "Set a matte for the destination",
        paragraphs: [
          "The pixels you keep at the edge still carry a little of the old backdrop. A matte recolors that fringe toward the background you will place the GIF on: light, dark, or a custom color.",
          "Preview on a checkerboard to see holes, then preview on a color close to the real page. The checkerboard must not be baked into the file. If you can see squares in the exported GIF, transparency was off.",
        ],
      },
      {
        id: "when-key-fails",
        heading: "When a color key is the wrong tool",
        paragraphs: [
          "Keying works on a flat wall, a greenscreen, or a solid page. It fails on hair in front of a street. Raising tolerance until the street disappears will also delete the hair.",
          "That is the case for per-frame segmentation, loaded only if you ask. It is heavier, and it still ends in a 1-bit mask, so the threshold and matte still matter.",
        ],
      },
    ],
  },
  {
    slug: "how-to-reduce-gif-file-size",
    kind: "guide",
    title: "How to reduce GIF file size without losing the point",
    description:
      "Shrink dimensions, frames, and colors in that order. Dithering is how you spend the colors you kept.",
    updated,
    toolSlug: "gif-maker",
    related: ["how-gif-compression-works", "best-gif-sizes-and-limits"],
    sections: [
      {
        id: "order",
        heading: "Change the expensive things first",
        paragraphs: [
          "GIF size scales with width times height times the number of frames, and then with how badly those frames compress. Cut the long side toward 480 before you touch anything else. A 1080-wide loop is often several times larger for a difference chat windows hide.",
          "Then cut frames. 12 to 15 fps is enough for most loops. Dropping from 30 fps to 15 fps nearly halves the frames. Trim the dead time at the start and end before you lower the frame rate of the part people actually watch.",
        ],
      },
      {
        id: "color",
        heading: "Spend the palette on purpose",
        paragraphs: [
          "A GIF holds at most 256 colors per frame, often fewer if you want a smaller file. Flat illustrations survive 32 or 64 colors. Photos and gradients need more, or they band.",
          "Dithering trades banding for noise. Floyd–Steinberg looks more photographic. Ordered dither looks like a print screen and compresses more predictably. Turn dithering off for flat logos and UI, where the noise is pure waste.",
        ],
      },
      {
        id: "format",
        heading: "Sometimes the GIF should not be a GIF",
        paragraphs: [
          "If the destination plays silent video, MP4 will be smaller and cleaner. WebP can animate with more than 256 colors, but not every chat app accepts it. Use [the format guide](/guides/gif-vs-mp4-vs-webp) before you spend an hour shaving a GIF that should have been a video.",
        ],
      },
    ],
  },
  {
    slug: "gif-vs-mp4-vs-webp",
    kind: "guide",
    title: "GIF vs MP4 vs WebP: which format should you use?",
    description:
      "GIF is universal and inefficient. MP4 is what social apps want. Animated WebP sits in between, when the app allows it.",
    updated,
    toolSlug: "gif-downloader",
    related: ["why-platforms-convert-gifs-to-video", "how-to-reduce-gif-file-size"],
    sections: [
      {
        id: "gif",
        heading: "GIF",
        paragraphs: [
          "GIF is a sequence of paletted images, plus optional 1-bit transparency, looping forever. Every major viewer opens it. The cost is the palette and weak frame compression. Photographs and long loops get large fast.",
          "Choose GIF when you need transparency, a true loop in an old client, or a file extension someone insisted on.",
        ],
      },
      {
        id: "mp4",
        heading: "MP4",
        paragraphs: [
          "An H.264 MP4 of the same frames is usually much smaller and keeps gradients. It has no transparent pixels. X already stores “GIFs” this way. Choose MP4 for social upload, Discord video, and anywhere autoplay video is normal.",
          "If you started from an X post, you already have the MP4. Converting it to GIF is a step backward unless a tool rejects video.",
        ],
      },
      {
        id: "webp",
        heading: "Animated WebP",
        paragraphs: [
          "Animated WebP can use more than 256 colors and can carry real alpha. Browser support is broad now. Chat apps and phone photo libraries are less consistent: some play it, some show the first frame, some refuse the upload.",
          "Gif Downloader’s downloader labels animated WebP when it can detect it, so you do not save a still by mistake. For sharing, GIF or MP4 is still the safer default. Use WebP when you control the page that will display it.",
        ],
      },
    ],
  },
  {
    slug: "how-to-make-a-pet-pet-gif",
    kind: "guide",
    title: "How to make a pet-pet GIF for a Discord emoji",
    description:
      "A short pat loop at 128×128, with a transparent background and a hand that is not a copied sprite.",
    updated,
    toolSlug: "pet-gif-maker",
    related: ["how-to-save-gifs-from-discord", "best-gif-sizes-and-limits"],
    sections: [
      {
        id: "picture",
        heading: "Start with a simple picture",
        paragraphs: [
          "The joke is a hand patting something small: a face, a pet, an icon, an emoji. A full scene becomes mud at emoji size. Crop to a circle or a rounded square so the corners do not alias into the transparency.",
          "[The pet GIF maker](/pet-gif-maker) squashes the picture in time with the hand. If the squish is subtle, raise it until you can see the pat without looking for it.",
        ],
      },
      {
        id: "hand",
        heading: "Use an original hand",
        paragraphs: [
          "The familiar pet-pet sprite sheet is someone else’s art. Gif Downloader draws its own hand, with a few styles and skin tones, plus a flat color if you want a glove. It will not match that other sheet frame for frame, and it should not.",
        ],
      },
      {
        id: "export",
        heading: "Export for Discord",
        paragraphs: [
          "Discord custom emoji display at 128×128. The classic tiny loop is 112×112. Keep the background transparent so the emoji sits on any role color. Aim at the size target in the platform config, 256 KB by default.",
          "Four to eight frames is the whole animation. Extra frames make the file heavier and the pat slower, not funnier.",
        ],
      },
    ],
  },
  {
    slug: "how-to-add-captions-to-a-gif",
    kind: "guide",
    title: "How to add captions and text to a GIF",
    description:
      "Meme text, timed subtitles, and animated type are different jobs. Pick the maker that matches the job.",
    updated,
    toolSlug: "gif-caption-maker",
    related: ["how-to-reduce-gif-file-size", "10-creative-ways-to-use-gifs"],
    sections: [
      {
        id: "which",
        heading: "Pick the kind of text",
        paragraphs: [
          "A shouted setup and punchline belongs in [the meme maker](/gif-meme-maker): white fill, black stroke, usually top and bottom. A conversation belongs in [the caption maker](/gif-caption-maker): bars, overlays, or a speech bubble, each with a start and end.",
          "Words with no clip behind them belong in [the text GIF maker](/text-gif-maker). Do not import a blank video just to use a caption bar.",
        ],
      },
      {
        id: "readability",
        heading: "Make it readable at the real size",
        paragraphs: [
          "Preview at the size you will ship. Text that looks fine at 800 pixels wide fails at 320. Stroke width has to shrink with the font or it fills the letters.",
          "On an overlay, add a shadow or stroke. On a caption bar, the bar is the contrast, so a heavy stroke just looks dirty. Emoji are fine in captions. A paragraph is not. One line, then the next caption.",
        ],
      },
      {
        id: "timing",
        heading: "Time the line to the action",
        paragraphs: [
          "Put the punchline on the frame where the action lands, not on frame 0. Leave a short gap between two speakers so the change is visible.",
          "Typewriter and marquee effects need more frames than a static caption. Cutting those loops to eight frames chops the sentence in half.",
        ],
      },
    ],
  },
  {
    slug: "best-gif-sizes-and-limits",
    kind: "guide",
    title: "Best GIF sizes and limits for every platform",
    description:
      "Discord emoji, Twitch emotes, banners, and the file caps Gif Downloader uses. The numbers come from the platform config.",
    updated,
    toolSlug: "text-gif-maker",
    related: ["how-to-reduce-gif-file-size", "how-to-save-gifs-from-discord"],
    sections: [
      {
        id: "how-to-read",
        heading: "How to use this list",
        paragraphs: [
          "Display size and file size are different limits. A platform can show an emoji at 128 pixels and still reject the upload because the file is too heavy. Match the pixel size first, then cut frames and colors until the file fits.",
          "The table below is rendered from Gif Downloader’s platform config, which is also what the export presets use. If a platform changes a cap, that file is the place to update it.",
        ],
      },
      {
        id: "choices",
        heading: "What to pick",
        paragraphs: [
          "Chat and emoji want the small squares. Stories want the tall 1080×1920 preset, scaled, and they are happier as MP4. Banners want 728×90 or 468×60 and very little text.",
          "X will convert a GIF to video on upload, so the pixel size matters less than keeping the loop short and readable. A huge GIF just gives their encoder more work and you a slower upload.",
        ],
      },
      {
        id: "makers",
        heading: "Inside a maker",
        paragraphs: [
          "Images and GIFs opened for editing are capped at the image limit in the config. Video is capped higher, because a short MP4 is dense. You will get a warning above a few hundred frames rather than a silent tab crash.",
          "The download proxy has its own ceiling, lower than the editor’s video cap, because the file has to cross the network once.",
        ],
      },
    ],
  },
  {
    slug: "a-short-history-of-the-gif",
    kind: "blog",
    title: "A short history of the GIF",
    description:
      "From CompuServe in 1987 to the looping reaction image, and why a format with 256 colors refused to die.",
    updated,
    toolSlug: "gif-maker",
    related: ["jif-or-gif", "why-platforms-convert-gifs-to-video"],
    sections: [
      {
        id: "1987",
        heading: "A picture format that could download",
        paragraphs: [
          "CompuServe introduced the Graphics Interchange Format in 1987. Modems were slow, so GIF used LZW compression and a palette of at most 256 colors. GIF87a came first. GIF89a, in 1989, added the features people now mean by GIF: animation, looping, and a transparent color.",
          "Steve Wilhite led the work. The format was open enough to implement and small enough to pass around on bulletin boards. That combination is why it outlived the company that shipped it.",
        ],
      },
      {
        id: "patent",
        heading: "The patent years",
        paragraphs: [
          "Unisys held a patent on LZW and, in the 1990s, began asking for licenses. That fight is a large part of why PNG exists. PNG is a better still image in almost every technical sense. It did not replace GIF, because PNG did not do the looping cartoon, and because millions of files were already GIFs.",
          "The relevant LZW patents expired in the early 2000s. After that, GIF was simply old, not legally risky to encode. The memes arrived anyway.",
        ],
      },
      {
        id: "now",
        heading: "Why it is still here",
        paragraphs: [
          "Reaction GIFs took a format built for spinning logos and made it a way to talk. Platforms then discovered the file was a terrible way to ship video, and started converting uploads to MP4 while still calling them GIFs in the interface.",
          "The format survives where transparency, a dumb loop, or a fussy client matters. Everything else is quietly a video wearing a GIF’s name. That split is the reason Gif Downloader treats download and convert as different steps.",
        ],
      },
    ],
  },
  {
    slug: "jif-or-gif",
    kind: "blog",
    title: "“Jif” or “GIF”? The pronunciation debate",
    description:
      "The inventor said jif. Dictionaries accept both. The peanut butter joke is older than most of the memes.",
    updated,
    toolSlug: "text-gif-maker",
    related: ["a-short-history-of-the-gif", "why-platforms-convert-gifs-to-video"],
    sections: [
      {
        id: "wilhite",
        heading: "What the inventor said",
        paragraphs: [
          "Steve Wilhite said the word with a soft g, like Jif, the peanut butter. He repeated it in public, including when he accepted a Webby. The line he liked was that the peanut butter brand had already chosen the pronunciation.",
          "That settles authorship. It does not settle English. People pronounce acronyms by the letters they see, and G is a hard letter in “graphics,” which is the G in GIF.",
        ],
      },
      {
        id: "usage",
        heading: "What people actually say",
        paragraphs: [
          "Both pronunciations are widespread. Dictionaries list them as variants. In a room of developers you will hear both, sometimes from the same person on the same day. Correcting a stranger’s vowel is not a useful use of a loop.",
          "Gif Downloader does not pick a side in the interface. The files do not contain a pronunciation.",
        ],
      },
      {
        id: "why-it-stuck",
        heading: "Why the argument stuck",
        paragraphs: [
          "GIF is one of the few file formats civilians say out loud. JPEG became “jay-peg” without a fight. GIF landed on a letter that already had two sounds, and the author took the less obvious one.",
          "If you are writing a caption, “GIF” in capitals dodges the question. If you are saying it, you will be understood either way.",
        ],
      },
    ],
  },
  {
    slug: "why-platforms-convert-gifs-to-video",
    kind: "blog",
    title: "Why social platforms convert GIFs to video",
    description:
      "A GIF is a stack of paletted images. A silent MP4 of the same frames is smaller, sharper, and cheaper to send.",
    updated,
    toolSlug: "twitter-gif-downloader",
    related: ["gif-vs-mp4-vs-webp", "how-gif-compression-works"],
    sections: [
      {
        id: "cost",
        heading: "The file is the wrong shape",
        paragraphs: [
          "GIF compresses each frame mostly as its own image, with a 256-color palette. Similar neighboring frames do not get the kind of motion compensation video codecs use. A three-second reaction can be megabytes as a GIF and a few hundred kilobytes as a silent MP4.",
          "Multiply that by every autoplaying loop in a feed and the GIF becomes an infrastructure problem. Conversion is the fix.",
        ],
      },
      {
        id: "ux",
        heading: "They still call it a GIF",
        paragraphs: [
          "The product name stayed, because that is what people type. X marks the media animated_gif and stores MP4. Other apps do the same under different labels. The viewer loops, has no sound, and no one was asked to learn a new word.",
          "The confusion shows up at download time. People expect a .gif and receive a .mp4. [The X downloader](/twitter-gif-downloader) keeps those as two actions: save the video, or convert if you truly need the old format.",
        ],
      },
      {
        id: "when-gif",
        heading: "When conversion is a loss",
        paragraphs: [
          "MP4 cannot express a transparent pixel the way a GIF can. An emoji or a sticker that has to sit on someone else’s background still wants a GIF, or a format with a real alpha channel if the client supports it.",
          "Conversion can also smear flat colors if the encoder is aimed at photographs. A palette pass on the way back to GIF is there to undo that, not because the MP4 was “more authentic.” The authentic upload, on these platforms, is already gone.",
        ],
      },
    ],
  },
  {
    slug: "the-heart-locket-gif-trend",
    kind: "blog",
    title: "The heart locket GIF trend and how to make your own",
    description:
      "Two photos, a heart that opens, a loop people send to someone specific. How the trend works and how to build one.",
    updated,
    toolSlug: "heart-locket-gif-maker",
    related: ["10-creative-ways-to-use-gifs", "how-to-reduce-gif-file-size"],
    sections: [
      {
        id: "trend",
        heading: "What the loop is doing",
        paragraphs: [
          "The locket starts closed, often with a short line engraved on the metal, then opens. One photo sits on the left, one on the right. Sometimes it closes again and loops. The format fits a pair: friends, a couple, a person and a pet, a parent and a kid.",
          "Most versions you have seen use the same handful of templates. They work because the motion is obvious in a one-inch preview. You do not need the same drawing to get the same read.",
        ],
      },
      {
        id: "make",
        heading: "Make one without copying the art",
        paragraphs: [
          "[The heart locket maker](/heart-locket-gif-maker) draws its own heart, hinge, and chain. You bring two photos you have the right to use. Place each crop by hand. A tight face pairs with a tight face. A tiny full-body shot next to a portrait looks like a mistake.",
          "Presets (Classic Gold, Vintage, Pink Love, Minimal Silver) are starting points. Engraving should be a name or a few words. A sentence will not fit on the cover, and shrinking it until it fits makes it a smudge.",
        ],
      },
      {
        id: "export",
        heading: "Export for the place you will send it",
        paragraphs: [
          "Chat wants a modest square and a short open-hold-close loop. A story wants the tall preset and is often better as MP4. Transparent background is useful if you will composite the locket onto another clip.",
          "Sparkle and a swinging chain are easy to overdo. If the photos are the point, keep the metal quiet.",
        ],
      },
    ],
  },
  {
    slug: "10-creative-ways-to-use-gifs",
    kind: "blog",
    title: "10 creative ways to use GIFs in messages and marketing",
    description:
      "Practical loops: replies, emoji, banners, changelogs, and the few places a GIF still beats a video.",
    updated,
    toolSlug: "gif-maker",
    related: ["best-gif-sizes-and-limits", "how-to-add-captions-to-a-gif"],
    sections: [
      {
        id: "messages",
        heading: "In a conversation",
        paragraphs: [
          "A reaction loop says the tone a period cannot. One specific GIF, made from the actual photo, beats a stock reaction everyone has seen. The beloved frame and the heart locket are that kind of specific.",
          "A pet-pet emoji is a reusable reaction inside one server. A captioned clip answers a repeated question once, then gets pinned. Keep those short enough that they loop while someone is still reading.",
        ],
      },
      {
        id: "marketing",
        heading: "On a page or in a campaign",
        paragraphs: [
          "Use a GIF where you need transparency or a file that plays without a video player: a small product loop in an email client that blocks video, a 728×90 banner, a status beside a changelog.",
          "Do not use a GIF for a 15-second testimonial. That is a video. Do not autoplay a heavy loop below the fold. The format’s reputation for being annoying came from pages that shipped multi-megabyte files for a joke that lasted a second.",
        ],
      },
      {
        id: "list",
        heading: "Ten that are worth making",
        paragraphs: [
          "A one-line text loop for a status. A meme with the punchline timed to the action. A captioned bug repro. A before-and-after with two frames and a long hold. A Discord emoji of a face. A locket for an invitation. A transparent sticker for a story. A banner that marquees a launch date. A beloved frame for a thank-you. A tiny boomerang of a product detail.",
          "Make them at the size they will be seen. A beautiful 1000-pixel loop that gets crushed to 128 pixels was the wrong canvas. The [GIF maker hub](/gif-maker) splits these jobs so you are not fighting a meme template to produce a banner.",
        ],
      },
    ],
  },
  {
    slug: "how-gif-compression-works",
    kind: "blog",
    title: "How GIF compression works (explained simply)",
    description:
      "Palettes, dithering, disposal methods, and why two frames that look alike can still cost you.",
    updated,
    toolSlug: "transparent-gif-maker",
    related: ["how-to-reduce-gif-file-size", "gif-vs-mp4-vs-webp"],
    sections: [
      {
        id: "palette",
        heading: "A palette, not a photograph",
        paragraphs: [
          "Each GIF frame stores an index into a table of at most 256 colors, not a red-green-blue value per pixel. The encoder’s first job is choosing that table. A good table spends its slots on the colors people notice: skin, a logo, the text.",
          "If the table is too small, skies band into stripes. Dithering mixes neighboring palette colors to fake the missing ones. The picture looks better and the file sometimes gets larger, because noise is harder to compress than a flat stripe.",
        ],
      },
      {
        id: "lzw",
        heading: "LZW likes repetition",
        paragraphs: [
          "After the pixels are indexes, LZW compresses repeated sequences. A flat background is cheap. A dithered gradient is expensive. This is why “higher quality” dithering can hurt the file size even when the dimensions stay put.",
          "Transparency is one special index. It is not a fourth channel. Pixels are in or out, which is why edges need a matte instead of a blur.",
        ],
      },
      {
        id: "frames",
        heading: "Frames, disposal, and the lie of “only the changes”",
        paragraphs: [
          "GIF89a can clear the previous frame or leave it and draw the next on top. Encoders use that to store only the rectangle that changed. It helps when a small sprite moves on a still background. It helps less when the whole photograph shifts, because the rectangle is the whole frame.",
          "Camera noise and heavy dithering defeat that trick: every pixel “changed.” Denoise or lower the frame count before you hunt for a cleverer encoder. Video codecs do this job properly. GIF is doing it with the tools of 1989, which is impressive, and also why your three-second loop is 8 MB.",
        ],
      },
    ],
  },
];

export function getArticles(kind: Article["kind"]): Article[] {
  return articles.filter((article) => article.kind === kind);
}

export function getArticle(
  kind: Article["kind"],
  slug: string,
): Article | undefined {
  return articles.find((article) => article.kind === kind && article.slug === slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function readingMinutes(article: Article): number {
  const words = article.sections
    .flatMap((section) => [section.heading, ...section.paragraphs])
    .join(" ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
