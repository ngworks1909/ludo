import { authTokenState } from "@/store/AuthState";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { redirect } from "react-router-dom";
import { host } from "@/lib/host";

export interface Payment {
    withdrawId: string;
    amount: number;
    status: "PENDING" | "SUCCESS" | "FAILED";
    timestamp: Date;
    user: {
        username: string;
    };
}

export const usePayments = () => {
    const token = useRecoilValue(authTokenState)
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(!token){
            redirect('/login');
            return
        }
        fetch(`${host}/api/admin/fetchallwithdraw`, {
          method: "GET",
          headers: {
            "authorization": token
          },
        }).then((response) => {
          if(response.ok){
            response.json().then((data) => {
              const fetchedpayments = data.withdraws || [];
              console.log(fetchedpayments)
              setPayments(fetchedpayments)
            })
          }
          setLoading(false)
        })
      }, [token]);

      return {payments, loading, setPayments}
}