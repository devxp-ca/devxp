import * as React from "react";
import {styled, useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import {lightTheme} from "../style/themes";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

const DrawerHeader = styled("div")(({theme}) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: "center"
}));

export interface GithubRepo {
	name: string;
	full_name: string;
}

/** a functional component that returns a drawer which is anchored on the left of the screen */
export default function PersistentDrawer(props: {
	repos: GithubRepo[];
	shareRepo: (repo_full_name: string) => void;
	handleChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}) {
	const theme = useTheme();
	const [value, setValue] = React.useState("false");

	const setSelectedRepo = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value);
		props.shareRepo(event.target.value);
	};

	return (
		<ThemeProvider theme={lightTheme}>
			<Drawer
				variant="persistent"
				anchor="left"
				open={true}
				sx={{
					width: 240,
					flexShrink: 0,
					"& .MuiDrawer-paper": {width: 240, boxSizing: "border-box"}
				}}>
				<DrawerHeader>
					<Typography variant="h6">Repositories</Typography>
				</DrawerHeader>
				<Divider />
				{props.repos.map((repo: GithubRepo) => (
					<Box>
						<FormControl required={true}>
							<RadioGroup
								aria-labelledby="Repository List"
								name="Repository List"
								value={value}
								onChange={setSelectedRepo}
								row={true}>
								<FormControlLabel
									value={repo.full_name}
									control={
										<Radio
											size="small"
											sx={{padding: 1, ml: 3}}
										/>
									}
									label={repo.name}
								/>
							</RadioGroup>
						</FormControl>
						<Divider />
					</Box>
				))}
			</Drawer>
		</ThemeProvider>
	);
}
