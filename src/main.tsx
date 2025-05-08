import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";
import Dashboard from "./pages/Dashboard.tsx";
import Login from "./pages/Login.tsx";
import Reports from "./pages/Reports.tsx";
import StudentManagement from "./pages/StudentManagement.tsx";
import VaccinationDriveManagement from "./pages/VaccinationDriveManagement.tsx";
import { Notifications } from "@mantine/notifications";
import React from "react";
import { getCookie } from "./utils/helper.ts";

const ProtectedRoute: React.FC<any> = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [token, setToken] = React.useState<string | null>(null);
  React.useEffect(() => {
    const token = getCookie("token");
    if (token) {
      setToken(token);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  return token ? children : <Navigate to="/login" />;
};

const theme = createTheme({
  /** Put your mantine theme override here */
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vaccination-drive"
            element={
              <ProtectedRoute>
                <VaccinationDriveManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<>Not found</>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
