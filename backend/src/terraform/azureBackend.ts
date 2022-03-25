import {model} from "mongoose";
import CONFIG from "../config";
import {DatabaseModel, generateSchema} from "../types/database";
import {AzureBackend, named} from "../types/terraform";
import {resourceTypes} from "../validators/resourceValidator";
import {generateId, removeName} from "./util";

export interface NamedAzureBackend extends named<AzureBackend, "azurerm"> {}
export class NamedAzureBackend implements DatabaseModel<NamedAzureBackend> {
	name: "azurerm";
	constructor();
	constructor(
		resource_group_name = `tfstate`,
		storage_account_name = `tfstate${generateId(15)}`,
		container_name = `tfstate`,
		key = "prof.terraform.tfstate",
		location = "westus"
	) {
		this.name = "azurerm";
		this.resource_group_name = resource_group_name;
		this.storage_account_name = storage_account_name;
		this.container_name = container_name;
		this.key = key;
		this.location = location;
	}
	toSchema() {
		return generateSchema<NamedAzureBackend>(this);
	}
	toModel() {
		return model("AzureBackend", this.toSchema());
	}

	toResource() {
		const resources: any = [
			{azurerm_resource_group: [{}]},
			{azurerm_storage_account: [{}]},
			{azurerm_storage_container: [{}]}
		];
		resources[0].azurerm_resource_group[0]["tfstate"] = [
			{
				name: this.resource_group_name,
				location: this.location
			}
		];
		resources[1].azurerm_storage_account[0]["tfstate"] = [
			{
				name: this.storage_account_name,
				resource_group_name: this.resource_group_name,
				location: this.location,
				account_tier: "Standard",
				account_replication_type: "LRS",
				depends_on: [`azurerm_resource_group.tfstate`]
			}
		];
		resources[2].azurerm_storage_container[0]["tfstate"] = [
			{
				name: this.container_name,
				storage_account_name: this.storage_account_name,
				container_access_type: "blob",
				depends_on: [
					`azurerm_resource_group.tfstate`,
					`azurerm_storage_account.tfstate`
				]
			}
		];
		return resources;
	}

	toJSON() {
		return {
			azurerm: [removeName(this)].map(a => ({
				resource_group_name: a.resource_group_name,
				storage_account_name: a.storage_account_name,
				container_name: a.container_name,
				location: a.location
			}))
		};
	}
}
