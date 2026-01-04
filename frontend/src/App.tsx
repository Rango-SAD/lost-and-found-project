import { Routes, Route } from "react-router-dom";
import { PostsPage } from "./View/pages/PostsPage";

export default function App() {
    return (
        <Routes>
            {/* Your page */}
            <Route path="/posts" element={<PostsPage />} />

            {/* They will handle the rest */}
        </Routes>
    );
}
