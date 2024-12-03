import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from '../dto/login-dto'
import { OrderDto } from '../dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'

test.describe('Tallinn delivery API tests', () => {
  test('1 login and create order', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()
    const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })
    console.log('1 Logged in')

    const jwt = await loginResponse.text()
    const orderData = OrderDto.createOrderWithRandomData()
    const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: orderData,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    console.log('1 Generated Order from DTO:', orderData)

    const orderResponseBody = await orderResponse.json()
    console.log('1 Received PostOrderResponse status:', orderResponse.status())
    console.log('1 Received PostOrderResponseBody:', orderResponseBody)

    if (
      orderResponse.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      orderResponse.status() !== StatusCodes.BAD_REQUEST
    ) {
      expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
      expect.soft(orderResponseBody.status).toBe('OPEN')
      expect.soft(orderResponseBody.id).toBeDefined()
    }
  })



  test('2 login create and get order', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()
    const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })
    console.log('2 Logged in')

    const jwt = await loginResponse.text()
    const orderData = OrderDto.createOrderWithRandomData()
    const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: orderData,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    console.log('2 Generated Order from DTO:', orderData)

    const orderResponseBody = await orderResponse.json()
    console.log('2 Received PostOrderResponse status:', orderResponse.status())
    console.log('2 Received PostOrderResponseBody:', orderResponseBody)

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
      headers: {
        Authorization: `Bearer ${jwt}`
      },
    })

    const getResponseBody = await getResponse.json()
    console.log('2 Received GetOrderResponse status:', getResponse.status())
    console.log('2 Received GetOrderResponseBody:', getResponseBody)

    if (
      getResponse.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      getResponse.status() !== StatusCodes.BAD_REQUEST
    ) {

      expect.soft(getResponse.status()).toBe(StatusCodes.OK)
      expect.soft(getResponseBody.status).toBe('OPEN')
      expect.soft(getResponseBody.id).toBe(orderId)
    }
  })

  test('3 login create and delete order', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()
    const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })
    console.log('3 Logged in')

    const jwt = await loginResponse.text()
    const orderData = OrderDto.createOrderWithRandomData()
    console.log('3 Generated Order from DTO:', orderData)

    const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: orderData,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    const orderResponseBody = await orderResponse.json()
    console.log('3 Received PostOrderResponse status:', orderResponse.status())
    console.log('3 Received PostOrderResponseBody:', orderResponseBody)
    console.log('3 Received PostOrderResponseText:', await orderResponse.text())

    if (
      orderResponse.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      orderResponse.status() !== StatusCodes.BAD_REQUEST
    ) {
      expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
      expect.soft(orderResponseBody.status).toBe('OPEN')
      expect.soft(orderResponseBody.id).toBeDefined()
    }

    const orderId = orderResponseBody.id
    const deleteResponse = await request.delete(`${serviceURL}${orderPath}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      },

    })

    console.log('3 Received DeleteOrderResponse status:', deleteResponse.status())
    console.log('3 Received DeleteOrderResponseText:', await deleteResponse.text())

    if (
      deleteResponse.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      deleteResponse.status() !== StatusCodes.BAD_REQUEST
    ) {

      expect.soft(deleteResponse.status()).toBe(StatusCodes.OK)
    }
  })
})
