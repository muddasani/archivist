import { Component, Input } from 'substance'

class TextField extends Component {

  render($$) {
    let config = this.props.config
    let el = $$('div').addClass('sc-field-text sc-field-' + this.props.fieldId)

    let input = $$(Input, {type: config.dataType, placeholder: config.placeholder})
      .ref('input')
      .on('change', this._onChange)
    
    el.append(
      input,
      $$('div').addClass('help').append(config.placeholder)
    )
    
    return el
  }

  setValue(value) {
    this.refs.input.val(value)
  }

  getValue() {
    return this.refs.input.val()
  }

  _onChange() {
    let name = this.props.fieldId
    let value = this.getValue()
    this.emit('commit', name, value)
  }

}

export default TextField