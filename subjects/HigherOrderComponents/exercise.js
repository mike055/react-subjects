////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Make `withMousePosition` a "higher-order component" that sends the mouse
// position to the component as props.
//
// Hint: use `event.clientX` and `event.clientY`
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

const withMousePosition = (Component) => {
  return class extends React.Component {

    state= {
      x: 0,
      y: 0
    }

    listenToMouseEvent = (event) => {
      this.setState({
          x: event.clientX,
          y: event.clientY
        });
    }

    componentDidMount() {
      window.addEventListener('mousemove', this.listenToMouseEvent);
    }

    componentWillUnmount() {
      window.removeEventListener('mousemove', this.listenToMouseEvent);
    }

    render() {
      const {x,y} = this.state;

      //could do the same by wrapping component in a div with a onMouseMove
      return <Component {...this.props} mouse={ {x, y} } />
    }
  }
}

class App extends React.Component {
  static propTypes = {
    mouse: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired
  }

  render() {
    const { mouse } = this.props

    return (
      <div style={{ height: '100%' }}>
        {mouse ? (
          <h1>The mouse position is ({mouse.x}, {mouse.y})</h1>
        ) : (
          <h1>We don't know the mouse position yet :(</h1>
        )}
      </div>
    )
  }
}

const AppWithMouse = withMousePosition(App)

ReactDOM.render(<AppWithMouse/>, document.getElementById('app'))
