import { Ticket } from "@/components/support/Support"
import { useEffect, useState } from "react"

export const useTickets = () => {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch("https://klikverse-production.up.railway.app/api/ticket/tickets", {
          method: "GET"
        }).then((response) => {
          if(response.ok){
            response.json().then((data) => {
              const fetchedtickets: Ticket[] = data.tickets || []
              setTickets(fetchedtickets)
            })
          }
          setLoading(false)
        })
      }, [])
    return {tickets, loading, setTickets}
}