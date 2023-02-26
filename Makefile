fmt:
	(cd chain && npx prettier --write 'contracts/**/*.sol')
	(cd frontend && npx prettier --write 'src/**/*.tsx')
	(cd backend && cargo fmt)
	(npx prettier README.md)

run-tests:
	cd chain && npx hardhat test
