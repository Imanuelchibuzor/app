import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

import { ThemeProvider } from "./contexts/theme";
import AuthProvider from "./contexts/auth";
import AppProvider from "./contexts/app";
import ScrollToTop from "./components/scroll";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppProvider>
          <Toaster richColors position="top-center" duration={4000} />
          <Header />
          <main className="relative min-h-screen flex flex-col max-w-7xl mx-auto px-4 py-8">
            <div className="flex-grow flex-1">
              <ScrollToTop />
              <Outlet />
            </div>
          </main>
          <Footer />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
