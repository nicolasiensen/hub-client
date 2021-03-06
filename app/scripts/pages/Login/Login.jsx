import React from 'react'
import LoginForm from './../../components/LoginForm.jsx'

export default class Login extends React.Component {
  render() {
    const rebooLogo = require('./logo-login.png')
    return (
      <div className="bg-cover bg-center bg-reboo absolute top-0 right-0 bottom-0 left-0">
        <div className="container">
          <div className="px3 py3 center lg-col-6 mx-auto">
            <img src={rebooLogo} alt="Logo Reboo" />
          </div>
          <div className="px3 bg-white lg-col-6 mx-auto">
            <h1 className="center h2 m0 py2">Faça seu Login</h1>
          </div>
          <div className="p3 bg-silver lg-col-6 mx-auto">
            <LoginForm {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}
