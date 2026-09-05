import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AppProvider } from "./context/AppContext";

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter basename="/DariyApp">
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
