import moment from 'moment';

export interface ChatType {
  id: number,
  title: string,
  date: string,
  description: string,
  followups: string,
  url: string,
  participants: Array<Participant>,
}


class Chat implements ChatType {
  id: number
  title: string
  date: string
  description: string
  followups: string
  url: string
  participants: Array<Participant>
  constructor(data: ChatType = { id: NaN, title: '', date: '', description: '', followups: '', url: '', participants: []}) {
    this.id = data.id
    this.title = data.title
    this.date = data.date
    this.description = data.description
    this.followups = data.followups
    this.url = data.url
    this.participants = data.participants
  }

  getUserRole(id: number): 'Organizer' | 'Participant' | '' {
    const { role } = this.participants.find((p: Participant) => p.user.toString() === id.toString()) || { role: ''}
    return role 
  }

  isOrganizer(id: number): boolean {
    return this.getUserRole(id) === 'Organizer'
  }

  get formattedDate(): string {
    let dateFormat = moment(this.date) > moment() ? 'M/D/YYYY @ h:mm A' : 'M/D/YYYY'
    return moment(this.date).format(dateFormat)
  }

  get valid() {
    return !Number.isNaN(this.id)
  }

  get upcoming(): boolean {
    return moment(this.date) > moment()
  }
}

export default Chat
