#!/bin/bash

sudo apt-key adv --keyserver hkps.pool.sks-keyservers.net --recv D58C6920
repo="trusty"
. /etc/lsb-release
if [ "$DISTRIB_RELEASE" == "16.04" ]; then
    repo="xenial"
fi
echo "$DISTRIB_RELEASE"
sleep 1
sudo sh -c "echo 'deb http://package.crossbar.io/ubuntu $repo main' > /etc/apt/sources.list.d/crossbar.list"
sudo apt-get update
sudo apt-get install crossbar
sudo pip3 install -r requirements.txt
/opt/crossbar/bin/crossbar init
cat .crossbar/config.json | sed 's/realm1/ballfight/g' > __crossbar.config
mv __crossbar.config .crossbar/config.json
mkdir -p .c9/runners
echo '{
    "cmd" : ["/opt/crossbar/bin/crossbar", "start", "--cbdir", "$project_path/.crossbar"],
    "info" : "Ballfight wamp router started at: ws://$hostname:$port/ws"
}' > .c9/runners/crossbar.run
if [ ! -f /usr/local/bin/crossbar ]; then
    sudo ln -s /opt/crossbar/bin/crossbar /usr/local/bin/crossbar
fi
echo "Done~~"
