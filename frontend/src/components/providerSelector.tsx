import {Link} from "@mui/material";
import React from "react";
import LabelledRadioSelect from "./labelledInputs/LabelledRadioSelect";

export default ({
	disabled,
	onChange,
	initial,
	selectedRepo
}: {
	disabled?: boolean;
	onChange?: (value: string) => void;
	initial?: string;
	selectedRepo?: string;
}) => {
	const [initialInternal, setInitialInternal] = React.useState<
		string | undefined
	>(
		(initial && initial !== "") || !selectedRepo
			? initial
			: localStorage.getItem(`cachedSelectedProvider-${selectedRepo}`)
	);
	React.useEffect(() => {
		if (initial && initial !== "") {
			setInitialInternal(initial);
			if (selectedRepo) {
				localStorage.setItem(
					`cachedSelectedProvider-${selectedRepo}`,
					initial
				);
			}
		}
		console.log(initial, initialInternal);
	}, [initial]);

	return (
		<div
			style={{
				minWidth: "min(500px, 75vw)"
			}}>
			<LabelledRadioSelect
				text="Provider"
				description={
					<div>
						<p>
							Select the provider you have a cloud services
							account with.
						</p>
						<p>
							<Link
								href="https://github.com/devxp-ca/devxp/wiki/Terraform#providers"
								target="_blank"
								rel="noopener">
								Learn more.
							</Link>
						</p>
					</div>
				}
				options={[
					{
						key: "aws",
						label: "Amazon",
						disabled: disabled ?? false
					},
					{
						key: "google",
						label: "Google",
						disabled: disabled ?? false
					},
					{
						key: "azure",
						label: "Azure",
						disabled: true
					}
				]}
				initial={initialInternal}
				onChange={(value: string) => {
					if (onChange) {
						onChange(value);
						if (selectedRepo) {
							localStorage.setItem(
								`cachedSelectedProvider-${selectedRepo}`,
								value
							);
						}
					}
				}}
			/>
		</div>
	);
};
