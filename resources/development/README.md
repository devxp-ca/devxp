Just some handy git utilities that individuals may find useful.


```sh
#GIT Aliases (logg, st, p, etc) (repository specific)
curl -Ls 'https://raw.githubusercontent.com/emerald-river/startup/main/resources/development/gitAliases.sh' | sh



#fancy GIT prompt displaying meta data
## NOTE: This will globally configure your prompt via your bashrc file.
##       It can be reverted / removed by commenting out or deleting the lines it adds
##       but if you already have a custom prompt which you like, don't run it

curl -Ls 'https://raw.githubusercontent.com/emerald-river/startup/main/resources/development/gitPrompt.sh' | sh



#IMPORTANT
source ~/.bashrc
```
