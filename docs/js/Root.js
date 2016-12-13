import React from 'react';
import { Router, browserHistory, hashHistory } from 'react-router';

const onS3 = window.location.href.indexOf('s3') !== -1;

class Root extends React.Component {
  getChildContext() {
    return {
      router: this.props.router,
      components: this.props.components
    };
  }
  render() {
    return (
      <Router history={onS3 ? hashHistory : browserHistory} routes={this.props.routes} />
    );
  }
}

Root.childContextTypes = {
  router: React.PropTypes.object,
  components: React.PropTypes.func
};

export default Root;
