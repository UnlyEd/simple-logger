# Simple logger

> Simple universal logger for node/browser, with prefix, time and colors

This simple utility [is <1kB](https://bundlephobia.com/result?p=@unly/simple-logger) and is optimised to disable all logging in production, display
log time, line of origin, prefix and sane colors on the server console.

Also, it is tree-shacked and has **the same API** as the `console` native object.

> We use it with Next.js and Vercel, and we don't need the server logs on production because we have Sentry for that, and disabling them reduces our cost.

## Usage

```ts
import createSimpleLogger from '@unly/simple-logger';

const logger = createSimpleLogger({
  prefix: 'My lib',
  shouldPrint: () => process.env.NODE_ENV !== 'production', // Only print in non-production env (default behavior)
});
```

> Make sure to check our [advanced examples](#advanced-examples) below!

### Example color output (server console)

![image](https://user-images.githubusercontent.com/3807458/117548250-3e016980-b034-11eb-94fb-8eb72016c558.png)

> This is an example of the default color behaviour (see `scripts/show-colors.js`).

### Recommended usage (pro tips)

We recommend adapting:

- The `prefix` option, using the filename, the class name, the module name, etc. to help locate the origin of the message.
- The `shouldPrint` option to your needs. By default, it won't print anything in production environment.
- The `colorize` option, if you want to customize the colors used on the server. See [`colorizeFallback`](./blob/main/src/simpleLogger.ts) for inspiration.

## Installation

`yarn add @unly/simple-logger`

or

`npm install @unly/simple-logger`

### Peer dependencies

You'll also need to install those peer dependencies:

- `yarn add chalk`

> We decided to allow you to decide what version of chalk you want to use for greater flexibility.

## Options

Here are a few options to adapt the lib to your own needs.

```ts
export type SimpleLoggerOptions = {
  prefix?: string;
  disableAutoWrapPrefix?: boolean;
  colorize?: Colorize;
  shouldPrint?: ShouldPrint;
  shouldShowTime?: ShouldShowTime;
  timeFormat?: TimeFormat;
};

export type Colorize = (mode: PrintMode, prefixes: string[]) => string[];
export type ShouldPrint = (mode: PrintMode) => boolean;
export type ShouldShowTime = () => boolean;
export type TimeFormat = () => string;
```

### Default options

```
prefix: None
disableAutoWrapPrefix: `false`
colorize: Colorize for server console only, see implementation
shouldPrint: Prints if NODE_ENV !== 'production'
shouldShowTime: Enabled
timeFormat: Using ISO string
```

## Advanced configuration

You can define the following environment variables:

- `UNLY_SIMPLE_LOGGER_ENV`: Will be used instead of `NODE_ENV`, to configure the default behavior of `shouldPrint`.
    - E.g: If set to `APP_STAGE`, then will compare `APP_STAGE` with `production`. If `APP_STAGE = 'staging'` (or `development`), then `shouldPrint` will print
      by default. If `APP_STAGE = 'production'`, then `shouldPrint` will not print by default. If a custom `shouldPrint` is provided, then it will
      ignore `UNLY_SIMPLE_LOGGER_ENV` as it won't rely on the default `shouldPrint` implementation.
- `SIMPLE_LOGGER_SHOULD_SHOW_TIME`: Will be used to configure whether to show the time by default.
    - E.g: If set to `false`, then will not show the time.

## Advanced examples

> Those advanced examples are taken from actual implementation in production-grade applications.

### Application-wide logger

If you want to define your config only once and reuse it everywhere across your app, you can write a proxy, see below:

#### **`logger.ts`**

```ts
import createSimpleLogger from '@unly/simple-logger';
import { SimpleLogger } from '@unly/simple-logger/dist/simpleLogger';

/**
 * Custom logger proxy.
 *
 * Customize the @unly/simple-logger library by providing app-wide default behavior.
 *
 * @param fileLabel
 */
export const createLogger = ({ fileLabel }: { fileLabel: string }): SimpleLogger => {
  return createSimpleLogger({
    prefix: fileLabel,
    shouldPrint: (mode) => {
      return process.env.NEXT_PUBLIC_APP_STAGE !== 'production';
    },
  });
};
```

#### **`someFile.ts`**

```ts
import { createLogger } from '../logger';

const fileLabel = 'someFile';
const logger = createLogger({
  fileLabel,
});

logger.warn(`Oops, a warning!`, { x: 1 })
```

---------------------------------------------------------------------------------------------










> This package has been created using TSDX

<details>
<summary>TSDX User Guide</summary>

# TSDX User Guide

Congrats! You just saved yourself hours of work by bootstrapping this project with TSDX. Let’s get you oriented with what’s here and how to use it.

> This TSDX setup is meant for developing libraries (not apps!) that can be published to NPM. If you’re looking to build a Node app, you could use `ts-node-dev`, plain `ts-node`, or simple `tsc`.

> If you’re new to TypeScript, checkout [this handy cheatsheet](https://devhints.io/typescript)

## Commands

TSDX scaffolds your new library inside `/src`.

To run TSDX, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle
with `npm run analyze`.

#### Setup Files

This is the folder structure we set up for you:

```txt
/src
  index.tsx       # EDIT THIS
/test
  blah.test.tsx   # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings.
See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of
development-only optimizations:

```js
// ./types/index.d.ts
declare
var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning)
functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React
library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by
your users and run through their bundler's loader.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).

</details>
