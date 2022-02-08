### Example model creation

```ts
import { GoogleProvider, NamedGoogleBackend, Terraform } from "./types/terraform";
import { newModel } from "./types/database";

const terraform = new Terraform(new GoogleProvider("source", "version",), new NamedGoogleBackend("bucket", "prefix"));

console.dir(terraform.toModel());
console.dir(terraform.toSchema());


// ... in mongoose connected block

const doc = newModel(terraform); // auto fills in values from above
doc.save();


```