Some notes:

## Commiting a new file to a repo's branch

```ts
//Get this from the /auth route
//It'll be stored in the frontend cookies
//and likely sent with an HTTP request
const TOKEN = "YOUR_OAUTH_TOKEN HERE";

//ex. brennanwilkes/gcs-radio or emerald-river/startup
const REPO = "GITHUB_USER_NAME/REPO";
const BRANCH = "master"

//This file can already exist, if so it'll be overwritten
const FILENAME = "testing.txt"
//This will be the contents of the file
const FILE_DATA = "This is an API test!"

const COMMIT_MSG = "Testing my API"

//Get a reference to the HEAD pointer
getHead(TOKEN, REPO, BRANCH)
	.then(async head => {

		//Create the new file data on the server
		const blob = await postBlob(TOKEN, REPO, FILE_DATA);

		//Grab the latest commit at the head pointer
		const commit = await getCommitFromUrl(TOKEN, head.url);

		//Grab the tree referenced by the commit
		const tree = await getTreeFromUrl(TOKEN, commit.treeUrl);

		//Create a new tree within that one
		const newTree = await createTree(TOKEN, REPO, tree.sha, {
			path: FILENAME,
			mode: getModeNumber("blob"),
			type: "blob",
			sha: blob.sha,
			url: blob.url
		});

		//Create a new commit referencing the new tree
		const newCommit = await createCommit(
			TOKEN,
			REPO,
			newTree.sha,
			head.sha,
			COMMIT_MSG
		);

		//Update the HEAD pointer to the new commit
		return updateHead(TOKEN, REPO, newCommit.commitSha, BRANCH);
	})
	.then(console.dir)
	.catch(err => console.error(err.response.data));

```

##Where are these methods from?
```ts
import getHead from "./githubapi/getHead";
import getCommitFromUrl from "./githubapi/getCommitFromUrl";
import getTreeFromUrl from "./githubapi/getTreeFromUrl";
import postBlob from "./githubapi/postBlob";
import createTree from "./githubapi/createTree";
import createCommit from "./githubapi/createCommit";
import updateHead from "./githubapi/updateHead";
import {getModeNumber} from "./githubapi/util";
```
