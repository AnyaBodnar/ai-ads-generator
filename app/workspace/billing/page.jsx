"use client"
import { Button } from "@/components/ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import { CircleDollarSign } from "lucide-react";
import { useContext, useEffect } from "react";
import { toast } from "sonner";

export const creditsPlans = [
    {
        credits: 80,
        cost: 5,

    },
    {
        credits: 200,
        cost: 10,

    },
    {
        credits: 450,
        cost: 20,

    },
    {
        credits: 1500,
        cost: 50,

    },

]
function Billing() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const updateUserCredits = useMutation(api.users.updateUserCredits)



    const onPaymentSuccess = async (cost, credits) => {
        // Update Credits
        setUserDetail(prev => ({
            ...prev,
            credits: Number(userDetail?.credits) + credits
        }))

        // Update Credits to DB
        const resp = await UpdateUserCredits({
            credits: Number(userDetail?.credits) + credits,
            uid: userDetail?._id
        });
        console.log(resp);
        toast('Credits addedd successfully!')
    }

    return (
        <div>
            <h2 className='font-bold text-3xl'>Credits</h2>

            <div className='p-4 border  rounded-xl flex justify-between  mt-7 max-w-2xl'>
                <div>
                    <h2 className=' font-bold text-xl'>Total Credits Left</h2>
                    <h2 className='text-sm'>10 Credits = 1 Video</h2>
                </div>
                <h2 className='font-bold text-3xl '>{userDetail?.credits} Credits</h2>
            </div>
            <p className='text-sm p-5 text-gray-500 max-w-2xl'>When your credit balance reaches $0, your Video generation will stop working. Add Credits balance topped up.</p>
            <div className='mt-5'>
                <h2 className='font-bold text-2xl'>Buy More Credits</h2>

                <div className=''>
                    {creditsPlans.map((plan, index) => (
                        <div key={index} className='p-5 mt-3 border rounded-xl max-w-2xl flex justify-between items-center'>
                            <h2 className=' text-xl flex gap-2 items-center'>
                                <CircleDollarSign /> <strong>{plan?.credits}</strong> Credits</h2>
                            <div className='flex gap-2 items-center'>
                                <h2 className='font-medium text-xl'>{plan.cost} $</h2>

                                {/* <Button>Buy Now</Button> */}
                                <PayPalButtons
                                    style={{ 'layout': 'horizontal' }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: plan.cost,
                                                        currency_code: 'USD'
                                                    }
                                                }
                                            ]
                                        })
                                    }}
                                    onApprove={() => onPaymentSuccess(plan.cost, plan.credits)}
                                    onCancel={() => toast('Payment cancelled')}
                                />
                            </div>
                        </div>
                    ))}
                </div>


            </div>

            {/* */}
        </div>
    )
}

export default Billing