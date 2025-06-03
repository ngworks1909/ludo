import { authTokenState } from "@/store/AuthState";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

interface DashboardData{
    userCount: number,
    withdrawls: number,
    payments: number
}

export const useDashboard = () => {
    const token = useRecoilValue(authTokenState)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<DashboardData>({
      userCount: 0,
      withdrawls: 0,
      payments: 0
    })
    const navigate = useNavigate()
    useEffect(() => {
        if(!token){
            navigate('/login')
            return
        }
        setLoading(true)
        const fetchData = async() => {
            try {
                const response = await fetch('http://localhost:3000', {
                method: "POST",
            })

            const data = await response.json();
            setData(data)
            } catch (error) {
                console.log(error)
            }
            finally{
                setLoading(false)
            }
        }

        fetchData()

        return () => {
            fetchData()
        }
    }, [])

    return {loading, data}
}