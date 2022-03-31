import * as React from "react";
import IconButton from "@mui/material/IconButton";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import {darkTheme} from "./themes";
import Tooltip from "@mui/material/Tooltip";

function ThemeButton(props: {handleClick: (theme: any) => void; theme: any}) {
	return (
		<Tooltip title="Toggle Theme">
			<IconButton
				sx={{ml: 1}}
				onClick={props.handleClick}
				color="inherit">
				{props.theme === darkTheme ? (
					<LightModeIcon />
				) : (
					<DarkModeIcon />
				)}
			</IconButton>
		</Tooltip>
	);
}

export default ThemeButton;
