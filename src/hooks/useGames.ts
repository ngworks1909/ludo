import { Game } from "@/components/game/Game"
import { authTokenState } from "@/store/AuthState";
import { useEffect, useState } from "react"
import { redirect } from "react-router-dom";
import { useRecoilValue } from "recoil";

export const useGames = (gameName: "LUDO" | "FAST_LUSO" | "RUMMY" | "CRICKET") => {
    const token = useRecoilValue(authTokenState)
    
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if(!token){
            redirect('/login');
            return
        }
        fetch(`https://klikverse-production.up.railway.app/api/game/fetchGame/${gameName}`, {
          method: "GET",
          headers: {
            "authorization": token
          },
        }).then((response) => {
          if(response.ok){
            response.json().then((data) => {
              const fetchedGames = data.games || [];
              console.log(fetchedGames)
              setGames(fetchedGames)
            })
          }
          setLoading(false)
        })
      }, [gameName, token])
    return {games, loading, setGames}
}