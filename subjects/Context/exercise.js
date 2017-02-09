/*eslint-disable no-alert */
////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Using context, implement the <Form>, <SubmitButton>, and <TextInput>
// components such that:
//
// - Clicking the <SubmitButton> "submits" the form
// - Hitting "Enter" while in a <TextInput> submits the form
// - Don't use a <form> element, we're intentionally recreating the
//   browser's built-in behavior
//
// Got extra time?
//
// - Send the values of all the <TextInput>s to the <Form onChange> handler
//   without using DOM traversal APIs
// - Implement a <ResetButton> that resets the <TextInput>s in the form
//
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import ReactDOM from 'react-dom'

class Form extends React.Component {

  constructor() {
    super()
    this.resetableFields = [];
  }
  static childContextTypes = {
    form: React.PropTypes.shape({
      submit: React.PropTypes.func,
      change: React.PropTypes.func,
      reset: React.PropTypes.func,
      onReset: React.PropTypes.func,
    }).isRequired
  }

  

 getChildContext() {

   return {
    form: {
      submit: () => {
        this.props.onSubmit()
      },
      change: (val) => {
        this.props.onChange(val)
      },
      reset: (val) => {
        this.resetableFields.forEach(function(fn) {
            fn();
        });
      },
      onReset: (callback) => {
        this.resetableFields.push(callback)
      }   
    }
   }
 }

  render() {
    return <div>{this.props.children}</div>
  }
}

class ResetButton extends React.Component {
  static contextTypes = {
    form: React.PropTypes.shape({
      reset: React.PropTypes.func
    }).isRequired
  }

  render() {
    return <button onClick={() => this.context.form.reset()}>{this.props.children}</button>
  }
}

class SubmitButton extends React.Component {
  static contextTypes = {
    form: React.PropTypes.shape({
      submit: React.PropTypes.func
    }).isRequired
  }

  render() {
    return <button onClick={() => this.context.form.submit()}>{this.props.children}</button>
  }
}

class TextInput extends React.Component {
  static contextTypes = {
    form: React.PropTypes.shape({
      submit: React.PropTypes.func,
      change: React.PropTypes.func,
      onReset: React.PropTypes.func
    }).isRequired
  }

  onKeyDown = (e) => {
    if(e.keyCode === 13) {
      this.context.form.submit();
    }
  }

  onChange = (e) => {
    this.setState({value: e.target.value}, () => {
      this.context.form.change(this.state.value)
    })
  }

  componentWillMount() {
    this.context.form.onReset(() => {
      this.setState({value: ''})
    });
  }

  state = {
    value: ''
  }

  render() {
    return (
      <input
        type="text"
        name={this.props.name}
        placeholder={this.props.placeholder}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        value={this.state.value}
      />
    )
  }
}

class App extends React.Component {
  handleSubmit = () => {
    alert('YOU WIN!')
  }

  handleChange = (val) => {
    console.log(val);
  }

  render() {
    return (
      <div>
        <h1>This isn't even my final <code>&lt;Form/&gt;</code>!</h1>

        <Form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <p>
            <TextInput name="firstName" placeholder="First Name"/> {' '}
            <TextInput name="lastName" placeholder="Last Name"/>
          </p>
          <p>
            <SubmitButton>Submit</SubmitButton>
            <ResetButton>Reset</ResetButton>
          </p>
        </Form>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
