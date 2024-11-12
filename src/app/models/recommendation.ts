export interface Recommendation {
  id: number,
  collectionId: number,
  userId: number,
  recommendationId: bigint,
  title: string,
  image: string
}
