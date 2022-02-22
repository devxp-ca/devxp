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

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#679062"
		},
		secondary: {
			main: "#85cb6b"
		}
	}
});
