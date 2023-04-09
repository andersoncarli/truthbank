const searchButton = document.getElementById('search-button')
const queryInput = document.getElementById('query')
const responseParagraph = document.getElementById('response')

const socket = new WebSocket('ws://localhost:3001')
socket.addEventListener('close', () => {
  // Reload the page when the server sends a message
  console.log('File changed. Reloading..')
  setTimeout(() => location.reload(), 1000)
})

socket.addEventListener('message', (event) => {
  console.log('Message from server:', event.data)
  // Reload the page when the server sends a message
  // setTimeout(()=>location.reload(), 100)
})

searchButton.addEventListener('click', () => {
  const query = queryInput.value.trim()
  if (query) {
    fetch(`/query?q=${query}`)
      .then(response => response.json())
      .then(data => {
        const response = data.response
        responseParagraph.textContent = response
      })
      .catch(error => {
        console.error(error)
        responseParagraph.textContent = 'An error occurred while processing your request.'
      })
  }
})

