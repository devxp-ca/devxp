import {createTheme} from "@mui/material/styles";

declare module "@mui/material/styles" {
	interface Theme {
		palette: {
			mode: string;
			primary: {
				main: string;
			};
			secondary: {
				main: string;
			};
		};
	}
}

export const lightTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#6bb8ff"
		},
		secondary: {
			main: "#3d5afe"
		}
	}
});
