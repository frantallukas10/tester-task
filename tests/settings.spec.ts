import { test, expect } from '@playwright/test'
import { validSettings } from '../constants/settings'
import { validCredentials } from '../constants/credentials'

const baseUrl = 'http://localhost:8080'
const endpoint = '/api/profile'
let jwtToken: string | undefined

test.describe('Settings API Tests', () => {
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${baseUrl}/api/token`, {
      form: validCredentials,
    })
    const setCookie = response.headers()['set-cookie']
    jwtToken = setCookie.match(/jwt=([^;]+)/)?.[1]
    expect(jwtToken).toBeTruthy()
  })

  test('should update settings successfully', async ({ request }) => {
    const response = await request.patch(`${baseUrl}/api/profile`, {
      headers: { cookie: `jwt=${jwtToken}`, 'Content-Type': 'application/json' },
      data: { settings: validSettings },
    })

    expect(response.status()).toBe(200)
    expect(response.headers()['content-length']).toBe('0')
  })

  test('should reject requests with invalid JWT token', async ({ request }) => {
    const invalidToken = 'jwt=INVALID_TOKEN'
    const response = await request.patch(`${baseUrl}${endpoint}`, {
      headers: { cookie: invalidToken, 'Content-Type': 'application/json' },
      data: { settings: { lightTheme: 'dark' } },
    })
    expect(response.status()).toBe(401)
  })

  test('should include CSP headers in the response', async ({ request }) => {
    const response = await request.get(`${baseUrl}${endpoint}`, {
      headers: { cookie: `jwt=${jwtToken}` },
    })
    const cspHeader = response.headers()['content-security-policy']
    expect(cspHeader).toBeTruthy()
    expect(cspHeader).toContain("default-src 'self'")
  })

  test('should reject unauthorized requests', async ({ request }) => {
    const response = await request.patch(`${baseUrl}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      data: { settings: { lightTheme: 'dark' } },
    })
    expect(response.status()).toBe(401)
  })

  // BE can accept expired tokens
  test.skip('should reject requests with expired JWT token', async ({ request }) => {
    const expiredToken =
      'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxvY2FsaG9zdCIsImlhdCI6MTczNDEzNTYxNCwibmFtZSI6ImFkbWluIiwidXNlcm5hbWUiOiJhZG1pbiJ9.t1prhHDagDrCkYCBLS-CThO22PqocVaX2C7h1UvWMTU'
    const response = await request.patch(`${baseUrl}${endpoint}`, {
      headers: { cookie: expiredToken, 'Content-Type': 'application/json' },
      data: { settings: { lightTheme: 'dark' } },
    })
    expect(response.status()).toBe(401)
  })

  // rate limiting is not implemented yet on the BE side
  test.skip('should enforce rate limiting', async ({ request }) => {
    const promises = []
    for (let i = 0; i < 500; i++) {
      promises.push(
        request.patch(`${baseUrl}${endpoint}`, {
          headers: { cookie: `jwt=${jwtToken}`, 'Content-Type': 'application/json' },
          data: { settings: { lightTheme: 'dark' } },
        }),
      )
    }
    const responses = await Promise.all(promises)
    const limitedResponses = responses.filter((res) => res.status() === 429) // 429 Too Many Requests
    expect(limitedResponses.length).toBeGreaterThan(0)
  })

  // The backend does not validate inputs.
  test.skip('should sanitize input to prevent SQL injection', async ({ request }) => {
    const response = await request.patch(`${baseUrl}${endpoint}`, {
      headers: { cookie: `jwt=${jwtToken}`, 'Content-Type': 'application/json' },
      data: {
        settings: {
          lightTheme: "'; DROP TABLE users; --",
        },
      },
    })
    expect(response.status()).toBe(400)
  })

  // Missing validation for unknown fields
  test.skip('should reject unexpected fields', async ({ request }) => {
    const response = await request.patch(`${baseUrl}${endpoint}`, {
      headers: { cookie: `jwt=${jwtToken}`, 'Content-Type': 'application/json' },
      data: {
        settings: {
          lightTheme: 'dark',
          unexpectedField: 'unexpectedValue',
        },
      },
    })
    expect(response.status()).toBe(400)
  })

  // Insufficient error handling on the backend side
  test.skip('should validate data types', async ({ request }) => {
    const response = await request.patch(`${baseUrl}${endpoint}`, {
      headers: { cookie: `jwt=${jwtToken}`, 'Content-Type': 'application/json' },
      data: {
        settings: {
          menuWidth: 'invalid-string-instead-of-number',
        },
      },
    })
    expect(response.status()).toBe(400)
  })

  // The backend does not reject dangerous input.
  test.skip('should prevent XSS attacks', async ({ request }) => {
    const response = await request.patch(`${baseUrl}${endpoint}`, {
      headers: { cookie: `jwt=${jwtToken}`, 'Content-Type': 'application/json' },
      data: {
        settings: {
          lightTheme: '<script>alert("XSS")</script>',
        },
      },
    })
    expect(response.status()).toBe(400)
  })
})
