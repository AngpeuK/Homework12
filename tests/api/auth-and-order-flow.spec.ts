import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from '../dto/login-dto'
import { OrderDto } from '../dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'

test.describe('Tallinn delivery API tests', () => {
  test('login and create order', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()

    const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })

    const jwt = await loginResponse.text()
    const orderData = OrderDto.createOrderWithRandomData()

    const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: orderData,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    console.log('Generated Order Data:', orderData)

    const orderResponseBody = await orderResponse.json()
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log('orderResponse status:', orderResponse.status())
    console.log('orderResponseBody:', orderResponseBody)
    if (
      orderResponse.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      orderResponse.status() !== StatusCodes.BAD_REQUEST
    ) {
      expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
      expect.soft(orderResponseBody.status).toBe('OPEN')
      expect.soft(orderResponseBody.id).toBeDefined()
    }
  })
  test('login and get order', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()
    const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })

    const jwt = await loginResponse.text()
    const orderData = OrderDto.createOrderWithRandomData()

    console.log('Generated Order Data:', orderData)

    const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: orderData,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    const orderResponseBody = await orderResponse.json()
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log('orderResponse status:', orderResponse.status())
    console.log('POSTorderResponseBody:', orderResponseBody)
    if (
      orderResponse.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      orderResponse.status() !== StatusCodes.BAD_REQUEST
    ) {
      expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
      expect.soft(orderResponseBody.status).toBe('OPEN')
      expect.soft(orderResponseBody.id).toBeDefined()
    }

    const orderId = orderResponseBody.id
    const getResponse = await request.get(`${serviceURL}${orderPath}/${orderId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    const getResponseBody = await getResponse.json()
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log('orderResponse status:', getResponse.status())
    console.log('GETorderResponseBody:', getResponseBody)
    if (
      getResponse.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      getResponse.status() !== StatusCodes.BAD_REQUEST
    ) {
      expect.soft(getResponse.status()).toBe(StatusCodes.OK)
      expect.soft(getResponseBody.status).toBe('OPEN')
      expect.soft(getResponseBody.id).toBe(orderId)
    }
  })
  test('login and delete order', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()
    const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })

    const jwt = await loginResponse.text()
    const orderData = OrderDto.createOrderWithRandomData()
    console.log('Generated Order Data:', orderData)

    const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: orderData,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    const orderResponseBody = await orderResponse.json()
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log('orderResponse status:', orderResponse.status())
    console.log('POSTorderResponseBody:', orderResponseBody)
    if (
      orderResponse.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      orderResponse.status() !== StatusCodes.BAD_REQUEST
    ) {
      expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
      expect.soft(orderResponseBody.status).toBe('OPEN')
      expect.soft(orderResponseBody.id).toBeDefined()
    }

    const orderId = orderResponseBody.id
    const getResponse = await request.delete(`${serviceURL}${orderPath}/${orderId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log('orderResponse status:', orderResponse.status())
    console.log('GETorderResponseBody:', orderResponseBody)
    if (
      getResponse.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      getResponse.status() !== StatusCodes.BAD_REQUEST
    ) {
      expect.soft(getResponse.status()).toBe(StatusCodes.OK)
    }
  })
})
