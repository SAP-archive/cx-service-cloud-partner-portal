mkdir -p ./coverage
rm -f ./coverage/lcov.info
cd ../
docker build -t pp-frontend-tests -f frontend/Dockerfile . --no-cache
docker run --rm pp-frontend-tests cat /app/frontend-build/coverage/lcov.info > frontend/coverage/lcov.info
