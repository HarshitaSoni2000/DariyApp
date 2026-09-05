import React, { ReactNode } from "react";
import Header, { Sidebar } from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  return (
    <div className={`app-shell ${isSidebarOpen ? "sidebar-is-open" : ""}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setIsSidebarOpen(false)} />}
      <div className="app-shell__main">
        <Header isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(open => !open)} />
        <main className="main-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
