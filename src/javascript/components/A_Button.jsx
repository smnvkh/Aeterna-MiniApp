import React, { PureComponent } from 'react'

export default class A_Button extends PureComponent {
  render() {
    const { onClick } = this.props

    return (
      <button type="button" className="A_Button" onClick={onClick}>
        Добавить воспоминание
      </button>
    )
  }
}
