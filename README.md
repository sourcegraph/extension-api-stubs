# @sourcegraph/extension-api-stubs

[![npm](https://img.shields.io/npm/v/@sourcegraph/extension-api-stubs.svg)](https://www.npmjs.com/package/@sourcegraph/extension-api-stubs)
[![downloads](https://img.shields.io/npm/dt/@sourcegraph/extension-api-stubs.svg)](https://www.npmjs.com/package/@sourcegraph/extension-api-stubs)
[![build](https://travis-ci.org/sourcegraph/extension-api-stubs.svg?branch=master)](https://travis-ci.org/sourcegraph/extension-api-stubs)
[![codecov](https://codecov.io/gh/sourcegraph/extension-api-stubs/branch/master/graph/badge.svg?token=AhFNzoboTT)](https://codecov.io/gh/sourcegraph/extension-api-stubs)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Stubs for the Sourcegraph extension API to unit-test Sourcegraph extensions

## Install

```
npm install @sourcegraph/extension-api-stubs
# or
yarn add @sourcegraph/extension-api-stubs
```

## Example

```ts
import mock from 'mock-require'
import { createStubSourcegraphAPI, createStubExtensionContext } from '@sourcegraph/extension-api-stubs'
const sourcegraph = createStubSourcegraphAPI()
// For modules importing Range/Location/Position/URI/etc
mock('sourcegraph', sourcegraph)

import * as sinon from 'sinon'
import { activate } from './extension'

describe('my extension', () => {
  it('should register a hover provider', async () => {
    const context = createStubExtensionContext()
    await activate(context)
    sinon.assert.calledOnce(sourcegraph.languages.registerHoverProvider)
    const provider = sourcegraph.languages.registerHoverProvider.args[0][1]
    const result = provider()
    // More assertions ...
  })
})
```

See the [Sinon documentation](https://sinonjs.org/) for more info on how to use the stubs.

## Build

```
yarn
yarn build
```

## Test

```
yarn test
```

## Release

Releases are done automatically in CI when commits are merged into master by analyzing [Conventional Commit Messages](https://conventionalcommits.org/).
After running `yarn`, commit messages will be linted automatically when committing though a git hook.
The git hook can be circumvented for fixup commits with [git's `fixup!` autosquash feature](https://fle.github.io/git-tip-keep-your-branch-clean-with-fixup-and-autosquash.html), or by passing `--no-verify` to `git commit`.
You may have to rebase a branch before merging to ensure it has a proper commit history, or squash merge with a manually edited commit message that conforms to the convention.
