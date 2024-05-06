"use client"

import { GetStripeApi, UpdateRayanaAPi, UpdateStripeApi, getRayanaAPi } from "@/lib/services";
import { useEffect, useState } from "react";

interface RayanaApi{
    id: string,
    apikey: string
}

interface StripeKey{  
    id: string,
    secretapikey: string,
    publishableapikey: string
}

const Apipage = () => {
    
    const [paymentapi, setPaymentApi] = useState<StripeKey>({
      id: '',
      secretapikey: '',
      publishableapikey: ''
    });
    const [ryanaapi, setRyanaApi] = useState<RayanaApi>({
      id:'',
      apikey:''
    });
  
    const UpdateRayanaApi = async () => {
      let res =  await UpdateRayanaAPi(ryanaapi)
      setRyanaApi(res)
    };

    const UpdatePaymentApi = async () => {
      let res =  await UpdateStripeApi(paymentapi)
      setRyanaApi(res)
    };

    useEffect(()=>{
      const getApi = async () =>{
        setRyanaApi(await getRayanaAPi())
        setPaymentApi(await GetStripeApi())
      }
      getApi()
    },[])


  return (
    <div className="flex flex-col space-y-6 items-center h-96 justify-center w-full">
    <div className="flex flex-row space-x-4 w-full">
    <div className="min-w-fit inline">Payment Api Key :</div>
    <input
      type="text"
      defaultValue={ryanaapi?.apikey}
      onChange={(e)=>setPaymentApi({...paymentapi,publishableapikey:e?.target.value})}
      className="border border-gray-300 text-black rounded px-2 py-1 w-full"
    />
    <button onClick={UpdatePaymentApi} className="bg-blue-500 text-white px-3 py-1 rounded">
      Update
    </button>
    </div>   
    <div className="flex flex-row space-x-4 w-full">
    <div className="min-w-fit inline">Ryana Api Key :</div>
    <input
      type="text"
      defaultValue={paymentapi.publishableapikey}
      onChange={(e)=>setRyanaApi({...ryanaapi, apikey:e?.target.value})}
      className="border border-gray-300 text-black rounded px-2 py-1 w-full"
    />
    <button onClick={UpdateRayanaApi} className="bg-blue-500 text-white px-3 py-1 rounded">
      Update
    </button>
    </div>    
  </div>
  )
}

export default Apipage