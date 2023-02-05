

fmt:
	npx prettier --write 'contracts/**/*.sol'
	cd backend && cargo fmt