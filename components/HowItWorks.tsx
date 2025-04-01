import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export default function HowItWorks() {
  return (
    <Card className="mt-8 bg-slate-50">
    <CardHeader>
      <CardTitle>Comment Ça Marche</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-green-500 font-bold">1.</span> Obtenez un ticket gratuit chaque jour
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-500 font-bold">2.</span> Grattez pour révéler vos points gagnés
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-500 font-bold">3.</span> Utilisez vos points pour acheter des tickets premium avec des récompenses plus élevées
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-500 font-bold">4.</span> Maintenez votre série quotidienne pour des bonus supplémentaires
        </li>
      </ul>
    </CardContent>
  </Card>
  )
}
