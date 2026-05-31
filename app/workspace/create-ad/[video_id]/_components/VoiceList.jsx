import axios from 'axios'
import { Mars, Mic, PlayCircleIcon, Venus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

function VoiceList({ videoData, onHandleInputChange }) {

    const [voiceList, setVoiceList] = useState([]);
    const [playAudio, setPlayAudio] = useState();
    const audioRef = useRef(null)
    useEffect(() => {
        GetVoiceList();
    }, [])
    
    const GetVoiceList = async () => {
        try {
            const result = await axios.get('/api/get-voice-list');
    
            console.log('Voice API response:', result.data);
    
            const voices = result.data?.data ?? [];
    
            setVoiceList(Array.isArray(voices) ? voices : []);
        } catch (error) {
            console.error('Get voice list error:', error.response?.data || error.message);
            setVoiceList([]);
        }
    }

    useEffect(() => {
        if (audioRef?.current && playAudio) {
            audioRef?.current.load();
            audioRef?.current?.play();
        }
    }, [playAudio])

    return (
        <div className='p-5 shadow rounded-xl mt-6'>
            <h2 className='font-bold text-lg flex gap-2 items-center'>
                <Mic className='p-2 bg-purple-500 text-white h-10 w-10 rounded-md' />
                Select Voice</h2>
            <hr className='my-3' />
            <audio controls ref={audioRef} className='hidden'>
                <source src={playAudio} type='audio/mp3' />
            </audio>
            <div>
                <label>Select Voice for your video ad</label>
                <div className='grid grid-cols-2 gap-5 w-full h-[200px] overflow-auto'>
                    {voiceList.map((voice, index) => (
                        <div
                            key={index}
                            className={`flex justify-between 
                            items-center border rounded-md p-4 w-full
                            cursor-pointer
                            ${videoData?.voice?._id == voice?._id && 'bg-blue-100 text-primary border-primary'}`}
                            onClick={() => onHandleInputChange('voice', voice)}
                        >
                            {/* Voice info and play icon */}
                            <div className='flex gap-3 items-center'>
                                <PlayCircleIcon className='text-primary' onClick={() => setPlayAudio(voice?.preview)} />
                                <div>
                                    <h2 className='font-medium'>{voice.name}</h2>
                                    <h2 className='text-xs text-gray-500'>
                                        {voice.accent} ({voice.description})
                                    </h2>
                                </div>
                            </div>

                            {/* Gender icon aligned right */}
                            <div className='flex-shrink-0'>
                                {voice?.gender === 'Male' ? (
                                    <Mars className='text-blue-600' />
                                ) : (
                                    <Venus className='text-pink-600' />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}

export default VoiceList