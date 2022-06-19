import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import React, {Dispatch} from "react";
import Resource from "../resources/Resource";
import typeToResource from "../resources/typeToResource";
import {partialResource} from "../managedToolWrapper";
import {resourceSettings} from "../terraformOptions";
import GenericModal from "./GenericModal";

export default ({
	openDefaultsModal,
	setOpenDefaultsModal,
	setCurrentResource,
	nextResource,
	setTrackedResources,
	trackedResources,
	setSettingsHaveBeenEdited
}: {
	openDefaultsModal: boolean;
	setOpenDefaultsModal: Dispatch<boolean>;
	setCurrentResource: Dispatch<partialResource>;
	nextResource: partialResource;
	setTrackedResources: Dispatch<resourceSettings[]>;
	trackedResources: resourceSettings[];
	setSettingsHaveBeenEdited: Dispatch<boolean>;
}) => {
	return (
		<GenericModal
			isOpen={!!openDefaultsModal}
			handleClose={() => {
				setOpenDefaultsModal(false);
			}}
			title="Customize or Quickstart"
			children={
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-evenly"
					}}>
					<Tooltip title="Populate the resource on your own">
						<Button
							sx={{
								":hover": {
									bgcolor: "primary.main",
									opacity: 0.9
								}
							}}
							size="large"
							variant="contained"
							onClick={() => {
								setCurrentResource(nextResource);
								setOpenDefaultsModal(false);
							}}>
							Customize
						</Button>
					</Tooltip>
					<Tooltip title="Populate the resource with default values">
						<Button
							sx={{
								":hover": {
									bgcolor: "primary.main",
									opacity: 0.9
								}
							}}
							size="large"
							variant="contained"
							onClick={() => {
								const resource = typeToResource(
									nextResource,
									true
								) as Resource<unknown, any>;
								resource.populateDefault();
								setTrackedResources([
									...trackedResources,
									resource.getData() as unknown as resourceSettings
								]);
								setOpenDefaultsModal(false);
								setSettingsHaveBeenEdited(true);
							}}>
							Quickstart
						</Button>
					</Tooltip>
				</div>
			}
		/>
	);
};
