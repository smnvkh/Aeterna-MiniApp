import React, { PureComponent } from 'react'
import Cookies from 'js-cookie'

const tagGroups = {
  Детство: {
    tags: ['Школа', 'Друзья', 'Игры', 'Хобби'],
    color: '#6795d6'
  },
  Юность: {
    tags: ['Выпускной', 'Первая любовь', 'Новые горизонты', 'Мечты'],
    color: '#e19593'
  },
  Взрослая: {
    tags: ['Работа', 'Достижения', 'Дети', 'Амбиции'],
    color: '#f2de97'
  },
  'Общие категории': {
    tags: ['Семья', 'Любовь', 'Счастье', 'Радость', 'Ностальгия'],
    color: '#6d8e6a'
  }
}

export default class M_Form extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      familyMembers: [],
      formData: {
        title: '',
        body: '',
        tag_list: [],
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

  handleTagChange = (tag) => {
    this.setState((prevState) => {
      const tags = [...prevState.formData.tag_list]

      if (tags.includes(tag)) {
        return {
          formData: {
            ...prevState.formData,
            tag_list: tags.filter((t) => t !== tag)
          }
        }
      }

      return {
        formData: {
          ...prevState.formData,
          tag_list: [...tags, tag]
        }
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { createMemoryUrl } = this.props
    const { formData } = this.state
    const jwt = Cookies.get('jwt')

    const data = new FormData()

    for (const key in formData) {
      if (key === 'tag_list') {
        formData.tag_list.forEach((tag) => {
          data.append('memory[tag_list][]', tag)
        })
      } else {
        data.append(`memory[${key}]`, formData[key])
      }
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

        <div className="MemoryFormCategories">
          {Object.entries(tagGroups).map(([group, data]) => (
            <div className="MemoryFormCatGroup" key={group}>
              <span className="MemoryFormCatHeading">{group}</span>

              <div className="tags">
                {data.tags.map((tag) => (
                  <label className="tag MemoryFormTag" key={tag}>
                    <input
                      type="checkbox"
                      checked={this.state.formData.tag_list.includes(tag)}
                      onChange={() => this.handleTagChange(tag)}
                    />

                    <span
                      className="tag-circle"
                      style={{
                        backgroundColor: data.color,
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        display: 'inline-block',
                        marginRight: '6px'
                      }}
                    />

                    {tag}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <input type="date" name="date" required onChange={this.handleChange} />

        <input type="file" name="image" onChange={this.handleChange} />

        <button type="submit">Создать</button>
      </form>
    )
  }
}
