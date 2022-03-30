import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

export default function MouseOverPopover(props: {
	text?: React.ReactNode;
	icon?: JSX.Element;
	popOverInfo: JSX.Element;
}) {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const [savedAnchorEl, setSavedAnchorEl] =
		React.useState<HTMLElement | null>(null);

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		setSavedAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const handleMouseEnter = () => {
		setAnchorEl(savedAnchorEl);
	};

	const handleMouseLeave = () => {
		setAnchorEl(null);
		setSavedAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return (
		<div>
			<Typography
				aria-owns={open ? "mouse-over-popover" : undefined}
				aria-haspopup="true"
				onMouseEnter={handlePopoverOpen}
				onMouseLeave={handlePopoverClose}>
				{props.text}
				{props.icon}
			</Typography>
			<Popover
				id="mouse-over-popover"
				sx={{
					pointerEvents: "none"
				}}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				classes={{
					paper: "pointerEvents: auto"
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
				PaperProps={{
					onMouseEnter: handleMouseEnter,
					onMouseLeave: handleMouseLeave,
					sx: {
						pointerEvents: "auto"
					}
				}}>
				<Typography
					component="span"
					sx={{
						p: 1,
						display: "block"
					}}>
					{props.popOverInfo}
				</Typography>
			</Popover>
		</div>
	);
}
