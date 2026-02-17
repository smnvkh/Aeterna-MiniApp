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
          element.innerText = `Привет, ${data.email}!`

          const signOutButton = document.createElement('div')
          signOutButton.classList.add('textButton')
          signOutButton.innerText = 'Выйти'

          document.body.appendChild(element)

          if (data.invite_code) {
            inviteElement = document.createElement('div')
            inviteElement.innerText = `Ваш код приглашения для родственников: ${data.invite_code}`
            document.body.appendChild(inviteElement)
          }

          document.body.appendChild(signOutButton)

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

                element.remove()
                signOutButton.remove()
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
  const container = document.querySelector('.previewMemories')
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
  familyMember.innerText = memoryData.family_member

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

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('index')) {
    initSubscriptionForm()
    authorizeUser()
  }

  if (document.body.classList.contains('memory')) {
    initMemoryPage()
  }

  if (document.body.classList.contains('preview')) {
    initPreviewPage()
  }
})
