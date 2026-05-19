"use client";
import React, { useContext, useCallback, useState, useEffect } from "react";
import {XCircle, CheckCircle, TriangleAlert, Info} from "lucide-react"
type Props = {
  children: React.ReactNode;
};

type AlertType = "success" | "error" | "warning" | "info" | "none";
type AlertState = {
  show: boolean;
  alertType: AlertType;
  message: string;
};
type contextType = {
  showAlert: (alertType: AlertType, message: string) => void;
};

const AlertContext = React.createContext<contextType | null>(null);

const AlertComponent = ({ children }: Props) => {
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    alertType: "none",
  });

  const showAlert = useCallback((alertType: AlertType, message: string) => {
    setAlert({ show: true, alertType, message });
  }, []);
  useEffect(() => {
    if (alert.show) {
      const timeout = setTimeout(() => {
        setAlert({ show: false, alertType: "none", message: "" });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  });
  const AlertSvg = (alertType:AlertType)=> {
    switch (alertType) {
        case "error":
            return (
                <XCircle className="text-error"/>
            )
        case "success": 
            return (
                <CheckCircle className="text-success"/>
            )
        case "warning":
            return (
                <TriangleAlert className="text-warning"/>
            )
        case "info":
            return (
                <Info className="text-info"/>
            )
        default:
            break;
    }
  }
  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert.show && (
        <div
          role="alert"
          className={`alert alert-${alert.alertType} z-100 fixed right-1/2 min-w-60 translate-x-1/2 top-20 text-sm md:text-md lg:text-md`}
        >
          {AlertSvg(alert.alertType)}
          <span className={`w-full text-${alert.alertType}`}>{alert.message}</span>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within a AlertProvider");
  }
  return context;
};

export default AlertComponent;
