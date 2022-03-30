/*
 * highlight.js terraform syntax highlighting definition
 *
 * @see https://github.com/highlightjs/highlight.js
 *
 * :TODO:
 *
 * @package: highlightjs-terraform
 * @author:  Nikos Tsirmirakis <nikos.tsirmirakis@winopsdba.com>
 * @since:   2019-03-20
 *
 * Description: Terraform (HCL) language definition
 * Category: scripting
 */
import hljsImport from "highlight.js";

export default () => {
	hljsImport.registerLanguage("terraform", hljsDefineTerraform);
};

const hljsDefineTerraform = (hljs: any = hljsImport) => {
	var NUMBERS = {
		className: "number",
		begin: "\\b\\d+(\\.\\d+)?",
		relevance: 0
	};
	var STRINGS = {
		className: "string",
		begin: '"',
		end: '"',
		contains: [
			{
				className: "variable",
				begin: "\\${",
				end: "\\}",
				relevance: 9,
				contains: [
					{
						className: "string",
						begin: '"',
						end: '"'
					},
					{
						className: "meta",
						begin: "[A-Za-z_0-9]*" + "\\(",
						end: "\\)",
						contains: [
							NUMBERS,
							{
								className: "string",
								begin: '"',
								end: '"',
								contains: [
									{
										className: "variable",
										begin: "\\${",
										end: "\\}",
										contains: [
											{
												className: "string",
												begin: '"',
												end: '"',
												contains: [
													{
														className: "variable",
														begin: "\\${",
														end: "\\}"
													}
												]
											},
											{
												className: "meta",
												begin: "[A-Za-z_0-9]*" + "\\(",
												end: "\\)"
											}
										]
									}
								]
							},
							"self"
						]
					}
				]
			}
		]
	};

	return {
		aliases: ["tf", "hcl"],
		keywords:
			"resource variable provider output locals module data terraform|10",
		literal: "false true null",
		contains: [hljs.COMMENT("\\#", "$"), NUMBERS, STRINGS]
	};
};

export const definer = hljsDefineTerraform;
