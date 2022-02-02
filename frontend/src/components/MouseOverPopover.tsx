import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

export default function MouseOverPopover(props: {
	text: string;
	popOverInfo: string | symbol;
}) {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
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
				onClose={handlePopoverClose}
				disableRestoreFocus>
				<Typography sx={{p: 1}}>{props.popOverInfo}</Typography>
			</Popover>
		</div>
	);
}
