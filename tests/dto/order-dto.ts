export class OrderDto {
  status: string
  courierId: number | undefined
  customerName: string
  customerPhone: string
  comment: string
  id: number | undefined

  constructor(
    status: string,
    courierId: number | undefined,
    customerName: string,
    customerPhone: string,
    comment: string,
    id: number | undefined,
  ) {
    this.status = status
    this.courierId = courierId
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
    this.id = id
  }

  static generateNativeAmericanName(): string {
    const firstParts = [
      'Ahanu',
      'Chenoa',
      'Takwita',
      'Nashoba',
      'Ahyoka',
      'Yuma',
      'Tasunka',
      'Kanti',
      'Adoette',
      'Mansi',
      'Winona',
      'Shikoba',
    ]

    const secondParts = [
      'Ayita',
      'Maka',
      'Waya',
      'Aponi',
      'Kimi',
      'Zuni',
      'Tala',
      'Atsa',
      'Yiska',
      'Isi',
      'Cholena',
      'Nita',
    ]

    const firstPart = firstParts[Math.floor(Math.random() * firstParts.length)]
    const secondPart = secondParts[Math.floor(Math.random() * secondParts.length)]

    return `${firstPart} ${secondPart}`
  }

  static generatePhoneNumber(): string {
    const randomDigits = Math.floor(10000 + Math.random() * 10000) // Генерация 5 случайных цифр
    return `+372${randomDigits}`
  }

  static createOrderWithRandomData(): OrderDto {
    return new OrderDto(
      'OPEN',
      undefined,
      this.generateNativeAmericanName(),
      this.generatePhoneNumber(),
      'Not spicy please',
      undefined,
    )
  }
}
