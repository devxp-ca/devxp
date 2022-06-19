import {Link} from "@mui/material";
import Divider from "@mui/material/Divider";
import React from "react";
export default ({url}: {url: string}) => {
	return (
		<div>
			<div style={{marginBottom: "18px"}}>
				Your changes have been successfully pushed to your repository.
				All you need to do now is merge your{" "}
				<Link href={url} target="_blank">
					Pull Request
				</Link>
			</div>
			<Divider />
			<div style={{marginTop: "18px"}}>
				Please note that you should merge this pull request{" "}
				<span style={{fontWeight: "bolder"}}>before</span> any other
				outstanding DevXP pull requests.
			</div>
		</div>
	);
};
