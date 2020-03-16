if [ -z "$bamboo_NEXUS_NPM_READ_TOKEN" ]
then
  echo "\$bamboo_NEXUS_NPM_READ_TOKEN is not defined."
  echo "It is needed in order to install packages from the private Nexus repository"
  exit 1
fi

mkdir ./coverage
rm -f ./coverage/lcov.info
docker build --build-arg NEXUS_NPM_READ_TOKEN=$bamboo_NEXUS_NPM_READ_TOKEN -t pp-backend-tests . --no-cache
docker run --rm pp-backend-tests cat /app/backend-build/coverage/lcov.info > ./coverage/lcov.info
