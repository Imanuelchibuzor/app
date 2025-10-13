import React from "react";
import { Outlet } from "react-router-dom";

import { ThemeProvider } from "./contexts/theme";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import ScrollToTop from "./components/scroll";
import AuthProvider from "./contexts/auth";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Header />
        <main className="relative min-h-screen flex flex-col max-w-7xl mx-auto px-4 py-8">
          <div className="flex-grow flex-1">
            <ScrollToTop />
            <Outlet />
          </div>
        </main>
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
