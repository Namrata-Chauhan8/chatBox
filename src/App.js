import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./Style.scss";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const currentUser = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      <Navigate to="/login" />;
    }
    return children
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
