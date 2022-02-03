import React from "react";
import {render} from "react-dom";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Homepage from "./pages/homepage";
import Wizard from "./pages/wizard";

render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="/wizard" element={<Wizard />} />
		</Routes>
	</BrowserRouter>,
	document.getElementById("root")
);
