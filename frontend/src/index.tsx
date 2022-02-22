import React from "react";
import {render} from "react-dom";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Homepage from "./pages/homepage";
import ToolManager from "./pages/toolManager";

render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="/toolManager" element={<ToolManager />} />
		</Routes>
	</BrowserRouter>,
	document.getElementById("root")
);
