import React, { PureComponent } from 'react'
import A_Button from '../components/A_Button.jsx'
import M_Form from '../components/M_Form.jsx'

export default class O_MemoryFormContainer extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      isFormVisible: false
    }
  }

  handleShowForm = () => {
    this.setState({ isFormVisible: true })
  }

  render() {
    const { isFormVisible } = this.state

    return (
      <div className="O_MemoryFormContainer">
        {!isFormVisible && <A_Button onClick={this.handleShowForm} />}

        {isFormVisible && (
          <M_Form
            createMemoryUrl={this.props.createMemoryUrl}
            showMemoryUrl={this.props.showMemoryUrl}
            jwt={this.props.jwt}
          />
        )}
      </div>
    )
  }
}
