import * as React from "react";
import {Stack} from "@mui/material";
import Link from "@mui/material/Link";

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
						description={
							<div>
								<p>
									Whether or not to:
									<ul>
										<li>
											put your configured resources into
											their own VPC,
										</li>
										<li>setup a subnet, and</li>
										<li>
											give them permissions to access each
											other.
										</li>
									</ul>
									Please note that there are additional costs
									associated with setting up a VPC for your
									resources, but it is considered best
									practice for the security of your projects.
								</p>
								<Link
									href="https://github.com/devxp-ca/devxp/wiki/Tool-Manager-Configuration#secure"
									target="_blank"
									rel="noopener">
									Learn more.
								</Link>
							</div>
						}
						initial={selectedSecureOption}
						onChange={(val: boolean) => {
							setSelectedSecureOption(val);
							setSettingsHaveBeenEdited(true);
						}}
					/>
					<LabelledCheckboxInput
						text="Allow SSH Connection"
						description={
							<div>
								<p>
									Enabling this option allows the user to set
									up an SSH connection with the configured
									resources on port 22.
								</p>
								<p>
									If you do not need this functionality, it is
									more secure to leave it unchecked.
								</p>
								<Link
									href="https://github.com/devxp-ca/devxp/wiki/Tool-Manager-Configuration#ssh"
									target="_blank"
									rel="noopener">
									Learn more.
								</Link>
							</div>
						}
						initial={selectedAllowSshOption}
						onChange={(val: boolean) => {
							setSelectedAllowSshOption(val);
							setSettingsHaveBeenEdited(true);
						}}
						disabled={!selectedSecureOption}
					/>
					<LabelledCheckboxInput
						text="Allow Inbound Web Traffic"
						description={
							<div>
								<p>
									Opens ports 443 and 80 inbound to the VPC
									via the network gateway.
								</p>
								<p>
									Suppose you decide to run a web server, this
									option allows outside entities to make
									requests to it.
								</p>
								<p>
									If you do not need this functionality, it is
									more secure to leave it unchecked.
								</p>
								<Link
									href="https://github.com/devxp-ca/devxp/wiki/Tool-Manager-Configuration#inbound-web-traffic"
									target="_blank"
									rel="noopener">
									Learn more.
								</Link>
							</div>
						}
						initial={selectedAllowIngressWebOption}
						onChange={(val: boolean) => {
							setSelectedAllowIngressWebOption(val);
							setSettingsHaveBeenEdited(true);
						}}
						disabled={!selectedSecureOption}
					/>
					<LabelledCheckboxInput
						text="Allow Outbound Web Traffic"
						description={
							<div>
								<p>
									Opens ports 443 and 80 outbound from the VPC
									via the network gateway.
								</p>
								<p>
									This means your resources can access the
									internet (e.g. for software updates).
								</p>
								<p>
									If you do not need this functionality, it is
									more secure to leave it unchecked.
								</p>
								<Link
									href="https://github.com/devxp-ca/devxp/wiki/Tool-Manager-Configuration#outbound-web-traffic"
									target="_blank"
									rel="noopener">
									Learn more.
								</Link>
							</div>
						}
						initial={selectedAllowEgressWebOption}
						onChange={(val: boolean) => {
							setSelectedAllowEgressWebOption(val);
							setSettingsHaveBeenEdited(true);
						}}
						disabled={!selectedSecureOption}
					/>
					<LabelledCheckboxInput
						text="Enable Network Load Balancing"
						description={
							<div>
								<p>
									This allows requests to go to a single
									service (that is, the load balancer) where
									they are distributed across your compute
									instances (e.g. EC2).
								</p>
								<p>
									Please note that there are additional costs
									associated with enabling network load
									balancing, and it may not be necessary
									unless your system receives a high rate of
									requests.
								</p>
								<Link
									href="https://github.com/devxp-ca/devxp/wiki/Tool-Manager-Configuration#network-load-balancing"
									target="_blank"
									rel="noopener">
									Learn more.
								</Link>
							</div>
						}
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
