import { Admin } from "@/components/admins/Admin";
import { useEffect, useState } from "react";
export const useAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch("https://klikverse-production.up.railway.app/api/admin/admins", {
          method: "GET"
        }).then((response) => {
          if(response.ok){
            response.json().then((data) => {
              const fetchedadmins: Admin[] = data || []
              setAdmins(fetchedadmins)
            })
          }
          setLoading(false)
        })
      }, [])
    return {admins, loading, setAdmins}
}