#!/bin/sh

[ -z "$1" ] && {
	[ -f "$HOME/.bash_profile" ] && {
		BASHFILE="$HOME/.bash_profile"
	} || {
		BASHFILE="$HOME/.bashrc"
	}
} || {
	BASHFILE="$1"
}

curl -Ls 'https://raw.githubusercontent.com/brennanwilkes/dev-setup/main/.git-prompt.sh' > ~/.git-prompt.sh

addToFile(){
	file="${1:-${BASHFILE}}"
	read line
	grep -qxF "$line" "$file" || echo "$line" >> "$file"
}

#Honestly it works when I do it this way so Im gonna move on
wrappedGrep(){
	file="${1:-${BASHFILE}}"
	read line
	grep -qxF "$line" "$file" >/dev/null
	exit $?
}

header='############### Custom GIT prompt ###############'
grep -qxF "$header" "$BASHFILE" || echo "\n$header" >> "$BASHFILE"
echo 'force_color_prompt=yes' | addToFile
echo 'color_prompt=yes' | addToFile
echo 'export GIT_PS1_SHOWDIRTYSTATE=1' | addToFile
echo 'export GIT_PS1_SHOWSTASHSTATE=1' | addToFile
echo 'export GIT_PS1_SHOWUNTRACKEDFILES=1' | addToFile
echo 'export GIT_PS1_SHOWUPSTREAM="auto"' | addToFile
echo 'export GIT_PS1_SHOWCOLORHINTS=1' | addToFile
echo '. ~/.git-prompt.sh' | addToFile

#Haha look at this quoting
echo PROMPT_COMMAND=\\\'__git_ps1\\\ \\\"\\\$\\\{debian_chroot:+\\\(\\\$debian_chroot\\\)\\\}\\\\\\\[\\\\\\\\033\\\[01\\\;32m\\\\\\\]\\\\\\\\u@\\\\\\\\h\\\\\\\[\\\\\\\\033\\\[00m\\\\\\\]:\\\\\\\[\\\\\\\\033\\\[01\\\;34m\\\\\\\]\\\\\\\\w\\\\\\\[\\\\\\\\033\\\[00m\\\\\\\]\\\"\\\ \\\"\\\\\\\[\\\\\\\\033\\\[00m\\\\\\\]\\\\\\\$\\\ \\\"\\\ \\\' | wrappedGrep || echo PROMPT_COMMAND=\'__git_ps1\ \"\$\{debian_chroot:+\(\$debian_chroot\)\}\\\[\\\\033\[01\;32m\\\]\\\\u@\\\\h\\\[\\\\033\[00m\\\]:\\\[\\\\033\[01\;34m\\\]\\\\w\\\[\\\\033\[00m\\\]\"\ \"\\\[\\\\033\[00m\\\]\\\$\ \"\ \'  >> "$BASHFILE"
