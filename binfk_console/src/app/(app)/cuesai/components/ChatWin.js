"use client";

import styles from './ChatWin.module.css';
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from 'next/image';
import { ChatOption } from './ChatOption';
import axiosApi from '@/lib/api';


export function ChatWin() {

    const [previousChats, setPreviousChats] = useState([]);

    const [conversation, setConversation] = useState([])

    const [query, setQuery] = useState("")

    const [inference, setInference] = useState([])

    const [activeConversation, setActiveConversation] = useState(null)



    useEffect(() => {

        async function fetcHistory(){

            try{
                const response = await axiosApi.get("/cuesai/history")
                const data = response.data

                setPreviousChats(data.payload)
            }

            catch(err){
                console.log(err)
            }
        }
        fetcHistory()
    }, [])



    async function conversationPop(convoId) {
        setActiveConversation(convoId)
        setInference([])
        try{

            const response = await axiosApi.post("/cuesai/conversationspop",
                {convo_id : convoId}
            )

            const data = response.data

            if(!data.status){
                console.log(data.message)
            }

            console.log(data.message)

            console.log(data.payload)

            setConversation(data.payload)
            
        }

        catch(err){
            console.log(err)
            alert("server error")
        }
    }

    const newChat = () =>{
        setActiveConversation(null)
        setConversation([]);
        setInference([]);
        setQuery("");
    }


    const handleQueryChange = (e) =>{
        const userQuery = e.target.value
        setQuery(userQuery)
    }


    async function sendQuery(){
        if(!query) return

        let query_payload

        if(activeConversation === null){
            
            query_payload = {
                new_chat : true,
                convo_id : null,
                user_message : query
            }
        }else{

            query_payload = {
                new_chat : false, 
                convo_id : activeConversation,
                user_message: query
            }
        }

        console.log(query_payload)

        setInference(prev => ([
            ...prev, {
                _id : crypto.randomUUID(),
                sender : "user",
                message : query
            }
        ]))

        setQuery("")

        try{

            const response = await axiosApi.post("cuesai/llminference",
                query_payload
            )

            const data = response.data

            if(activeConversation === null){
                setActiveConversation(data.payload.conversation_id);
            }

            setInference(prev => ([
                ...prev, data.payload
            ]))
        }

        catch(err){
            console.log(err)
            alert("cannot connect to the network")
        }
    }
    

     return(

        <>
            <div className={styles.chatWin}>
                <ChatSlideBar previousChats={previousChats} conversationPop={conversationPop} newChat={newChat} />
                <ChatBar inference={inference} conversation={conversation} 
                handleQueryChange={handleQueryChange} sendQuery={sendQuery}
                query={query} />
            </div>
        </>

     );
}


function ChatSlideBar({previousChats, conversationPop, newChat}) {

    const [chatOptions, setChatOptions] = useState(null)


    return(
        <div className= {styles.chatSideBarComp}>
            <div className={styles.chatNewChatDIV}>
                <button onClick={newChat} >&#128630; New chat</button>
            </div>
            <h2>Your chats</h2>
            <div className={styles.chatHistoryDiv}>
                {previousChats.map(chathist => (
                    <div key={chathist._id}>
                        <div key={chathist._id} className={styles.chatHistComp}>
                            <button onClick={() => conversationPop(chathist._id)}>
                                {chathist.title}
                            </button>
                            <button onClick={() => setChatOptions(chatOptions === chathist._id ? null : chathist._id)} >&#8942;</button>
                            
                        </div>
                        {chatOptions === chathist._id && <ChatOption chatHistId= {chathist._id} setChatOptions={setChatOptions} /> }
                    </div>
                ))}
            </div>
            
        </div>
     );

}




function ChatBar({inference, conversation, handleQueryChange, sendQuery, query}) {

    const allMessages = [...conversation, ...inference];

    return (
        <div className={styles.chatBar}>

        <div className={styles.chatMessages}>
            {allMessages.map(chat => (
            <div
                key={chat._id}
                className={ chat.sender === "user"
                    ? styles.chatUserMessage
                    : styles.chatBotMessage
                }
            >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {chat.message}
            </ReactMarkdown>
            </div>
            ))}
        </div>
            
            <div className={styles.chatInputBar}>
                <InputBar handleQueryChange={handleQueryChange} sendQuery={sendQuery} query={query} />
            </div>
        </div>
    );
}


function InputBar({handleQueryChange, sendQuery, query}) {



    return (
        <>
            <textarea 
                onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                }}

                onKeyDown={(e) => {
                    if(e.key == "Enter" && !e.shiftKey){
                    e.preventDefault()
                    sendQuery()
                    e.target.style.height = "auto"
                    }
                }}

                value={query}

                onChange={handleQueryChange}
            />
            <button className={styles.InputButton}>
                <Image 
                    onClick={sendQuery}
                    src={"/send.png"} alt="Send_Message" width={30} height={30}
                />
            </button>
        </>
    )
}
