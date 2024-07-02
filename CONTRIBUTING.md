## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## Issues

Issues should be used to report bugs or request new features. If you find an Issue that is related to a problem you're having, please add your own reproduction information to the existing issue rather than creating a new one. Adding a reaction can also help be indicating to our maintainers that a particular problem is affecting more than just the reporter.

## Noticed a bug?

(╯°□°)╯︵ ┻━┻

[Let us know by creating a new issue](https://github.com/unioncredit/union-interface/issues/new)

## Pull requests

PRs to the repo are always welcome and can be a quick way to get your fix/improvement imlemented. In general, PRs should:

- Only fix/add the functionality related to the related issue
- Add unit or integration tests for fixed or changed functionality (if a test suite exists).
- Address a single concern in the least number of changed lines as possible.
- Update/add documentation if needed

## Guidelines

Code merged into the main branch of this repository should adhere to high standards of correctness and maintainability. Use your best judgment when applying these standards.

- Avoid adding unnecessary dependencies
- Avoid adding steps to the development/build processes
- The build must be deterministic, i.e. a particular commit hash always produces the same build
- An Ethereum node should be the only critical dependency
- The interface should be responsive, small and also run well on low performance devices

