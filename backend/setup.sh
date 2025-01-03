#!/bin/bash
sudo apt-get install automake build-essential clang cmake git libboost-dev libboost-filesystem-dev libboost-iostreams-dev libboost-thread-dev libgmp-dev libntl-dev libsodium-dev libssl-dev libtool python3
sudo apt-get install libboost-all-dev
make setup
cd ../mp-spdz
make -j 8 mascot-offline.x
./compile.py -R 64 ../mpc/Source/rps_demo.mpc