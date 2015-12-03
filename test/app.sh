#!/bin/bash
clear
i=1
while(($i<10))
do
if(($i%3==0))
then
echo $i
node "./testResourceManager.js"
fi
i=$(($i+1))
done