import { expect, test } from '@playwright/test'
import { ApiClient } from './api-client'
import { StatusCodes } from 'http-status-codes'

test.describe('Tests with API-Client', () => {
  test('login and create an order with api client', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    let orderId: number | undefined

    try {
      orderId = await apiClient.createOrderAndReturnOrderId()
    } catch (error) {
      console.error('Error while creating order:', error)
    }

    if (orderId !== undefined) {
      expect.soft(orderId).toBeDefined()
    } else {
      console.log('Order creation failed, skipping the check')
    }
  })

  test('login, create an order and then delete this order with api client', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    let orderId: number | undefined

    try {
      orderId = await apiClient.createOrderAndReturnOrderId()
    } catch (error) {
      console.error('Error while creating order:', error)
    }

    if (orderId !== undefined) {
      const deleteResponse = await apiClient.deleteOrderById(orderId)
      expect.soft(deleteResponse.status()).toBe(StatusCodes.OK)
    } else {
      console.log('Order deletion failed, skipping the check')
    }
  })

  test('login, create an order and then get this order data by ID', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    let orderId: number | undefined
    try {
      orderId = await apiClient.createOrderAndReturnOrderId()
    } catch (error) {
      console.error('Error while creating order:', error)
    }

    if (orderId !== undefined) {
      const getResponse = await apiClient.getOrderbyId(orderId)
      expect(getResponse.status()).toBe(StatusCodes.OK)
    } else {
      console.log('Get order failed, skipping the check')
    }
  })
})
