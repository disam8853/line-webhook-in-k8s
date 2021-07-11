import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import axios from 'axios'
import LINELoginImg from './line_login_img.png'

function App() {
  const [clientId, setClientId] = useState('')
  const [state, setState] = useState('123')

  useEffect(() => {
    axios
      .get('/config')
      .then((res) => {
        setClientId(res.data.client_id)
      })
      .catch((err) => {
        alert(err.message)
      })

    const search = window.location.search
    const params = new URLSearchParams(search)
    const code = params.get('code')
    if (code)
      axios
        .post('/register', { code })
        .then(() => {
          alert('Register success!')
        })
        .catch((err) => {
          if (err.response?.data.reason) alert(err.response.data.reason)
          else alert('Fail registering')
        })
  }, [])

  const handleLogin = (e) => {
    if (clientId === '') return

    const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${window.location.href}&state=${state}&scope=profile`
    window.location.href = url
  }

  return (
    <Container className='text-center'>
      <h1 className='my-3'>Register LINE Webhook in K8S</h1>

      <img src={LINELoginImg} alt='LINE Login' width='200px' className='line-login' onClick={handleLogin} />
    </Container>
  )
}

export default App
