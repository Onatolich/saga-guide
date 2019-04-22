# Changelog
All notable changes to this project will be documented in this file.

## [1.2.0] - 2019-04-22
### Added
- `toDispatchActionType` custom matcher for `Jest`

## [1.1.1] - 2019-04-22
### Added
- `LICENSE.md` file with MIT license
- `CHANGELOG.md` file
- `.npmignore` file to prevent publishing of unnecessary files to the npm registry

## [1.1.0] - 2019-04-20
### Added
- Usage example in `/example` folder
- `getName` utility method of guided saga which returns saga name (used internally for better messages of matchers)
- `isGuidedSaga` utility method of `sagaGuide` factory to check if passed reference is an instance of GuidedSaga
- `toDispatchAction` custom matcher for `Jest`

### Changed
- Documentation with using `toDispatchAction` matcher in `Example` section

## [1.0.7] - 2019-04-20
### Changed
- Changed list style in documentation to fix list numbering issue

## [1.0.6] - 2019-04-19
### Changed
- Fix typos in documentation

## [1.0.5] - 2019-04-19
### Changed
- Fix typos in documentation

## [1.0.4] - 2019-04-19
### Changed
- Fix typos in documentation

## [1.0.3] - 2019-04-19
### Changed
- Fix typos in documentation

## [1.0.2] - 2019-04-19
### Changed
- Fix typos in documentation

## [1.0.1] - 2019-04-19
### Changed
- Fix optional options during initialization (was throwing an error without initial options)

## [1.0.0] - 2019-04-19
### Added
- Initial `sagaGuide` factory for GuidedSaga
- Ability to run guided saga
- Ability to determine which actions was dispatched and in which order
- Ability to track errors thrown by guided saga
- Ability to manage state for `select` effect

[1.1.1]: https://github.com/Onatolich/saga-guide/compare/v1.1.0..v1.1.1
[1.1.0]: https://github.com/Onatolich/saga-guide/compare/v1.0.7..v1.1.0
[1.0.7]: https://github.com/Onatolich/saga-guide/compare/v1.0.6..v1.0.7
[1.0.6]: https://github.com/Onatolich/saga-guide/compare/v1.0.5..v1.0.6
[1.0.5]: https://github.com/Onatolich/saga-guide/compare/v1.0.4..v1.0.5
[1.0.4]: https://github.com/Onatolich/saga-guide/compare/v1.0.3..v1.0.4
[1.0.3]: https://github.com/Onatolich/saga-guide/compare/v1.0.2..v1.0.3
[1.0.2]: https://github.com/Onatolich/saga-guide/compare/v1.0.1..v1.0.2
[1.0.1]: https://github.com/Onatolich/saga-guide/compare/v1.0.0..v1.0.1
[1.0.0]: https://github.com/Onatolich/saga-guide/releases/tag/v1.0.0
