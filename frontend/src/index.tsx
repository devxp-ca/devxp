import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Homepage from "./pages/homepage";
import ToolManager from "./pages/toolManager";
import AboutPage from "./pages/aboutpage";
import NewsPage from "./pages/newspage";
import NextSteps from "./pages/nextsteps";
import "./style/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="/toolManager" element={<ToolManager />} />
			<Route path="/about" element={<AboutPage />} />
			<Route path="/news" element={<NewsPage />} />
			<Route path="/next" element={<NextSteps />} />
		</Routes>
	</BrowserRouter>
);
