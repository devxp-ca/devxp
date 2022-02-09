## Typedoc - Document Generation for Typescript

In order to generate documentation for our codebase, go to either the frontend or backend directories and run ```npx typedoc``` or ```npm run typedoc```.

NOTE: As of now, there are tsc compiler errors in the frontend project. This is because the typescript compiler does not like tsx files, so if we care enough, we will need to determine a way to run typedoc on the tsx files after they are translated to plain ts files.

Running the typedoc command will generate a ```docs``` directory under the current directory (i.e. frontend or backend). This ```docs``` directory is not tracked by git, so you will need to run the typedoc command whenever you want to view the up-to-date documentation (we can change this if we want).

NOTE: typedoc only generates documentation for things that are exported.

Typedoc comments are fairly similar to the typical JSDoc and similar documentation formats. Comments are started with ```/**``` and ended with ```*/```.

To learn about the syntax for the comments, check out [this typedoc page](https://typedoc.org/guides/doccomments/)