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
//just adding a comment to see how the linter works
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
