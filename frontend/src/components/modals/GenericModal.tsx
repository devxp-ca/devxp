import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {keyframes} from "@mui/system";
import {styled} from "@mui/material";

import plusIcon from "../../assets/plus-icon.png";
import arrowSecondary from "../../assets/arrow-secondary.png";

interface modalProps {
	isOpen: boolean;
	handleClose?: () => void;
	title?: string;
	bodyText?: string;
	children?: JSX.Element | JSX.Element[]; // Can be used for buttons or any other custom element we want on a modal,
	width?: number | string;
	height?: number | string;
	maxHeight?: number | string;
	isSuccess?: boolean;
	dummyModal?: boolean;
}

export default function GenericModal({
	isOpen,
	handleClose,
	title,
	bodyText,
	children,
	width,
	height,
	maxHeight,
	isSuccess = false,
	dummyModal = false
}: modalProps) {
	const modalStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: width ?? 400,
		height: height ?? "auto",
		maxHeight: maxHeight ?? "80vh",
		bgcolor: "secondary.light",
		boxShadow: 24,
		zIndex: 100,
		overflowY: "auto",
		overflowX: "visible",
		"::-webkit-scrollbar": {
			display: "none"
		},
		msOverflowStyle: "none" /* IE and Edge */,
		scrollbarWidth: "none" /* Firefox */
	};

	const dummyModalStyle = {
		bgcolor: "secondary.light",
		boxShadow: 24,
		zIndex: 100,
		marginLeft: "10%",
		marginRight: "10%"
	};

	const titleBoxStyle = {
		textAlign: "center",
		bgcolor: "info.main",
		width: "100%",
		borderRadius: "4px 4px 0px 0px"
	};

	const bodyStyle = {
		width: "100%",
		padding: 2,
		boxSizing: "border-box"
	};

	const successPlusAnimation = () => {
		const particles: JSX.Element[] = [];
		const numPluses = 30;
		for (let i = 0; i < numPluses; i++) {
			const endTop = Math.floor(Math.random() * (50 - 2 + 1)) + 2; //(max - min + 1)) + min
			const endLeft = Math.floor(Math.random() * (90 - 10 + 1)) + 10; //(max - min + 1)) + min
			const delay = Math.random() / 3;

			let explode = keyframes`
	  		0% {
					transform: translate(50vw, 50vh);
					opacity: 1;
				}
			80% {
					opacity: 1;
				}
			100% {
					transform: translate(${endLeft}vw, ${endTop}vh);
					opacity: 0;
				}
			`;

			const PlusParticle = styled("div")({
				backgroundImage: `url(${plusIcon})`,
				backgroundSize: "contain",
				backgroundPosition: "center center",
				backgroundRepeat: "no-repeat",
				width: "32px",
				height: "32px",
				opacity: 0,
				animation: `${explode} 0.8s ease`,
				position: "absolute",
				animationDelay: `${delay}s`
			});

			particles.push(<PlusParticle />);
		}
		return particles;
	};

	const successArrowAnimation = () => {
		const particles: JSX.Element[] = [];
		const numArrows = 2;
		for (let i = 0; i < numArrows; i++) {
			let delay = 0.2;
			let bottom = 10;
			const secondRow = i > 0;
			if (secondRow) {
				delay = 0.6;
				bottom = -40;
			}

			let up = keyframes`
	  		0% {
					opacity: 0;
				}
			30% {
					opacity: 1;
				}
			60% {
					opacity: 1;
				}
			100% {
					transform: translate(0, -40px);
					opacity: 0;
				}
			`;

			let up2 = keyframes`
			0% {
				  opacity: 0;
			  }
			20% {
				opacity: 1;
				}
		  66% {
				  opacity: 1;
				  transform: translate(0, -20px);
			  }
		  100% {
				  opacity: 0;
				  transform: translate(0, -20px);
			  }
		  `;

			const ArrowParticle = styled("div")({
				backgroundImage: `url(${arrowSecondary})`,
				backgroundSize: "contain",
				backgroundPosition: "center center",
				backgroundRepeat: "no-repeat",
				width: "48px",
				height: "48px",
				left: "70vw",
				top: "80vh",
				marginTop: `${bottom}px`,
				opacity: 0,
				animation: `${secondRow ? up2 : up} ${secondRow ? 1.0 : 1.5}s`,
				position: "absolute",
				animationDelay: `${delay}s`
			});

			const ArrowParticle2 = styled("div")({
				backgroundImage: `url(${arrowSecondary})`,
				backgroundSize: "contain",
				backgroundPosition: "center center",
				backgroundRepeat: "no-repeat",
				width: "48px",
				height: "48px",
				right: "70vw",
				top: "80vh",
				marginTop: `${bottom}px`,
				opacity: 0,
				animation: `${secondRow ? up2 : up} ${secondRow ? 1.0 : 1.5}s`,
				position: "absolute",
				animationDelay: `${delay}s`
			});

			particles.push(<ArrowParticle />);
			particles.push(<ArrowParticle2 />);
		}
		return particles;
	};

	return !dummyModal ? (
		<Modal
			sx={{overflowY: "auto", overflowX: "hidden"}}
			open={isOpen}
			onClose={handleClose}>
			<div>
				{isSuccess && successPlusAnimation()}
				<Paper sx={modalStyle}>
					<Box sx={titleBoxStyle}>
						<Typography
							variant="h5"
							component="h2"
							sx={{padding: 2}}
							color="black">
							{title}
						</Typography>
						<IconButton
							aria-label="close"
							onClick={handleClose}
							sx={{
								position: "absolute",
								right: "0",
								top: "0",
								padding: "0",
								margin: "0"
							}}>
							<CloseIcon />
						</IconButton>
					</Box>
					<Box sx={bodyStyle}>
						<Typography sx={{mt: 2}}>{bodyText}</Typography>
						{children}
					</Box>
				</Paper>
				{isSuccess && successArrowAnimation()}
			</div>
		</Modal>
	) : (
		<Paper sx={dummyModalStyle}>
			<Box sx={titleBoxStyle}>
				<Typography
					variant="h6"
					component="h2"
					sx={{padding: 2}}
					color="black">
					{title}
				</Typography>
			</Box>
			<Box sx={bodyStyle}>
				<Typography sx={{mt: 2}}>{bodyText}</Typography>
				{children}
			</Box>
		</Paper>
	);
}
