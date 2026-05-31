"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserDetailContext } from '@/context/UserDetailContext'
import { api } from '@/convex/_generated/api'
import axios from 'axios'
import { useMutation } from 'convex/react'
import { LoaderCircle, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import { toast } from 'sonner'

function CreateAd() {
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState(false);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const router = useRouter();
    const CreateNewVideoData = useMutation(api.videoData.CreateNewVideoData)

    const GenerateAIVideoScript = async () => {

        if (userDetail?.credits < 10) {
            toast('Please add more credits!')
            return;
        }

        setLoading(true);
        const result = await axios.post('/api/generate-script', {
            topic: userInput
        });
        const RAWResult = (result?.data).replace('```json', '').replace('```', '');
        const JSONResult = JSON.parse(RAWResult);
        const resp = await CreateNewVideoData({
            uid: userDetail?._id,
            topic: userInput,
            scriptVariant: JSONResult
        });
        console.log(resp);
        setLoading(false);
        // Redirect user to new Route

        router.push('/workspace/create-ad/' + resp);

        if (!userInput?.trim()) {
            toast('Please enter product name or product link');
            return;
        }

    }

    return (
        <div className=' mt-20 flex flex-col items-center justify-center w-full '>
            <div>
                <Image src={'/advertisement.png'} alt='icon' width={150} height={150} />
            </div>
            <h2 className='font-bold text-2xl text-center'>Create AI-ADS for your product! 🎥</h2>
            <p className='mt-3 text-lg text-gray-500'>Fast sell ​​anything and never pay for expensive advertising again! 🚀
            </p>


            <Input
                placeholder='Enter product name or product link'
                className={'w-lg text-lg mt-5'}
                onChange={(e) => setUserInput(e.target.value)}
            />

            <Button className={'mt-5 w-md'} onClick={GenerateAIVideoScript}
                disabled={loading}
            > {loading ? <LoaderCircle className='animate-spin' /> : <Sparkles />} Generate</Button>
        </div>
    )
}

export default CreateAd