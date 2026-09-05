import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <h1>404</h1>
      <p>Yeh page exist nahi karta.</p>
      <Link to={ROUTES.HOME}>← Go back home</Link>
    </div>
  );
};

export default NotFound;
