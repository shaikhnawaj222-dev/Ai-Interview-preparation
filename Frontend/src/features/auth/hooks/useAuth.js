import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.log(err);
      const errMsg = err.response?.data?.message || "Invalid email or password. Please try again.";
      alert(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.log(err);
      const errMsg = err.response?.data?.message || "Registration failed. Please try again.";
      alert(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.log(err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, [setUser, setLoading]);

  return { user, loading, handleRegister, handleLogin, handleLogout };
};
