.PHONY: fmt run-tests

fmt:
	(cd chain && npx prettier --write 'contracts/**/*.sol')
	(cd frontend && npx prettier --write 'src/**/*.tsx')
	(cd backend && cargo fmt)
	(npx prettier --write README.md docker-compose.yml)

run-tests:
	cd chain && npx hardhat test
