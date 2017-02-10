import React from 'react'

const connect = (mapStateToProps) => {
  return (Component) => {
    return class extends React.Component {
      static contextTypes = {
        store: React.PropTypes.object.isRequired
      }

      componentWillMount() {
        this.context.store.subscribe(()=> {
          console.log('do something')
          this.forceUpdate()
        }); 
      }

      render() {
        const data = mapStateToProps(this.context.store.getState())

        return <Component {...this.props} {...data} dispatch={this.context.store.dispatch}/>
      }
    }
  }
}

export default connect
