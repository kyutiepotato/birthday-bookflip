import { useEffect } from "react";
import Flipbook from "@/components/book/Flipbook";
import { BIRTHDAY_NAME } from "@/data/book";

const Index = () => {
  useEffect(() => {
    document.title = `Happy 21st Birthday, ${BIRTHDAY_NAME} — A Keepsake Book`;
    const desc = `An interactive flipbook birthday greeting for ${BIRTHDAY_NAME}'s 21st — turn the pages to relive memories and read a heartfelt wish.`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  return (
    <main>
      <h1 className="sr-only">Happy 21st Birthday, {BIRTHDAY_NAME} — A Keepsake Flipbook</h1>
      <Flipbook />
    </main>
  );
};

export default Index;
