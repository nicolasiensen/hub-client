import React from 'react'
import classNames from 'classnames'
import { Link, Navigation } from 'react-router'

export default class ConfigurationsMenuItem extends React.Component {
  render(){
    return(
      <li className={classNames(
          "inline-block", "mr3", "py2", "h5",
          {"border-bottom border-aqua bold": this.props.isActive}
        )}>
        <Link to={this.props.path} className="gray">{this.props.text}</Link>
      </li>
    )
  }
}
