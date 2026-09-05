import React from "react";
import { APP_NAME } from "../../constants";

const Footer: React.FC = () => {
  return <footer className="footer">© {new Date().getFullYear()} {APP_NAME} <span>•</span> Built for better milk business</footer>;
};

export default Footer;
