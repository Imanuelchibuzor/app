import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./contexts/theme";

function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {children}
      <ModeToggle />
    </ThemeProvider>
  );
}

export default App;
