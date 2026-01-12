import { TypingGame } from "@/components/TypingGame";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Speed Typing Test – Free Online Typing Speed Test</title>
        <meta
          name="description"
          content="Check your typing speed in WPM, accuracy and performance. Free online typing test by ahriyad."
        />
        <link rel="canonical" href="https://speedtyping.ahriyad.top/" />
      </Helmet>

      <TypingGame />
    </>
  );
};

export default Index;
