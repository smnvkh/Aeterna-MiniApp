import React, { PureComponent } from 'react'
import Cookies from 'js-cookie'

export default class M_Form extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      familyMembers: [],
      formData: {
        title: '',
        body: '',
        family_member: '',
        category_list: '',
        tag_list: '',
        date: '',
        image: null
      }
    }
  }

  componentDidMount() {
    const jwt = Cookies.get('jwt')
    console.log('JWT:', jwt)

    fetch('http://localhost:3000/api/v1/family_members.json', {
      headers: { Authorization: `Bearer ${jwt}` }
    })
      .then((res) => {
        console.log('STATUS:', res.status)
        return res.json()
      })
      .then((data) => {
        console.log('DATA:', data)
        this.setState({ familyMembers: data })
      })
      .catch((err) => {
        console.error('ERROR:', err)
      })
  }

  handleChange = (e) => {
    const { name, value, files } = e.target

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: files ? files[0] : value
      }
    }))
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { createMemoryUrl } = this.props
    const { formData } = this.state
    const jwt = Cookies.get('jwt')

    const data = new FormData()

    for (const key in formData) {
      data.append(`memory[${key}]`, formData[key])
    }

    fetch(createMemoryUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      body: data
    })
      .then((res) => res.json())
      .then((response) => {
        window.location.href = `http://localhost:8080/memories/show.html?memory=${response.id}`
      })
  }

  render() {
    const { familyMembers } = this.state

    return (
      <form className="M_Form" onSubmit={this.handleSubmit}>
        <input
          name="title"
          placeholder="Название"
          required
          onChange={this.handleChange}
        />

        <textarea
          name="body"
          placeholder="Текст воспоминания"
          onChange={this.handleChange}
        />

        <select name="family_member_id" required onChange={this.handleChange}>
          <option value="">Выберите родственника</option>

          {familyMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.relation} {member.name}
            </option>
          ))}
        </select>

        <select name="category_list" onChange={this.handleChange}>
          <option value="">Выберите категорию</option>
          <option value="Summer">Лето</option>
          <option value="Childhood">Детство</option>
          <option value="Pets">Питомцы</option>
          <option value="Holidays">Праздники</option>
        </select>

        <input
          name="tag_list"
          placeholder="Теги"
          onChange={this.handleChange}
        />

        <input type="date" name="date" required onChange={this.handleChange} />

        <input type="file" name="image" onChange={this.handleChange} />

        <button type="submit">Создать</button>
      </form>
    )
  }
}
