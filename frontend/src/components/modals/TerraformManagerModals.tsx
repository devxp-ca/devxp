import React, {Dispatch} from "react";
import {partialResource, SubmitModalInfoInterface} from "../terraformManager";
import {resourceSettings, terraformDataSettings} from "../terraformOptions";
import AddNewResourceModal from "./AddNewResourceModal";
import CopyRepoSettingsModal from "./CopyRepoSettingsModal";
import CustomizeOrQuickstartModal from "./CustomizeOrQuickstartModal";
import LoadingModal from "./LoadingModal";
import {handleCloseModal} from "./modalHandlers";
import OkCancelModal from "./OkCancelModal";
import OkModal from "./OkModal";
import SubmitTerraformModal from "./SubmitTerraformModal";
import TerraformOptionsModal from "./TerraformOptionsModal";

export default ({
	submitModalIsOpen,
	setSubmitModalIsOpen,
	submitModalInfo,
	setSubmitModalInfo,
	selectedRepo,
	selectedProvider,
	selectedSecureOption,
	selectedAllowSshOption,
	selectedAllowIngressWebOption,
	selectedAllowEgressWebOption,
	selectedAutoLoadBalanceOption,
	trackedResources,
	project,
	setSettingsHaveBeenEdited,
	setCurrentResource,
	setTrackedResources,
	currentResource,
	openOptionsModal,
	setOpenOptionsModal,
	overwriteWarningModalIsOpen,
	setOverwriteWarningModalIsOpen,
	overwriteChoiceModalIsOpen,
	setOverwriteChoiceModalIsOpen,
	setSelectedRepoSavedData,
	tempRepoData,
	previousRepo,
	setSelectedRepo,
	showLoadingModal,
	copyRepoModalIsOpen,
	setCopyRepoModalIsOpen,
	repoList,
	setShowLoadingModal,
	headsUpModalIsOpen,
	setHeadsUpModalIsOpen
}: {
	submitModalIsOpen: boolean;
	setSubmitModalIsOpen: Dispatch<boolean>;
	submitModalInfo: SubmitModalInfoInterface;
	setSubmitModalInfo: Dispatch<SubmitModalInfoInterface>;
	selectedRepo: string;
	selectedProvider: string;
	selectedSecureOption: boolean;
	selectedAllowSshOption: boolean;
	selectedAllowIngressWebOption: boolean;
	selectedAllowEgressWebOption: boolean;
	selectedAutoLoadBalanceOption: boolean;
	trackedResources: resourceSettings[];
	project: string;
	setSettingsHaveBeenEdited: Dispatch<boolean>;
	setCurrentResource: Dispatch<partialResource>;
	setTrackedResources: Dispatch<resourceSettings[]>;
	currentResource: partialResource;
	openOptionsModal: boolean;
	setOpenOptionsModal: Dispatch<boolean>;
	overwriteWarningModalIsOpen: boolean;
	setOverwriteWarningModalIsOpen: Dispatch<boolean>;
	overwriteChoiceModalIsOpen: boolean;
	setOverwriteChoiceModalIsOpen: Dispatch<boolean>;
	setSelectedRepoSavedData: Dispatch<terraformDataSettings | null>;
	tempRepoData: terraformDataSettings | null;
	previousRepo: string;
	setSelectedRepo: Dispatch<string>;
	showLoadingModal: boolean;
	copyRepoModalIsOpen: boolean;
	setCopyRepoModalIsOpen: Dispatch<boolean>;
	repoList: any[];
	setShowLoadingModal: Dispatch<boolean>;
	headsUpModalIsOpen: boolean;
	setHeadsUpModalIsOpen: Dispatch<boolean>;
}) => {
	//Default or customize
	const [openDefaultsModal, setOpenDefaultsModal] = React.useState(false);
	const [nextResource, setNextResource] = React.useState<partialResource>();

	return (
		<>
			<CustomizeOrQuickstartModal
				{...{
					openDefaultsModal,
					setOpenDefaultsModal,
					setCurrentResource,
					nextResource,
					setTrackedResources,
					trackedResources,
					setSettingsHaveBeenEdited
				}}
			/>
			<TerraformOptionsModal
				isOpen={!!openOptionsModal}
				handleClose={() => {
					setCurrentResource(undefined);
					setOpenOptionsModal(false);
				}}
				handleClick={(event: any, value: string) => {
					setOpenDefaultsModal(true);
					setOpenOptionsModal(false);
					setNextResource({
						type: value
					});
				}}
				provider={selectedProvider}
				title={`Choose ${
					/[aeiou]/i.test(selectedProvider[0]) ? "an" : "a"
				} ${
					selectedProvider === "aws"
						? "AWS"
						: selectedProvider.charAt(0).toUpperCase() +
						  selectedProvider.slice(1)
				} Resource`}
			/>
			<AddNewResourceModal
				{...{
					setCurrentResource,
					setTrackedResources,
					trackedResources,
					setSettingsHaveBeenEdited,
					currentResource,
					selectedRepo
				}}
			/>
			<SubmitTerraformModal
				{...{
					submitModalIsOpen,
					setSubmitModalIsOpen,
					submitModalInfo,
					setSubmitModalInfo,
					selectedRepo,
					selectedProvider,
					selectedSecureOption,
					selectedAllowSshOption,
					selectedAllowIngressWebOption,
					selectedAllowEgressWebOption,
					selectedAutoLoadBalanceOption,
					trackedResources,
					project,
					setSettingsHaveBeenEdited
				}}
			/>
			<OkModal
				isOpen={overwriteWarningModalIsOpen}
				handleClose={handleCloseModal(setOverwriteWarningModalIsOpen)}
				title={"Heads up!"}
				bodyText={
					"It looks like you have uncommitted changes.\
							If you select a new repo, your uncommitted changes will be lost.\
							Consider creating a pull request before changing repos."
				}
			/>
			<OkCancelModal
				isOpen={overwriteChoiceModalIsOpen}
				onOk={() => {
					setSelectedRepoSavedData(tempRepoData);
					setSettingsHaveBeenEdited(false);
					setOverwriteChoiceModalIsOpen(false);
				}}
				onCancel={() => {
					setSelectedRepo(previousRepo);
					setOverwriteChoiceModalIsOpen(false);
				}}
				title={"Warning: This repo has saved settings."}
				bodyText={
					"Continuing will overwrite your currently unsaved settings."
				}
			/>
			<LoadingModal
				isOpen={showLoadingModal}
				loadingTitle={"Loading..."}
			/>
			<CopyRepoSettingsModal
				isOpen={copyRepoModalIsOpen}
				handleClose={() => {
					setCopyRepoModalIsOpen(false);
				}}
				repoList={repoList}
				selectedRepo={selectedRepo}
				setShowLoadingModal={setShowLoadingModal}
			/>
			<OkModal
				isOpen={headsUpModalIsOpen}
				handleClose={handleCloseModal(setHeadsUpModalIsOpen)}
				title={"Heads Up!"}
				bodyText={
					"It looks like you have unsubmitted changes. Unsubmitted changes will not be copied to other repos."
				}
			/>
		</>
	);
};
