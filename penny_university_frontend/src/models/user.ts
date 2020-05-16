export type UserType = {
  id: number,
  firstName: string,
  lastName: string,
}

class User {
  id: number
  firstName: string
  lastName: string

  constructor(data: UserType = { id: NaN, firstName :'', lastName: ''}) {
    this.id = data.id
    this.firstName = data.firstName
    this.lastName = data.lastName

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
