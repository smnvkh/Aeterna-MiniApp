import React from 'react'
import { createRoot } from 'react-dom/client'
import Cookies from 'js-cookie'

import O_MemoryFormContainer from './containers/O_MemoryFormContainer.jsx'

const container = document.querySelector('.newMemoryForm')
const createMemoryUrl = container.dataset.createMemoryUrl
const showMemoryUrl = container.dataset.showMemoryUrl
const jwt = Cookies.get('jwt')
const root = createRoot(container)

root.render(
  <O_MemoryFormContainer
    createMemoryUrl={createMemoryUrl}
    showMemoryUrl={showMemoryUrl}
    jwt={jwt}
  />
)
