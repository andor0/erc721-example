fmt:
	(cd chain && npx prettier --write 'contracts/**/*.sol')
	(cd frontend && npx prettier --write 'src/**/*.tsx')
	(cd backend && cargo fmt)

run-tests:
	cd chain && npx hardhat test
