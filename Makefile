fmt:
	npx prettier --write 'contracts/**/*.sol'
	cd backend && cargo fmt

run-tests:
	npx hardhat test
