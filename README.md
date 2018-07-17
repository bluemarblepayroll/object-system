# Object System

[![Build Status](https://travis-ci.org/bluemarblepayroll/object-system.svg?branch=master)](https://travis-ci.org/bluemarblepayroll/object-system)

This library provides a way for you to organize and standardize individual components.  It can serve as the 'glue' or 'broker' between a bunch of disparate objects within a system.  This library was extracted from the following use case:

> Create a system for a collection of individual, framework-independent UI components.

An extreme (not advisable) example of this would be:

We have a library with multiple UI components written in jQuery, Angular, and React.  How can we get them all to work together by communicating with each other?

Using this library we could accomplish this by:

1. Wrapping each component in a **constructor** function
2. Making sure the object that it creates contains a publicly accessibly 'receive' property of action functions.

Then, we can make calls like this:

````
Broker.message('SomeComponentName', 'someAction', { something: true, somethingElse: 0 });
````

## Installation

This library could be consumed as either a pure TypeScript library or as its trans-compiled ES2015 JavaScript counterpart.

To install through NPM:

````
npm install --save @bluemarblepayroll/object-system
````

To install through Yarn:

````
yarn add @bluemarblepayroll/object-system
````

## Examples

TODO

## Contributing

### Development Environment Configuration

Basic steps to take to get this repository compiling:

1. Install [Node.js](https://nodejs.org) (check package.json for versions supported.)
2. Install Yarn package manager (npm install -g yarn)
3. Clone the repository (git clone git@github.com:bluemarblepayroll/object-system.git)
4. Navigate to the root folder (cd object-system)
5. Install dependencies (yarn)

### Compiling

To compile the TypeScript source down to native JavaScript, run:

````
npm run build
````

### Running Tests

To execute the test suite first compile the solution then run:

````
npm run test
````

## License

This project is MIT Licensed.
