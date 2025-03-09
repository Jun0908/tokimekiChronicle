"use client"

import { useState } from "react"
import { Heart, Trophy, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function VotingSystem() {
  const [players, setPlayers] = useState([
    { id: 1, name: "アイダ", score: 0, image: "/aida.png?height=200&width=200" },
    { id: 2, name: "イイダ", score: 0, image: "/iida.jpg?height=200&width=200" },
    { id: 3, name: "マツオカ", score: 0, image: "/matsuoka.jpg?height=200&width=200" },
  ])

  const handleVote = (playerId: number) => {
    setPlayers(players.map((player) => (player.id === playerId ? { ...player, score: player.score + 1 } : player)))
  }

  const getWinner = () => {
    const maxScore = Math.max(...players.map((player) => player.score))
    return players.filter((player) => player.score === maxScore)
  }

  const winners = getWinner()
  const hasVotes = players.some((player) => player.score > 0)

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">今日のNo.1彼氏を選ぼう！</h1>

      {hasVotes && (
        <div className="mb-8 bg-gradient-to-r from-pink-100 to-rose-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center">
            <Trophy className="mr-2 text-yellow-500" />
            現在のNo.1彼氏
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {winners.map((winner) => (
              <div key={winner.id} className="text-center">
                <p className="text-xl font-bold">{winner.name}</p>
                <Badge variant="secondary" className="text-lg px-3 py-1 mt-1">
                  {winner.score}点
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {players.map((player) => (
          <Card key={player.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 pb-2">
              <CardTitle className="text-center text-xl">{player.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={player.image || "/placeholder.svg"}
                  alt={player.name}
                  className="rounded-full w-32 h-32 object-cover border-4 border-pink-200"
                />
                <Badge className="absolute -bottom-2 right-0 text-lg px-3 py-1 bg-pink-500">{player.score}点</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button
                onClick={() => handleVote(player.id)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all"
              >
                <Heart className="mr-2 h-5 w-5 fill-white" />
                投票する
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">総合得点</h2>
        <div className="inline-flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md">
          {players
            .sort((a, b) => b.score - a.score)
            .map((player) => (
              <div key={player.id} className="flex items-center gap-3 text-lg">
                <span className="font-bold min-w-[80px] text-right">{player.name}:</span>
                <div className="flex items-center">
                  <span className="font-semibold">{player.score}点</span>
                  {player.score === Math.max(...players.map((p) => p.score)) && player.score > 0 && (
                    <ThumbsUp className="ml-2 text-blue-500" size={18} />
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}