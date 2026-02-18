import { BrowserRouter, Routes, Route } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { JournalView } from "./components/JournalView";
import { GalleryView } from "./components/GalleryView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/journal" element={<JournalView />} />
        <Route path="/gallery" element={<GalleryView />} />
      </Routes>
    </BrowserRouter>
  );
}