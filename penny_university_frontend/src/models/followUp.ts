import moment from 'moment';

export interface FollowUpType {
  id: number,
  content: string,
  user: number,
  date: string,
  pennyChat: string,
  url: string,
}

class FollowUp implements FollowUpType {
  id: number
  content: string
  user: number
  date: string
  pennyChat: string
  url: string
  constructor(data: FollowUpType = { id: NaN, content: '', user: NaN, date: '', pennyChat: '', url: ''}) {
    this.id = data.id
    this.content = data.content
    this.user = data.user
    this.date = data.date
    this.pennyChat = data.pennyChat
    this.url = data.url
  }

  get formattedDate(): string {
    return moment(this.date).format('M/D/YYYY')
  }
}

export default FollowUp
