mkdir -p "$HOME/.qam/qamc"
docker run --rm -it \
    -v "$HOME/.qam/qamc:/data" \
    -v "$PWD:/workspace" \
    gcr.io/maestro-public/qam-coordinator:local
