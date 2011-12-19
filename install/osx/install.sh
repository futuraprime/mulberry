#!/bin/bash
# install.sh: Installation script for OSX
PACKAGES='git chromedriver'

RVMFILE=$(which rvm)
RUBYFILE=$(which ruby)
BREWFILE=$(which brew)
GEMFILE=$(which gem)
JAVAFILE=$(which java)
ANTFILE=$(which ant)
ANDROIDFILE=$(which android)

function check_or_install() {
	FILELOCATION=$(which $1)
	if [ "$FILELOCATION" ]
	then
		echo "$1 is installed..."
	else
		echo "Installing $1..."
		brew install $1
	fi
}


if [ "$RVMFILE" ]
then
	echo "RVM is installed..."
else
	echo "Installing RVM..."
	bash < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer )
fi


if [ "$RUBYFILE" ]
then
	echo "Ruby is installed..."
else
	echo "Installing Ruby via RVM..."
	rvm install ree
fi


if [ "$BREWFILE" ]
then
	echo "Homebrew is installed..."
else
	echo "Installing Homebrew..."
	ruby -e "$(curl -fsSL https://raw.github.com/gist/323731)"
fi


if [ "$GEMFILE" ]
then
    echo "Rubygems is installed..."
else
	echo "Installing Rubygems..."
	cd tmp
	curl http://production.cf.rubygems.org/rubygems/rubygems-1.8.11.tgz --O rubygems-1.8.12.tgz

	tar -xzvf rubygems-1.8.11.tgz
	cd rubygems-1.8.11
	ruby setup.rb # install rubygems
	cd ..
	rm -rf rubygems*
	cd ..
fi


if [ "$JAVAFILE" ]
then
	echo "Java is installed..."
else
	echo "Java is not installed. Please install java from http://www.java.com/en/download/index.jsp"
	exit 1
fi


if [ "$ANTFILE" ]
then
	echo "Apache ant is installed..."
else
	brew install https://raw.github.com/adamv/homebrew-alt/master/duplicates/ant.rb
fi


BUNDLERFILE=$(gem which bundler)

if [[ "$BUNDLERFILE" =~ /*ERROR*/ ]]
then
	echo "Installing bundler..."
	gem install bundler
else
	echo "Bundler is installed..."
fi

for package in $PACKAGES
do
	check_or_install $package
done


if [ "$ANDROIDFILE" ]
then
	echo "Android is installed..."
else
	echo "Installing android"
	brew install android-sdk
fi