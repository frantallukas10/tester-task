import { test, expect } from '@playwright/test'
import { invalidCredentials, validCredentials } from '../constants/credentials'

const baseUrl = 'http://localhost:8080'
const endpoint = '/api/token'

test.describe('Login functionality API Tests', () => {
  test('should return 200 and token for valid credentials', async ({ request }) => {
    const response = await request.post(`${baseUrl}${endpoint}`, {
      form: validCredentials,
    })
    expect(response.status()).toBe(200)
    const setCookie = response.headers()['set-cookie']
    expect(setCookie).toContain('wt=')
    const contentType = response.headers()['content-type']
    expect(contentType).toBe('text/plain; charset=utf-8')
    const responseBody = await response.text()
    expect(responseBody).toBeTruthy()
  })

  invalidCredentials.forEach((credentials, index) => {
    test(`should return 401 for invalid credentials with ${credentials.username} and ${
      credentials.password
    }  [Test Case #${index + 1}]`, async ({ request }) => {
      const response = await request.post(`${baseUrl}${endpoint}`, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form: credentials as any, // Bypass type checking because I want to test invalid credentials
      })
      expect(response.status()).toBe(401)
      const contentType = response.headers()['content-type']
      expect(contentType).toBe('text/plain; charset=utf-8')
      const responseBody = (await response.text()).trim()
      expect(responseBody).toBe('invalid credentials')
    })
  })
})
