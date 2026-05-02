import photo1 from "@/assets/photo1.jpg";
import photo2 from "@/assets/photo2.jpg";
import photo3 from "@/assets/photo3.jpg";
import photo4 from "@/assets/photo4.jpg";
import portrait from "@/assets/portrait.jpg";

export const BIRTHDAY_NAME = "Stephanie";

export type Spread =
  | { type: "greeting"; title: string; subtitle: string; body: string }
  | { type: "photos"; heading: string; caption: string; images: { src: string; alt: string }[] }
  | { type: "finale"; image: string; alt: string; wish: string; signature: string };

export const spreads: Spread[] = [
  {
    type: "greeting",
    title: "Happy 21st Birthday",
    subtitle: `to my dearest ${BIRTHDAY_NAME}`,
    body:
      "Today the world celebrates the most radiant soul it has ever known. Twenty-one years of laughter, of light, of becoming — and the very best is just beginning. Turn the page, and let the memories unfold…",
  },
  {
    type: "photos",
    heading: "A Year Worth Toasting",
    caption: "More reasons to celebrate with you. Happy birthday, hon!",
    images: [
      { src: photo1, alt: "Calm person and has good heart." },
      { src: photo4, alt: "Moody but loving HAHAHAHA." },
    ],
  },
  {
    type: "photos",
    heading: "Sweet as You Are",
    caption: "Every wish is a chapter of life waiting to be written, and every light is a dream.",
    images: [
      { src: photo2, alt: "Thank you for being part of my life." },
      { src: photo3, alt: "Nonchalant but funny eyy!" },
    ],
  },
  {
    type: "finale",
    image: portrait,
    alt: `Portrait of ${BIRTHDAY_NAME} on her 21st birthday`,
    wish:
      "Here's to you — to the way you light up every room, to the kindness you give without thinking, and to all the beautiful adventures still ahead. May twenty-one be your softest, brightest, most magical year yet. You are loved, endlessly.",
    signature: "I love you hon! Happy birthday! ♥",
  },
];
