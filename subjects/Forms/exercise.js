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
    previousShippingName: '',
    previousShippingState: '',
    useBillingDetails: false
  }

  onBillingNameChange = (event) => {
    this.setState({billingName: event.target.value}, ()=> {
      this.keepShippingFieldsInSync();
    });
    
  }

  onBillingStateChange = (event) => {
    this.setState({billingState: event.target.value}, ()=> {
      this.keepShippingFieldsInSync();
    });
  }

  onShippingNameChange = (event) => {
    if(!this.state.useBillingDetails) {
      this.setState({shippingName: event.target.value});
    }
  }

  onShippingStateChange = (event) => {
    if(!this.state.useBillingDetails) {
      this.setState({shippingState: event.target.value});
    }
  }

  handleCheckboxChange = (event) => {
    this.setState({ useBillingDetails: event.target.checked }, () => {
      if(this.state.useBillingDetails) {
        this.setState({
          previousShippingName: this.state.shippingName,
          previousShippingState: this.state.shippingState
        }, ()=> {
          this.keepShippingFieldsInSync()
        });
        
      }
      else {
        this.setState({
          shippingName: this.state.previousShippingName,
          shippingState: this.state.previousShippingState
        });
      }
      
    })
  }

  keepShippingFieldsInSync = () => {
    if(this.state.useBillingDetails) {
      this.setState({
        shippingName: this.state.billingName,
        shippingState: this.state.billingState
      });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const values = serializeForm(event.target, { hash: true })

    console.log(values)
  }

  render() {

    const showBillingStateLengthError = this.state.billingState.length > 2;
    const showShippingStateLengthError = this.state.shippingState.length > 2;

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
                  defaultValue={this.state.billingName}
                  onChange={this.onBillingNameChange}
                />
              </label>
            </p>
            <p>
              <label>Billing State: 
                <input 
                  type="text" 
                  size="2"
                  name="billingState"
                  defaultValue={this.state.billingState}
                  onChange={this.onBillingStateChange}
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
              <input type="checkbox" onChange={this.handleCheckboxChange} /> 
              Same as billing
            </label>
            <legend>Shipping Address</legend>
            <p>
              <label>Shipping Name: 
                <input 
                  type="text" 
                  name="shippingName"
                  value={this.state.shippingName}
                  onChange={this.onShippingNameChange}
                />
              </label>
            </p>
            <p>
              <label>Shipping State: 
                <input 
                  type="text" 
                  size="2" 
                  name="shippingState"
                  value={this.state.shippingState}
                  onChange={this.onShippingStateChange}
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
