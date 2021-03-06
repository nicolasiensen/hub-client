import React from 'react'
import classnames from 'classnames'
import $ from 'jquery'
import { Loading } from './'
import { bindActionCreators } from 'redux'
import * as WidgetActions from './../actions/WidgetActions'

export default class FormWidgetInput extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { field } = this.props
    this.state = {
      loading: false,
      kind: field.kind,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required
    }
  }

  componentWillAppear() {
    const { uid } = this.props
    $('#form-' + uid).hide()
    $('#form-' + uid).slideDown(200)
  }

  componentWillReceiveProps(nextProps) {
    const { uid } = this.props
    if (this.state.loading && this.props.field != nextProps.field) {
      this.setState({loading: false})
      $('#form-' + uid).slideUp(200, () => {
        this.props.onClose && this.props.onClose()
      })
    }
  }

  dirty() {
    const { field } = this.props
    return field.kind != this.state.kind ||
           field.label != this.state.label ||
           field.placeholder != this.state.placeholder ||
           field.required != this.state.required
  }

  handleLabelChange(event) {
    this.setState({label: event.target.value})
  }

  handlePlaceholderChange(event) {
    this.setState({placeholder: event.target.value})
  }

  handleRequiredChange(event) {
    this.setState({required: event.target.value})
  }

  handleKindChange(event) {
    this.setState({kind: event.target.value})
  }

  updateSettings(newFields) {
    const { dispatch, mobilization, widget, auth } = this.props
    const { settings } = widget
    const { fields } = settings
    const bindedWidgetActions = bindActionCreators(WidgetActions, dispatch)
    this.setState({
      loading: true
    })
    bindedWidgetActions.editWidget({
      mobilization_id: mobilization.id,
      widget_id: widget.id,
      credentials: auth.credentials,
      widget: { settings: {
        ...settings,
        fields: newFields
      } }
    })
  }

  handleCancel(event) {
    event.preventDefault()
    event.stopPropagation()
    const { field, uid } = this.props
    this.setState({
      kind: field.kind,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required
    })
    $('#form-' + uid).slideUp(200, () => {
      this.props.onClose && this.props.onClose()
    })
  }

  handleSave(event) {
    event.preventDefault()
    event.stopPropagation()
    const { fields } = this.props.widget.settings
    const newFields = fields.map((field) => {
      if(field.uid == this.props.field.uid) {
        return {
          uid: field.uid,
          kind: this.state.kind,
          label: this.state.label,
          placeholder: this.state.placeholder,
          required: this.state.required
        }
      } else {
        return field
      }
    })
    this.updateSettings(newFields)
  }

  handleMoveUp(event) {
    event.preventDefault()
    event.stopPropagation()
    const { fields } = this.props.widget.settings
    const newFields = fields.map((field, index) => {
      if (index + 1 < fields.length && fields[index + 1].uid == this.props.field.uid) {
        return this.props.field
      } else if (field.uid == this.props.field.uid) {
        return fields[index - 1]
      } else {
        return field
      }
    })
    this.updateSettings(newFields)
  }

  handleMoveDown(event) {
    event.preventDefault()
    event.stopPropagation()
    const { fields } = this.props.widget.settings
    const newFields = fields.map((field, index) => {
      if (index > 0 && fields[index - 1].uid == this.props.field.uid) {
        return this.props.field
      } else if (field.uid == this.props.field.uid) {
        return fields[index + 1]
      } else {
        return field
      }
    })
    this.updateSettings(newFields)
  }

  handleRemove(event) {
    event.preventDefault()
    event.stopPropagation()
    if (confirm("Você tem certeza que quer remover este campo?")) {
      const { fields } = this.props.widget.settings
      const newFields = fields.filter(field =>
        field.uid != this.props.field.uid
      )
      this.updateSettings(newFields)
    }
  }

  handleOverlayClick(event) {
    event.preventDefault()
    event.stopPropagation()
    const dirty = this.dirty()
    if (!dirty || (dirty && confirm("Ao sair sem salvar você perderá suas modificações. Deseja sair sem salvar?"))) {
      this.handleCancel(event)
    }
  }

  render(){
    const { canMoveUp, canMoveDown, uid } = this.props
    return(
      <div>
        <div id={"form-" + uid} className={classnames("border p2 mb3 bg-white clearfix relative")} style={{zIndex: 9999}}>
          <div className="col col-6">
            <div className="flex flex-center mb2">
              <div className="col col-4">
                <label className="h5 bold">Título do campo</label>
              </div>
              <div className="col col-8">
                <input
                  className="field-light block full-width"
                  placeholder="Ex: Email"
                  style={{height: '52px'}}
                  type="text"
                  value={this.state.label}
                  onChange={::this.handleLabelChange} />
              </div>
            </div>
            <div className="flex flex-center mb2">
              <div className="col col-4">
                <label className="h5 bold">Texto de ajuda</label>
              </div>
              <div className="col col-8">
                <input
                  className="field-light block full-width"
                  placeholder="Ex: Insira aqui o seu email"
                  style={{height: '52px'}}
                  type="text"
                  value={this.state.placeholder}
                  onChange={::this.handlePlaceholderChange} />
              </div>
            </div>
            <div className="flex flex-center mb2">
              <div className="col col-4">
                <label className="h5 bold">Tipo de campo</label>
              </div>
              <div className="col col-8">
                <select
                  className="field-light block full-width"
                  style={{height: '52px'}}
                  onChange={::this.handleKindChange}
                  value={this.state.kind}>
                  <option value="text">Texto</option>
                  <option value="email">E-mail</option>
                  <option value="number">Número</option>
                </select>
              </div>
            </div>
            <div className="flex flex-center mb2">
              <div className="col col-4">
                <label className="h5 bold">Obrigatório</label>
              </div>
              <div className="col col-8">
                <input id={"required-true-" + uid} type="radio" name={"required-" + uid} value='true' checked={this.state.required == 'true'} onChange={::this.handleRequiredChange} />
                <label className="mr2" htmlFor={"required-true-" + uid}>Sim</label>
                <input id={"required-false-" + uid} type="radio" name={"required-" + uid} value='false' checked={this.state.required == 'false'} onChange={::this.handleRequiredChange} />
                <label htmlFor={"required-false-" + uid}>Não</label>
              </div>
            </div>
          </div>
          <div className="col col-6 px3">
            <div>
              <button disabled={!canMoveUp} className="hover" style={{backgroundColor: 'white'}} onClick={::this.handleMoveUp}>
                <i className="fa fa-chevron-up mr1" />
                Mover para cima
              </button>
            </div>
            <div>
              <button disabled={!canMoveDown} className="hover" style={{backgroundColor: 'white'}} onClick={::this.handleMoveDown}>
                <i className="fa fa-chevron-down mr1" />
                Mover para baixo
              </button>
            </div>
            <div>
              <button className="hover" style={{backgroundColor: 'white'}} onClick={::this.handleRemove}>
                <i className="fa fa-trash mr1" />
                Remover
              </button>
            </div>
            <div className="mt1 ml2">
              <button className="button caps bg-darken-3 p2 mr2" onClick={::this.handleCancel}>
                Cancelar
              </button>
              <button disabled={this.state.loading} className="button caps bg-aqua p2 mr2" onClick={::this.handleSave}>
                {this.state.loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
        <div
          className="fixed top-0 right-0 bottom-0 left-0"
          onClick={::this.handleOverlayClick}
          style={{zIndex: 9998}} />
      </div>
    )
  }
}
