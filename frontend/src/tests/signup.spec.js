import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RegisterForm from '../pages/register/RegisterForm'
import Wrapper from '../../common/Wrapper'
import LayoutPublic from '../components/navbars/NavbarPublic'
import userEvent from '@testing-library/user-event'
import { expect, it, describe } from '@jest/globals'
import { act } from 'react'

describe('Register.js', () => {
  it('should navigate and render sign up page when the register link is clicked on the home page', async () => {
    render(
      <Wrapper>
        <MemoryRouter initialIndex={0} initialEntries={['/']}>
          <Routes>
            <Route path='/' element={<LayoutPublic />} />
            <Route path='/register' element={<RegisterForm />} />
          </Routes>
        </MemoryRouter>
      </Wrapper>
    )
    act(() => {
      userEvent.click(screen.getByRole('link', { name: 'Register' }))
    })
    expect(await screen.findByTestId('username element')).toBeInTheDocument()
  })
})
