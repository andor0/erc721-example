fmt:
	npx prettier --write 'contracts/**/*.sol'
	cd backend && cargo fmt

run-tests:
	cd chain && npx hardhat test
