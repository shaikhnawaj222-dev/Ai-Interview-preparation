import "../auth.form.css";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-card">
          <div className="loading-spinner" />
          <h1>Checking authentication</h1>
          <p>Loading your user session securely.</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default Protected;
