import {mongoose} from "./connection";
const {Schema} = mongoose;

const toolSchema = new Schema({
	name: String,
	settings: {
		temp: Number
	}
});

export const repoSchema = new Schema({
	repo: String,
	tools: [toolSchema]
});

export const testSchema = new Schema({
	test: String
});

export const Test = mongoose.model("Test", testSchema);
// const testVals = Test.find();
// console.log(testVals)

// const temp = new Test({ test: "KJFSD:IJSDF" });

// temp.save()

// console.log(temp)
