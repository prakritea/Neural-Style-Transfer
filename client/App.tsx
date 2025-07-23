// import "./global.css";

// import { Toaster } from "@/components/ui/toaster";
// import { createRoot } from "react-dom/client";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ThemeProvider } from "next-themes";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import HowItWorks from "./pages/HowItWorks";
// import Pricing from "./pages/Pricing";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//         <ThemeProvider
//       attribute="class"
//       defaultTheme="light"
//       enableSystem
//       disableTransitionOnChange
//     >
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//                     <Routes>
//             <Route path="/" element={<Index />} />
//             <Route path="/how-it-works" element={<HowItWorks />} />
//             <Route path="/pricing" element={<Pricing />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<SignUp />} />
//             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </ThemeProvider>
//   </QueryClientProvider>
// );

// createRoot(document.getElementById("root")!).render(<App />);







import { useState } from "react";
import { Button } from "@/components/ui/button"; // assuming you use shadcn/ui
import { Label } from "@/components/ui/label";

export default function Index() {
  const [contentImage, setContentImage] = useState<File | null>(null);
  const [styleImage, setStyleImage] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!contentImage || !styleImage) {
      alert("Please upload both images.");
      return;
    }

    const formData = new FormData();
    formData.append("content", contentImage);
    formData.append("style", styleImage);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/stylize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Stylization failed");

      const data = await response.json();
      setResultImage(data.image);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-8">🎨 Artisan Studio</h1>

      <div className="w-full max-w-md space-y-4">
        <div>
          <Label htmlFor="content">Upload Your Image</Label>
          <input
            type="file"
            id="content"
            accept="image/*"
            onChange={(e) => setContentImage(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <Label htmlFor="style">Upload Style Image</Label>
          <input
            type="file"
            id="style"
            accept="image/*"
            onChange={(e) => setStyleImage(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {resultImage && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Result:</h2>
          <img
            src={resultImage}
            alt="Stylized Output"
            className="rounded shadow max-w-full"
          />
        </div>
      )}
    </div>
  );
}
