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
  upcoming: boolean
  description: string
  followups: string
  url: string
  participants: Array<Participant>
  constructor(data: ChatType = { id: NaN, title: '', date: '', description: '', followups: '', url: '', participants: []}) {
    this.id = data.id
    this.title = data.title
    let dateFormat = moment(data.date) > moment() ? 'M/D/YYYY @ h:mm A' : 'M/D/YYYY'
    this.date = moment(data.date).format(dateFormat)
    this.upcoming = moment(data.date) > moment()
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

  get valid() {
    return !Number.isNaN(this.id)
  }
}

export default Chat
