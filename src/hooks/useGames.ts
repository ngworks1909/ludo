import { Game } from "@/components/game/Game"
import { host } from "@/lib/host";
import { authTokenState } from "@/store/AuthState";
import { useEffect, useState } from "react"
import { redirect } from "react-router-dom";
import { useRecoilValue } from "recoil";

export type GameName = "LUDO" | "FAST_LUDO" | "RUMMY" | "CRICKET" | "MEMORYGAME"

export const useGames = (gameName: GameName) => {
    const token = useRecoilValue(authTokenState)
    
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if(!token){
            setLoading(false)
            redirect('/login');
            return
        }
        fetch(`${host}/api/game/fetchGame/${gameName}`, {
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
      }, [token])
    return {games, loading, setGames}
}