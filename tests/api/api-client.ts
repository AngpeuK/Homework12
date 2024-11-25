import { APIRequestContext, APIResponse } from 'playwright'
import { LoginDto } from '../dto/login-dto'
import { StatusCodes } from 'http-status-codes'
import { expect } from '@playwright/test'
import { OrderDto } from '../dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'

export class ApiClient {
  static instance: ApiClient
  private request: APIRequestContext
  private jwt: string = ''

  private constructor(request: APIRequestContext) {
    this.request = request
  }

  public static async getInstance(request: APIRequestContext): Promise<ApiClient> {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(request)
      await this.instance.requestJwt()
    }
    return ApiClient.instance
  }

  private async requestJwt(): Promise<void> {
    console.log('Requesting JWT...')
    const authResponse = await this.request.post(`${serviceURL}${loginPath}`, {
      data: LoginDto.createLoginWithCorrectData(),
    })

    if (authResponse.status() !== StatusCodes.OK) {
      console.log('Authorization failed')
      throw new Error(`Request failed with status ${authResponse.status()}`)
    }

    this.jwt = await authResponse.text()
    console.log('jwt received:')
    console.log(this.jwt)
  }

  async createOrderAndReturnOrderId(): Promise<number> {
    console.log('Creating order...')
    const response = await this.request.post(`${serviceURL}${orderPath}`, {
      data: OrderDto.createOrderWithRandomData(),
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    })
    console.log('Order response: ', response)

    if (
      response.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      response.status() !== StatusCodes.BAD_REQUEST
    ) {
      expect(response.status()).toBe(StatusCodes.OK)
      const responseBody = await response.json()
      console.log('Order created: ')
      console.log(responseBody)

      expect.soft(responseBody.status).toBe('OPEN')
      expect.soft(responseBody.id).toBeDefined()
      console.log(responseBody.status)

      return responseBody.id
    } else {
      console.error(`Failed to create order. HTTP Status: ${response.status()}`)
      throw new Error(`Request failed with status ${response.status()}`)
    }
  }

  async getOrderbyId(orderId: number): Promise<APIResponse> {
    console.log('Getting order...')
    if (!this.jwt) throw new Error('Incorrect Credentials')

    const response = await this.request.get(`${serviceURL}${orderPath}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    })

    if (
      response.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      response.status() !== StatusCodes.BAD_REQUEST
    ) {
      expect(response.status()).toBe(StatusCodes.OK)
      const responseBody = await response.json()
      console.log('Order retrieved: ')
      console.log(responseBody)
      expect.soft(responseBody.status).toBe('OPEN')
      expect.soft(responseBody.id).toBe(orderId)
    } else {
      console.error(`Failed to get order. HTTP Status: ${response.status()}`)
      throw new Error(`Request failed with status ${response.status()}`)
    }

    return response
  }

  async deleteOrderById(orderId: number): Promise<APIResponse> {
    console.log('Deleting order...')
    if (!this.jwt) throw new Error('Incorrect Credentials')

    const response = await this.request.delete(`${serviceURL}${orderPath}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    })

    if (
      response.status() !== StatusCodes.INTERNAL_SERVER_ERROR &&
      response.status() !== StatusCodes.BAD_REQUEST
    ) {
      expect(response.status()).toBe(StatusCodes.OK)
      console.log(`Order with ID ${orderId} deleted successfully`)
    } else {
      console.error(`Failed to delete order. HTTP Status: ${response.status()}`)
      throw new Error(`Request failed with status ${response.status()}`)
    }

    return response
  }
}
