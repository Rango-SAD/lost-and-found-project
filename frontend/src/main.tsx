import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import Navbar from "./View/components/navbar/Navbar.tsx";
import {ToastProvider} from "./View/components/ui/ToastProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ToastProvider>
                <Navbar/>
                <App />
            </ToastProvider>
        </BrowserRouter>
    </React.StrictMode>
);
