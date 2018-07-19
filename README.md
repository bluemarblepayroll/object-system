# Object System

[![Build Status](https://travis-ci.org/bluemarblepayroll/object-system.svg?branch=master)](https://travis-ci.org/bluemarblepayroll/object-system)

This library provides a way for you to organize and standardize individual components.  It can serve as the 'glue' or 'broker' between a bunch of disparate objects within a system.  This library was extracted from the following use case:

> Create a system for a collection of individual, framework-independent UI components.

An extreme (not advisable) example of this would be:

> We have a library with multiple UI components written in jQuery, Angular, and React.  How can we get them all to work together by communicating with each other?

Using this library we could accomplish this by:

1. Wrapping each component in a **constructor** function
2. Making sure the object that it creates contains a publicly accessible 'receive' property of action functions.

Then, we can make calls like this:

````
Broker.message('SomeComponentName', 'someAction', { something: true, somethingElse: 0 });
````

In non-single page web applications, the client-side life-cycle begins over and over again and usually does not handle as much global/application-level state as a single page application would.  Therefore, our front-end object/global state manager can be simplified.  In this scenario, this library may be all you need because it allows you to:

1. Independently develop and encapsulate UI components
1. Allow the independent components to talk to each together
1. Forget about order of operations around declaration of components

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

### React Example: Todo Application

*This example is provided as a standalone webpage located at: test/examples/todo_app.html*

Consider the following example of a Todo UI component written in React:

````
class TodoList extends React.Component {

  static defaultProps = {
    items: [],
    title: 'Todo'
  };

  constructor(props) {
    super(props);

    this.state = {
      items: Immutable.fromJS(props.items),
      title: props.title
    };

    this.receive = {
      add: (msgId, args) => {
        let newNote = Immutable.fromJS({
          notes: args.notes
        });

        this.setState({
          items: this.state.items.push(newNote)
        });
      }
    }
  }

  render() {
    return(
      <div>
        <h2>{this.state.title}</h2>
        <table>
          <tbody>
            {this.renderRows()}
          </tbody>
        </table>
      </div>
    );
  }

  renderRows() {
    return this.state.items.map( (item, index) =>
      <tr key={index}>
        <td>{item.get('notes')}</td>
        <td><button onClick={this.deleteItem.bind(this, index)}>Delete</button></td>
      </tr>
    );
  }

  deleteItem(index) {
    console.log(`[TodoList] Deleting item at index: ${index}`);

    this.setState({
      items: this.state.items.delete(index)
    });
  }
}
````

The component above knows how to render the HTML of the list itself.  In order for items to be added, it will listen, or "receive" messages as implemented in the constructor.  The key here is all instance of the object needs is to respond to 'receive' and implement whatever actions as keys ('add' in our example.)

Complimenting this list component would be a basic form component:

````
class TodoForm extends React.Component {

  static defaultProps = {
    formName: ''
  };

  render() {
    return(
      <div>
        <input ref="notes" />
        <button onClick={this.addItem.bind(this)}>Add</button>
      </div>
    );
  }

  clearField() {
    this.refs.notes.value = '';
  }

  addItem() {
    Broker.message(this.props.formName, 'add', { notes: this.refs.notes.value });
    this.clearField();
  }
}
````

This form is as basic as it gets: a textbox and a button.  When the button is clicked, it will send a message to another form (identified the formName property) to add another item.

Tying this together would be the HTML:

````
<div id="TodoList1"></div>
<div id="TodoForm1"></div>
````

And the JavaScript that registers the React components and calls to make them:

````
function reactConstructor(reactClass) {
  return (name, opts, domElement) => ReactDOM.render(React.createElement(reactClass, opts), domElement);
}

Broker.register('TodoList', reactConstructor(TodoList));
Broker.register('TodoForm', reactConstructor(TodoForm));

let listOptions = {
  title: 'Things I Need To Get Done',
  items: [
    { notes: 'Example 1' },
    { notes: 'Example 2' }
  ]
};

let formOptions = {
  formName: 'TodoList1'
};

Broker.make('TodoList', 'TodoList1', listOptions, document.getElementById('TodoList1'));
Broker.make('TodoForm', 'TodoForm1', formOptions, document.getElementById('TodoForm1'));
````

Voilà!  You have installed a basic component manager on top of a basic component architecture!

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
