import * as React from "react";
import {Typography, Stack} from "@mui/material";
import MuiLink from "@mui/material/Link";

import GenericModal from "./GenericModal";
import LabelledCheckboxInput from "../labelledInputs/LabelledCheckboxInput";

interface modalProps {
	isOpen: boolean;
	handleClose: () => void;
	title?: string;
	handleClick: (event: any, value: any) => void;
	selectedProvider: string;
	selectedSecureOption: boolean;
	setSelectedSecureOption: (val: boolean) => void;
	settingsHaveBeenEdited: boolean;
	setSettingsHaveBeenEdited: (val: boolean) => void;
	selectedAllowSshOption: boolean;
	setSelectedAllowSshOption: (val: boolean) => void;
	selectedAllowIngressWebOption: boolean;
	setSelectedAllowIngressWebOption: (val: boolean) => void;
	selectedAllowEgressWebOption: boolean;
	setSelectedAllowEgressWebOption: (val: boolean) => void;
	selectedAutoLoadBalanceOption: boolean;
	setSelectedAutoLoadBalanceOption: (val: boolean) => void;
}

export default function AdvancedOptionsModal({
	isOpen,
	handleClose,
	title,
	handleClick,
	selectedProvider,
	selectedSecureOption,
	setSelectedSecureOption,
	settingsHaveBeenEdited,
	setSettingsHaveBeenEdited,
	selectedAllowSshOption,
	setSelectedAllowSshOption,
	selectedAllowIngressWebOption,
	setSelectedAllowIngressWebOption,
	selectedAllowEgressWebOption,
	setSelectedAllowEgressWebOption,
	selectedAutoLoadBalanceOption,
	setSelectedAutoLoadBalanceOption
}: modalProps) {
	//TODO: disable other options if secure option is not selected

	return (
		<div>
			<GenericModal
				isOpen={isOpen}
				handleClose={handleClose}
				width="50vw"
				title={title || ""}>
				<Stack
					spacing={2}
					direction="column"
					alignItems="stretch"
					justifyContent="center">
					<LabelledCheckboxInput
						text="Enable VPC"
						description="Whether or not to put all the configured resources into their own VPC, setup a subnet, and give them IAM permissions to access each other."
						initial={selectedSecureOption}
						onChange={(val: boolean) => {
							setSelectedSecureOption(val);
							setSettingsHaveBeenEdited(true);
						}}
					/>
					<LabelledCheckboxInput
						text="Enable SSH"
						description="Opens up port 22 for ssh access."
						initial={selectedAllowSshOption}
						onChange={(val: boolean) => {
							setSelectedAllowSshOption(val);
							setSettingsHaveBeenEdited(true);
						}}
						disabled={!selectedSecureOption}
					/>
					<LabelledCheckboxInput
						text="Enable Inbound Web Traffic"
						description="Opens up ports 443 and 80 for web traffic."
						initial={selectedAllowIngressWebOption}
						onChange={(val: boolean) => {
							setSelectedAllowIngressWebOption(val);
							setSettingsHaveBeenEdited(true);
						}}
						disabled={!selectedSecureOption}
					/>
					<LabelledCheckboxInput
						text="Enable Outbound Web Traffic"
						description="Opens up ports 443 and 80 for software updates, web requests, etc."
						initial={selectedAllowEgressWebOption}
						onChange={(val: boolean) => {
							setSelectedAllowEgressWebOption(val);
							setSettingsHaveBeenEdited(true);
						}}
						disabled={!selectedSecureOption}
					/>
					<LabelledCheckboxInput
						text="Enable Network Load Balancing"
						description="Spins up a network load balancer within your VPC, connected to all ec2 instances."
						initial={selectedAutoLoadBalanceOption}
						onChange={(val: boolean) => {
							setSelectedAutoLoadBalanceOption(val);
							setSettingsHaveBeenEdited(true);
						}}
						disabled={!selectedSecureOption}
					/>
				</Stack>
			</GenericModal>
		</div>
	);
}
