# DXaaS (Developer Experience as a Service)

## The problem

Many small startups and small technology companies cannot afford dedicated DevOps developers or software engineers with experience in developer experience, or developer tooling. I've worked at small companies where PR's were rejected by the CEO for being messy, or not being formatted correctly, and the developer who wrote them having to spend additional time (and therefor company resources) manually formatting code, not because automatic linting tools don't exist, but because no one on the team had the basic scripting skills or tooling knowledge to set them up.

# The solution

A visual GUI based dashboard for business owners (or privileged developers) to log in to, and configure code quality tooling, view quality metrics, and manage DevOps features by way of an easy to understand dashboard. Everything is configurable by basic drop down menus and checkboxes, no previous experience is needed. Business owners could see a checkbox for "Enable linter", hover over it, be presented with a brief explanation, think "Yeah I want that, that will improve my employees productivity", and click it. They will then have access to a configuration page where they are presented with checks and numerical input fields for the various parameters the linter takes (language specific), where they can not only discover what options are available to them, but configure them at the click of a button. When they are happy, clicking "save" is all that is required, and DXaaS will handle all the rest.

## Key features

 - Beautiful visual UI
 - Connects to an existing or new project (repo)
 - Automatic project parsing and interpretation (determines language, existing styles or processes)
 - Configurable linter
 - Configurable test runner (local/cloud)
 - Configurable (simple) deployment pipeline (to a dedicated server, or to a container registry, etc)
 - Configurable branch management (Branch rules, beta deployment branch, main prod deployment branch, etc)
 - Configurable coding standard enforcement (commenting, commit formats, etc)

## Who would buy it

Small programming teams, startups and small tech companies, looking to improve their efficiency, code quality, and developer experience on the cheap.

## How it would make money

A limited trial version for a short period of time, or for a small project could be offered for free, then business owners could see for themselves if the tooling and automation features really did increase productivity enough to be worth a subscription. At a price of say $40 per month, all it needs to do is save one single developer one hour of their time to pay for itself.

## Possible Project Milestones

Obviously this is completely subject to new ideas and change, just a rough idea of what we could be up against

 - Basic emerald-river project setup
 - Deployment setup for emerald-river project
 - Documentation page for emerald-river project
 - Basic UI Layout
 - Basic REST API
 - Basic DB setup
 - Basic Authentication / login
 - Connecting to an existing project via GitHub API
 - Single language support, detecting if that is the language of the project
 - Installing basic linter tool of corresponding language
 - UI for changing linting rules (language specific)
 - "Save" button to commit changes into repo
 - Code quality report generators (percentage of comments, percentage of newlines, file headers)
 - Basic code quality reporting UI
 - Code quality enforcement hooks (git hooks which abort commit if conditions aren't met)
 - UI for configuring code quality hooks
 - Second language support (linter setup + linting rules, UI, detection)
 - Third language support (linter setup + linting rules, UI, detection)
 - Basic deployment pipelines configuration UI
 - Deployment pipeline for build + scp files to dedicated server
 - Deployment pipeline to build and upload dockerfile to GCP (server-less)
 - Branch management (beta branch for deployment to beta server, etc etc)
 - Branch-specific rules for all the previous features
 - AI based documentation generator (?)
 - Automatic style guide generator (?) (for new hires to see what the conventions are)
 - Version control for configuration (ie a history of diffs of the actual DXaaS config changes)
 - Fourth language support (linter setup + linting rules, UI, detection)
 - Individual framework support (like for react, or magento, or other common frameworks)
 - Fifth language support (linter setup + linting rules, UI, detection)
 - etc etc with the language support (We could stop at just a couple, or if we have time add more and more)
