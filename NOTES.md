## Goals
* Share components across projects
* Replace material-ui (more control, material comes with a lot of opinions)
* Fast prototyping
* Style guide

### Notes
Stuff I tried:
* Dynamically requiring components: I had originally built `require` paths dynamically, so that anything in the `src/components` directory would magically appear in the list of components. Since webpack did not know about the require statements ahead of time, it could not know when a module needed to be hot-reloaded. So I traded hot-reloading for dynamic imports
* Generating the `routes.js` file from a script: I attempted to generate the routes based on what was present in the `src/components` dir, but getting it to build every time a change was made would required a separate watch process, since I don't think webpack allows for arbitrary scripts to run on file change. Also, generated code would be stored in version control.

Also:
Airbnb style-guide is way more opinionated than previous versions (used in scope and service-ui). Lots of `eslint` stuff is turned off.

### Questions
Inline styles, stylesheets or a hybrid approach?

https://github.com/Khan/aphrodite

Sass or Less?

Use propTypes or jump straight to flow?
https://github.com/facebook/react/issues/1833#issuecomment-148297807

### Todo
* ~~Component descriptions need to support markdown with syntax highlighting for example code~~
* Split docs into files so that can be served from a static server (instead of webpack-dev-server; we will need these on ~~s3~~ github pages eventually)
* ~~Show the output of callbacks when someone interacts with a component; for example: clicking a button should display what the button callback returns.~~
* ~~Design how the example page will look~~;
* Investigate creating a resolver that will look in the `ui-components` project to allow for easier editing of components to be used in other projects. For example, I am working on something in the `scope` project, but I want to import/edit components directly from `~/ui-components`. 
