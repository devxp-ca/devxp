import {createTheme} from "@mui/material/styles";

declare module "@mui/material/styles" {
	interface Theme {
		palette: {
			mode: string;
			primary: {
				main: string;
				//used for the off black/white colors for backgrounds -- SAME FOR BOTH THEMES
				light: string;
				dark: string;
			};
			secondary: {
				main: string;
				//used for the off black/white colors for backgrounds -- OPPOSITE BETWEEN THEMES
				//this allows some things to switch but others to stay the same between themes
				light: string;
				dark: string;
			};
			info: {
				main: string;
				light: string;
				dark: string;
			};
			success: {
				main: string;
				light: string;
				dark: string;
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
			main: "#75DEFF",
			light: "#FFFFFF",
			dark: "#101423"
		},
		info: {
			main: "#80F6E8",
			light: "#80F6E850",
			dark: "#80F6E820"
		},
		success: {
			main: "#A1E561",
			light: "#A1E56150",
			dark: "#10142310"
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
			main: "#4267EB",
			light: "#101423",
			dark: "#FFFFFF"
		},
		info: {
			main: "#3BD6BA",
			light: "#3BD6BA50",
			dark: "#3BD6BA20"
		},
		success: {
			main: "#35E185",
			light: "#35E18550",
			dark: "#35E18510"
		},
		warning: {
			main: "#AF48FF"
		},
		error: {
			main: "#ED538A"
		}
	}
});
