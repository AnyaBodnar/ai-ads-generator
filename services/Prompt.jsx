export const GENERATE_SCRIPT_PROMPT = `Topic:{topic}
Depends on user topic generate 3 video script for 30 seconds video for user in the video in JSON format
Do not return instruction, messages.  just give user speaking script, Just give me script in JSON which user can speak in real
Schema:[
{
scriptId:1
content:<Complete 30 video script second text content>
}
{
scriptId:2
content:<Complete 30 video script second text content>
}
{
scriptId:3
content:<Complete 30 video script second text content>
}
]
`