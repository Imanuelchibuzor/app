import React from "react";
import { Outlet } from "react-router-dom";

import { ThemeProvider } from "./contexts/theme";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import ScrollToTop from "./components/scroll";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <main className="relative flex flex-col min-h-screen p-4">
        <div className="flex-grow flex-1">
          <ScrollToTop />
          <Outlet />
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
