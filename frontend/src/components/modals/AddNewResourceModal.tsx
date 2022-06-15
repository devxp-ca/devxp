import Grid from "@mui/material/Grid";
import React, {Dispatch} from "react";
import typeToResource from "../resources/typeToResource";
import {partialResource} from "../terraformManager";
import {resourceSettings} from "../terraformOptions";
import GenericModal from "./GenericModal";

export default ({
	setCurrentResource,
	setTrackedResources,
	trackedResources,
	setSettingsHaveBeenEdited,
	currentResource,
	selectedRepo
}: {
	setCurrentResource: Dispatch<partialResource>;
	setTrackedResources: Dispatch<resourceSettings[]>;
	trackedResources: resourceSettings[];
	setSettingsHaveBeenEdited: Dispatch<boolean>;
	currentResource: partialResource;
	selectedRepo: string;
}) => {
	return (
		<GenericModal
			isOpen={!!currentResource}
			handleClose={() => {
				if (
					currentResource &&
					Object.keys(currentResource).length > 1
				) {
					setTrackedResources([
						...trackedResources,
						currentResource as resourceSettings
					]);
				}
				setCurrentResource(undefined);
			}}
			title={`${
				currentResource && Object.keys(currentResource).length > 1
					? "Edit"
					: "Add New"
			} ${
				(currentResource
					? typeToResource(currentResource, true)?.props?.resource
					: undefined) ?? "Resource"
			}`}
			children={
				currentResource && (
					<Grid
						container
						direction="column"
						alignItems="center"
						sx={{
							"& > div": {width: "90%"}
						}}>
						{
							typeToResource(
								{
									...currentResource,
									repo: selectedRepo ?? "",
									isModifying:
										Object.keys(currentResource).length > 1,
									onSave: (
										data: resourceSettings & {
											resources: number;
										}
									) => {
										let newResources: resourceSettings[] =
											[];
										for (
											let i = 0;
											i < data.resources;
											i++
										) {
											newResources = [
												...newResources,
												data.resources > 1
													? {
															...data,
															id: `${
																data.id
															}-${String.fromCharCode(
																97 + i
															)}`
													  }
													: data
											];
										}

										setTrackedResources([
											...newResources,
											...trackedResources
										]);
										setCurrentResource(undefined);
										setSettingsHaveBeenEdited(true);
									},
									onDelete: () => {
										setCurrentResource(undefined);
										setSettingsHaveBeenEdited(true);
									},
									onChange: () => {
										setSettingsHaveBeenEdited(true);
									}
								},
								false
							) as React.ReactElement
						}
					</Grid>
				)
			}
			width="90vw"
		/>
	);
};
