import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Clock, Coins, Gift, HandCoins } from "lucide-react";

export default function HomeView() {
  const timeToNextTicket = 42;
  const userPoints = 350;

  const tickets = [
    { 
      name: 'Basique', 
      price: 0,
      color: 'bg-gray-100', 
      textColor: 'text-gray-700',
      minReward: 20,
      maxReward: 100,
      isTimeLimited: true,
      available: false
    },
    { 
      name: 'Standard', 
      price: 100, 
      color: 'bg-blue-100', 
      textColor: 'text-blue-700',
      minReward: 40,
      maxReward: 200,
      isTimeLimited: false
    },
    { 
      name: 'Premium', 
      price: 200, 
      color: 'bg-purple-100', 
      textColor: 'text-purple-700',
      minReward: 80,
      maxReward: 400,
      isTimeLimited: false
    },
    { 
      name: 'Élite', 
      price: 350, 
      color: 'bg-amber-100', 
      textColor: 'text-amber-700',
      minReward: 150,
      maxReward: 750,
      isTimeLimited: false
    },
    { 
      name: 'Légendaire', 
      price: 500, 
      color: 'bg-rose-100', 
      textColor: 'text-rose-700',
      minReward: 200,
      maxReward: 1500,
      isTimeLimited: false
    },
  ];

  return (
    <div className="container py-10 max-w-4xl mx-auto mt-11">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tickets à Gratter</h1>
        <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-lg">
          <HandCoins className="text-yellow-500" />
          <span className="font-semibold">{userPoints} points</span>
        </div>
      </div>
      
      {/* Section ticket gratuit */}
      <div className="mb-8 bg-slate-50 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Gift className="text-green-500" />
            Ticket gratuit
          </h2>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock size={14} />
            {Math.floor(timeToNextTicket / 60)}h {timeToNextTicket % 60}min
          </Badge>
        </div>
        <p className="text-sm text-slate-600 mb-3">Vous avez droit à un ticket basique gratuit toutes les heures</p>
        <Progress value={((60 - timeToNextTicket) / 60) * 100} className="h-2 mb-3" />
        <Button 
          disabled={timeToNextTicket > 0} 
          className="w-full mt-2"
          variant={timeToNextTicket > 0 ? "outline" : "default"}
        >
          {timeToNextTicket > 0 ? "Disponible bientôt" : "Récupérer ticket gratuit"}
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Tickets Premium</h2>
      <p className="text-sm text-slate-600 mb-6">Utilisez vos points pour acheter des tickets avec de meilleures récompenses</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {tickets.slice(1).map((ticket, index) => (
          <Card key={index} className={cn("hover:shadow-lg transition-all min-w-72 border-0", ticket.color)}>
            <CardHeader className="gap-0">
              <CardTitle className={cn("text-xl", ticket.textColor)}>{ticket.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-center items-center mb-3">
                <div className={cn("text-2xl font-bold flex items-center gap-2", ticket.textColor)}>
                  <Coins size={24} />
                  {ticket.price} points
                </div>
              </div>
              <p className="text-center text-sm">
                Gagnez entre {ticket.minReward} et {ticket.maxReward} points
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant={userPoints >= ticket.price ? "default" : "outline"} 
                disabled={userPoints < ticket.price}
                className={cn(
                  "w-full text-sm font-semibold",
                  userPoints >= ticket.price ? "text-white cursor-pointer" : "text-gray-500"
                )}
              >
                {userPoints >= ticket.price ? "Acheter et gratter" : "Points insuffisants"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Section d'explication */}
      <div className="mt-10 bg-slate-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Comment ça marche</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">1.</span> Récupérez votre ticket basique gratuit chaque heure
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">2.</span> Grattez votre ticket pour gagner des points
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">3.</span> Utilisez vos points pour acheter des tickets premium
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">4.</span> Les tickets plus chers offrent de meilleures récompenses
          </li>
        </ul>
      </div>
    </div>
  );
}