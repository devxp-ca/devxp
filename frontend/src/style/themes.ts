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
			info: {
				main: string;
			};
			success: {
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
		},
		info: {
			main: "#3d5afe"
		},
		success: {
			main: "#a8e371"
		}
	}
});

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#679062"
		},
		secondary: {
			main: "#85cb6b"
		},
		info: {
			main: "#3d5afe"
		},
		success: {
			main: "#8ee364"
		}
	}
});
