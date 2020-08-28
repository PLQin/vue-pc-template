#!/bin/sh

# Window only
# Win使用命令 start [name].sh 即可运行此脚本，或双击脚本亦可

date +"%Y-%m-%d %H-%M-%S"" ------ git stash"
git stash

date +"%Y-%m-%d %H-%M-%S"" ------ git pull -r"
git pull -r

date +"%Y-%m-%d %H-%M-%S"" ------ git stash pop"
git stash pop

date +"%Y-%m-%d %H-%M-%S"" ------ git commit"
read remarks
if [ ! -n "$remarks" ];then
	remarks=date +"%Y-%m-%d %H-%M-%S"
fi
git commit -m "$remarks"

date +"%Y-%m-%d %H-%M-%S"" ------ git pl"
git pull

date +"%Y-%m-%d %H-%M-%S"" ------ git pull -r 同步成功，请merge code并push后手动关闭终端"

exec /bin/bash
