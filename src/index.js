import { createElement } from 'react'
import './index.css'

function initSubscriptionForm() {
  const form = document.querySelector('form')
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
        link.innerText = 'Посмотреть примеры воспоминаний'
        link.href = '/preview.html'

        container.appendChild(message)
        container.appendChild(link)

        form.replaceWith(container)
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

function createMemoryPreview(memory, container) {
  const wrapper = document.createElement('div')
  wrapper.id = `memory_${memory.id}`

  const body = document.createElement('p')
  body.innerText = memory.body

  const familyMember = document.createElement('h2')
  familyMember.innerText = memory.family_member

  const date = document.createElement('p')
  date.innerText = memory.date

  const image = document.createElement('img')
  image.src = memory.image_url
  image.width = 300

  wrapper.appendChild(familyMember)
  wrapper.appendChild(image)
  wrapper.appendChild(date)
  wrapper.appendChild(body)

  container.appendChild(wrapper)

  wrapper.classList.add('Memory')
  familyMember.classList.add('MemoryAuthor')
  image.classList.add('ImageMemory')
  date.classList.add('MemoryDate')
  body.classList.add('MemoryDescription')
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('index')) {
    initSubscriptionForm()
  }

  if (document.body.classList.contains('preview')) {
    initPreviewPage()
  }
})
