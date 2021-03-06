import * as React from "react";

import MUIAccordion from "@mui/material/Accordion";
import MUIAccordionSummary from "@mui/material/AccordionSummary";
import MUIAccordionDetails from "@mui/material/AccordionDetails";

import Typography from "@mui/material/Typography";
import {ThemeProvider} from "@mui/material/styles";
import {lightTheme} from "../style/themes";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//props.content will likely have to be changed some sort of array in order to accommodate fill the accordion with settings
export default function Accordion(props: {
	title: string;
	content: React.ReactNode;
}) {
	return (
		<ThemeProvider theme={lightTheme}>
			<MUIAccordion>
				<MUIAccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header">
					<Typography>{props.title}</Typography>
				</MUIAccordionSummary>
				<MUIAccordionDetails>
					<Typography>{props.content}</Typography>
				</MUIAccordionDetails>
			</MUIAccordion>
		</ThemeProvider>
	);
}
