import { useEffect, useState } from "react";
import { User } from "@/components/users/User";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch("https://klikverse-production.up.railway.app/api/user/fetchalluser", {
          method: "GET"
        }).then((response) => {
          if(response.ok){
            response.json().then((data) => {
              const fetchedusers: User[] = data.users || []
              console.log(fetchedusers)
              setUsers(fetchedusers)
            })
          }
          setLoading(false)
        })
      }, [])
    return {users, loading, setUsers}
}