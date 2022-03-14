import {Grid} from "@mui/material";
import React from "react";
import LabelledTextInput from "../labelledInputs/LabelledNumberInput";

interface IProps {}
interface IState {}
export default abstract class Resource<Props, State> extends React.Component<
	IProps & Props,
	IState & State
> {
	constructor(props: IProps & Props) {
		super(props);
	}

	componentDidMount() {
		console.dir(this.props);
	}

	render() {
		return (
			<Grid container direction="column">
				<Grid container direction="row">
					<LabelledTextInput
						text="Resouce Name"
						description="Give this resource a specific name"
					/>
				</Grid>
			</Grid>
		);
	}
}
