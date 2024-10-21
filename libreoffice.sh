#!/bin/sh

temp_dir="/tmp/libreoffice"
mkdir -p "$temp_dir"

pids=""

for i in $(seq 1 ${NUM_INSTANCES:-1}); do 
  soffice -env:UserInstallation="file://$temp_dir/p$i" --headless --nofirststartwizard &
  pids="$pids $!" 
  echo "Started LibreOffice instance $i with PID $!"
done

sleep 2

for pid in $pids; do
  kill $pid
  echo "Killed process with PID $pid"
done