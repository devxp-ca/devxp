import {createTheme} from "@mui/material/styles";

declare module "@mui/material/styles" {
	interface Theme {
		palette: {
			mode: string;
			primary: {
				main: string;
				//used for the off black/white colors for backgrounds
				light: string;
				dark: string;
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
			warning: {
				main: string;
			};
			error: {
				main: string;
			};
		};
	}
}

export const lightTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#4DACFF",
			light: "#FFFFFF",
			dark: "#101423"
		},
		secondary: {
			main: "#75DEFF"
		},
		info: {
			main: "#80F6E8"
		},
		success: {
			main: "#A1E561"
		},
		warning: {
			main: "#FFB74D"
		},
		error: {
			main: "#E57373"
		}
	}
});

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#4DACFF",
			light: "#FFFFFF",
			dark: "#101423"
		},
		secondary: {
			main: "#4267EB"
		},
		info: {
			main: "#3BD6BA"
		},
		success: {
			main: "#35E185"
		},
		warning: {
			main: "#AF48FF"
		},
		error: {
			main: "#ED538A"
		}
	}
});
