# IO Buster

IO Buster provides a flexible test framework, which allows characterizing
performance of an NVMe drive. When combined with IO Buster Coordinator, multiple
NVMe drives can be characterized concurrently.

IO Buster leverages the Storage Performance Development Kit
([SPDK](http://www.spdk.io/)) to generate high speed IO traffics to NVMe drives.

## Supported Platform

IO Buster is designed to work on any Linux distribution with glibc >= 2.7 and
kernel version >= 3.16.

We only officially tested IO Buster on the following Linux distributions:
- Ubuntu 18.04 LTS
- CentOS 7

## Installation

We highly recommend installing IO Buster using IO Buster Coordinator. IO Buster
Coordinator sets up all necessary package dependencies and linux configurations.

### Install Using IO Buster Coordinator

When using IO Buster coordinator, a user needs an extra system on top of a
system that will run IO Buster.

IO Buster Coordinator runs on any platform with Docker installed.

#### Installation Steps

1. Install [Docker](https://docs.docker.com/install/).

1. Depending on your host operating system, run either run.bat (Windows) or
run.sh (Mac OS or Linux).

1. Read `host add` command from **IO Buster Coordinator Commands** for
instructions of adding a new host.

### Install Manually

When installing IO Buster manually, package dependencies must be installed 
manually. The followings are the list of packages that need to install on each
Linux Distribution.

#### Ubuntu 18.04 LTS

- lshw
- pciutils
- libaio-dev
- libnuma-dev
- libssl-dev
- uuid-dev

#### CentOS 7

- lshw
- pciutils
- libaio-devel
- libuuid-devel
- numactl-devel
- openssl-devel

Additionally `grub` configuration needs updates to support 1GB hugepages.
Read the instructions from the [DPDK documentation](https://rb.gy/gu7jpd).

## Documentation

See [IO Buster Documentation](https://qamaestro.github.io/io-buster/) page.

## License

All scripts available in this repository are licensed under GPLv3.

IO Buster, which is avilable as a form a binary, is available for free under a
proprietry license as long as it's not sold or used for profit. A user is
expected to accept the license agreement when launching IO Buster for the
first time.
