#!/usr/bin/bash

ip=$1
cerDir=$2/
 echo IP: $ip
 echo Cer dir: $cerDir

# get rid of output
blackhole="/dev/null"

# generate Private Key
openssl genrsa -out "$cerDir"rsa_pri.key 2048 2> $blackhole

openssl req -x509 -nodes -sha256 -new -key "$cerDir"rsa_pri.key -out "$cerDir"selfSigned_pubCA.cer -days 730 -subj /CN="ttel-server "$ip" Custom CA" 2> $blackhole

# certification authority
openssl genrsa -out "$cerDir"server.key 2048 2> $blackhole

# new certificate signing request
openssl req -new -out "$cerDir"server.req -key "$cerDir"server.key -subj /CN=$ip 2> $blackhole

openssl x509 -req -in "$cerDir"server.req -out "$cerDir"server.cer -CAkey "$cerDir"rsa_pri.key -CA "$cerDir"selfSigned_pubCA.cer -days 365 -CAcreateserial -CAserial "$cerDir"serial 2> $blackhole

#make an new dir named pubCer
mkdir "$cerDir"pubCer

#move .cer
mv "$cerDir"selfSigned_pubCA.cer "$cerDir"pubCer/selfSigned_pubCA.cer
