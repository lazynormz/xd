export interface GameInterestedUser {
  displayName: string
  email: string
  id: string
}

export interface Game {
  currentUserWantsToPlay: boolean
  description: string
  genre: string
  id: string
  interestedUsers: GameInterestedUser[]
  priceEur: number
  title: string
}
