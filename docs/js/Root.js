import React from 'react';
import { Router, browserHistory } from 'react-router';

class Root extends React.Component {
  getChildContext() {
    return {
      router: this.props.router,
      components: this.props.components
    };
  }
  render() {
    return (
      <Router history={browserHistory} routes={this.props.routes} />
    );
  }
}

Root.childContextTypes = {
  router: React.PropTypes.object,
  components: React.PropTypes.func
};

export default Root;
