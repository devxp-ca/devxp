import React from "react";
import {render} from "react-dom";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Homepage from "./pages/homepage";

render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Homepage />} />
		</Routes>
	</BrowserRouter>,
	document.getElementById("root")
);
