export type UserType = {
  id?: number,
  pk?: number,
  firstName: string,
  lastName: string,
  url?: string | undefined
  email?: string | undefined,
}

class User {
  id: number
  firstName: string
  lastName: string
  url: string | undefined
  email: string | undefined

  constructor(data: UserType = { id: NaN, firstName :'', lastName: '', url: ''}) {
    this.id = data.id || data.pk || NaN
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.email = data.email
    this.url = data.url

  }

  get displayName (): string {
    if (!this.firstName && !this.lastName) {
      return 'Anonymous'
    } else if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`
    }
    return this.firstName
  }

  get valid() {
    return !Number.isNaN(this.id)
  }
}

export default User
