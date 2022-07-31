import Paper from "@mui/material/Paper";
import React from "react";

export default (props: {children: React.ReactNode}) => {
	return (
		<Paper sx={{boxShadow: 6}}>
			<pre style={{padding: "10px"}}>
				<code>{props.children}</code>
			</pre>
		</Paper>
	);
};
