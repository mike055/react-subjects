////////////////////////////////////////////////////////////////////////////////
// Exercise
//
// - When the checkbox is checked:
//   - Fill in the shipping fields with the values from billing
//   - Disable the shipping fields so they are not directly editable
//   - Keep the shipping fields up to date as billing fields change
//   - Hint: you can get the checkbox value from `event.target.checked`
// - When the form submits, console.log the values
//
// Got extra time?
//
// - If there are more than two characters in the "state" field, let the user
//   know they should use the two-character abbreviation
// - If the user types something into shipping, then checks the checkbox, then
//   unchecks the checkbox, ensure the field has the information from
//   before clicking the checkbox the first time
import React from 'react'
import ReactDOM from 'react-dom'
import serializeForm from 'form-serialize'

class CheckoutForm extends React.Component {

  state = {
    billingName: 'Michael',
    billingState: 'VI',
    shippingName: '',
    shippingState: '',
    useBillingDetails: false
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const values = serializeForm(event.target, { hash: true })

    console.log(values)
  }

  componentWillMount() {
    if(localStorage.formState) {
      this.setState(JSON.parse(localStorage.formState));
      localStorage.formState = null;
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', () => {
      localStorage.formState = JSON.stringify(this.state)
    })
  }

  render() {
    const {
      useBillingDetails,
      billingName,
      shippingName,
      billingState,
      shippingState
    } = this.state;

    const showBillingStateLengthError = this.state.billingState.length > 2;
    const showShippingStateLengthError = 
      useBillingDetails && this.state.billingState.length > 2 ||
      !useBillingDetails && this.state.shippingState.length > 2;      ;

    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
        <h1>Checkout</h1>
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>Billing Address</legend>
            <p>
              <label>Billing Name: 
                <input 
                  type="text"
                  name="billingName"
                  defaultValue={billingName}
                  onChange={event => this.setState({billingName: event.target.value })}
                />
              </label>
            </p>
            <p>
              <label>Billing State: 
                <input 
                  type="text" 
                  size="2"
                  name="billingState"
                  defaultValue={billingState}
                  onChange={event => this.setState({billingState: event.target.value })}
                />
              </label>
              {
                showBillingStateLengthError && <span>&nbsp; Length should be two</span>
              }
            </p>
          </fieldset>

          <br/>

          <fieldset>
            <label>
              <input type="checkbox" onChange={event => this.setState({useBillingDetails: event.target.checked })} /> 
              Same as billing
            </label>
            <legend>Shipping Address</legend>
            <p>
              <label>Shipping Name: 
                <input 
                  type="text" 
                  name="shippingName"
                  readOnly={useBillingDetails}
                  value={useBillingDetails ? billingName : shippingName}
                  onChange={event => this.setState({shippingName: event.target.value })}
                />
              </label>
            </p>
            <p>
              <label>Shipping State: 
                <input 
                  type="text" 
                  size="2" 
                  name="shippingState"
                  readOnly={useBillingDetails}
                  value={useBillingDetails ? billingState : shippingState}
                  onChange={event => this.setState({shippingState: event.target.value })}
                />
              </label>
              {
                showShippingStateLengthError && <span>&nbsp; Length should be two</span>
              }
            </p>
          </fieldset>

          <p>
            <button>Submit</button>
          </p>
        </form>
      </div>
    )
  }
}

ReactDOM.render(<CheckoutForm/>, document.getElementById('app'))
