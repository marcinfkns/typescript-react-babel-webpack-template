import React = require('react')
import ReactDOM = require('react-dom')

interface HelloProps {
  name: string;
}

class Hello extends React.Component<HelloProps, {}> {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}


ReactDOM.render(<Hello name="John" />, document.getElementById('hello'));
