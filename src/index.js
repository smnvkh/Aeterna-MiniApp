import { createElement } from 'react'
import './index.css'
import Cookies from 'js-cookie'

function initSubscriptionForm() {
  const form = document.getElementById('subscription_form')
  const input = document.querySelector('input[type=email]')
  const submit = document.querySelector('input[type=submit]')
  const url = form.action

  submit.addEventListener('click', (e) => {
    e.preventDefault()

    const params = {
      subscription: {
        email: input.value
      }
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const container = document.createElement('div')

        const message = document.createElement('p')
        message.innerText = data.success_text

        const link = document.createElement('a')
        link.innerText = 'Посмотрите примеры воспоминаний'
        link.href = '/preview.html'

        container.appendChild(message)
        container.appendChild(link)

        form.replaceWith(container)
      })
  })
}

function authorizeUser() {
  const jwt = Cookies.get('jwt')
  let inviteElement

  if (jwt) {
    fetch('http://localhost:3000/api/v1/authorize_by_jwt.json', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)

        if (data.is_success) {
          const element = document.createElement('div')
          const headingText = document.querySelector('.HeadingText')
          const ctaButton = document.querySelector('.CTA')
          const heading = document.querySelector('.Heading')
          element.innerText = `Привет, ${data.email}!`

          const signOutButton = document.createElement('div')
          signOutButton.classList.add('textButton')
          signOutButton.innerText = 'Выйти'

          if (headingText) {
            headingText.replaceWith(element)
          }
          if (heading) {
            heading.appendChild(signOutButton)
          }
          if (ctaButton) {
            ctaButton.style.display = 'none'
          }

          if (data.invite_code) {
            inviteElement = document.createElement('div')
            inviteElement.innerText = `Ваш код приглашения для родственников: ${data.invite_code}`
            document.body.appendChild(inviteElement)
          }

          signOutButton.addEventListener('click', () => {
            fetch('http://localhost:3000/api/v1/sign_out.json', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${jwt}`
              }
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data)

                if (headingText) {
                  element.replaceWith(headingText)
                }
                if (heading) {
                  heading.removeChild(signOutButton)
                }
                if (ctaButton) {
                  ctaButton.style.display = 'block'
                }
                element.remove()
                if (inviteElement) inviteElement.remove()
                Cookies.remove('jwt')
                initLoginForm()
                initSignupForm()
              })
          })
        } else {
          Cookies.remove('jwt')
          initLoginForm()
          initSignupForm()
        }
      })
  } else {
    initLoginForm()
    initSignupForm()
  }
}

function initLoginForm() {
  const form = document.getElementById('login_form')
  const url = form.action
  form.classList.remove('hidden')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(form)

    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        console.log(data.jwt)

        Cookies.set('jwt', data.jwt)
        window.location.reload()
      })
  })
}

function initSignupForm() {
  const form = document.getElementById('signup_form')
  const url = form.action
  form.classList.remove('hidden')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(form)

    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        console.log(data.jwt)

        Cookies.set('jwt', data.jwt)
        window.location.reload()
      })
  })
}

function initPreviewPage() {
  const container = document.querySelector('.memoriesSection')
  const url = container.dataset.url

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((memory) => {
        createMemoryPreview(memory, container)
      })
    })
}

function createMemoryPreview(memoryData, container) {
  const wrapper = document.createElement('div')
  wrapper.id = `memory_${memoryData.id}`

  const link = document.createElement('a')
  link.href = `${container.dataset.memoryUri}?memory=${memoryData.id}`
  link.innerText = memoryData.title

  const title = document.createElement('h2')
  title.appendChild(link)

  const body = document.createElement('p')
  body.innerText = memoryData.body

  const familyMember = document.createElement('p')
  familyMember.innerText =
    memoryData.family_member.to_s || memoryData.family_member

  const date = document.createElement('p')
  date.innerText = memoryData.date

  const image = document.createElement('img')
  image.src = memoryData.image_url
  image.width = 300

  wrapper.appendChild(title)
  wrapper.appendChild(body)
  wrapper.appendChild(familyMember)
  wrapper.appendChild(date)
  wrapper.appendChild(image)

  container.appendChild(wrapper)
}

function initMemoryPage() {
  const searchParams = new URLSearchParams(window.location.search)
  const id = searchParams.get('memory')
  const url = document.body.dataset.url

  fetch(url + id)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      createMemoryPreview(data, document.body)
    })
}

function initNewMemoryForm() {
  const container = document.querySelector('.newMemoryForm')
  if (!container) return

  const createMemoryUrl = container.dataset.createMemoryUrl
  const jwt = Cookies.get('jwt')

  const addMemoryButton = document.createElement('div')
  addMemoryButton.innerText = 'Добавить воспоминание'
  addMemoryButton.classList.add('addMemoryButton')

  container.appendChild(addMemoryButton)

  let formVisible = false

  addMemoryButton.addEventListener('click', () => {
    if (formVisible) return

    const form = document.createElement('form')
    form.classList.add('memoryForm')
    form.style.display = 'block' // чтобы сразу показывалось

    // Создаем базовые поля
    form.innerHTML = `
      <input name="memory[title]" placeholder="Название" required />
      <textarea name="memory[body]" placeholder="Текст воспоминания"></textarea>
      <select name="memory[family_member_id]" required>
        <option value="">Выберите родственника</option>
      </select>
      <select name="memory[category_list]">
        <option value="">Выберите категорию</option>
        <option value="Summer">Summer</option>
        <option value="Childhood">Childhood</option>
        <option value="Pets">Pets</option>
        <option value="Holidays">Holidays</option>
      </select>
      <input name="memory[tag_list]" placeholder="Теги" />
      <input type="date" name="memory[date]" required />
      <input type="file" name="memory[image]" />
      <button type="submit">Создать</button>
    `

    container.appendChild(form)
    formVisible = true

    const familySelect = form.querySelector(
      'select[name="memory[family_member_id]"]'
    )

    // Подгружаем родственников через API
    fetch('http://localhost:3000/api/v1/family_members.json', {
      headers: { Authorization: `Bearer ${jwt}` }
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((member) => {
          const option = document.createElement('option')
          option.value = member.id
          option.innerText = member.name
          familySelect.appendChild(option)
        })
      })

    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const formData = new FormData(form)

      fetch(createMemoryUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.id) {
            alert(
              'Ошибка создания: ' +
                (data.errors?.join(', ') || 'неизвестная ошибка')
            )
            return
          }

          window.location.href = `http://localhost:8080/memories/show.html?memory=${data.id}`
        })
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  if (
    document.body.classList.contains('home') &&
    document.body.classList.contains('index')
  ) {
    initSubscriptionForm()
    authorizeUser()
  }

  if (
    document.body.classList.contains('memories') &&
    document.body.classList.contains('index')
  ) {
    initPreviewPage()
  }

  if (
    document.body.classList.contains('memories') &&
    document.body.classList.contains('show')
  ) {
    initMemoryPage()
  }

  if (
    document.body.classList.contains('memories') &&
    document.body.classList.contains('new')
  ) {
    authorizeUser()
    // initNewMemoryForm()
  }
})
