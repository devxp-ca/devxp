import * as React from "react";
import { Accordion as MUIAccordion, AccordionSummary as MUIAccordionSummary, AccordionDetails as MUIAccordionDetails} from "@mui/material";
import Typography from "@mui/material/Typography";
import {ThemeProvider} from "@mui/material/styles";
import {lightTheme} from "../lightTheme";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//props.content will likely have to be changed some sort of array in order to accommodate fill the accordion with settings
export default function Accordion(props: {
        title: string;
        content: string | symbol;
    })  {
	return (
		<ThemeProvider theme={lightTheme}>
			<MUIAccordion>
                <MUIAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                    <Typography>{props.title}</Typography>
                </MUIAccordionSummary>
                <MUIAccordionDetails>
                    <Typography>
                        {props.content}
                    </Typography>
                </MUIAccordionDetails>
            </MUIAccordion>
		</ThemeProvider>
	);
}