import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect } from 'react';
import { InputBase } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
function Chat({ idCourse }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const accessToken = localStorage.getItem('AccessToken');
    const [isChatbotTyping, setIsChatbotTyping] = useState(false);
    useEffect(() => {
        console.log('hiện');
        let idChatSession = sessionStorage.getItem('idChatSession');
        if (idChatSession === null) {
            axiosPrivate
                .post(
                    '/api/chat/create-session',
                    { userName: jwtDecode(accessToken)?.sub, idCourse: idCourse },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )
                .then((res) => {
                    idChatSession = res?.data;
                    sessionStorage.setItem('idChatSession', res?.data);
                })
                .catch((error) => console.log(error));
        } else {
            axiosPrivate
                .get(`/api/chat/messages/${idChatSession}`)
                .then((res) => setMessages([...res?.data]))
                .catch((error) => console.log(error));
        }
    }, []);

    const onSetText = (textMe) => {
        setText(textMe);
    };

    const getReply = async (mess) => {
        try {
            const { data } = await axiosPrivate.post(`/api/chat/${sessionStorage.getItem('idChatSession')}`, mess, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setMessages((pr) => [...pr, { message: data, sender: 'BOT', sentTime: new Date() }]);
            setIsChatbotTyping(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUserMessage = async (userMessage) => {
        setMessages((pr) => [
            ...pr,
            { message: userMessage, sender: 'USER', sentTime: new Date(), direction: 'outgoing' },
        ]);
        setIsChatbotTyping(true);
        await getReply(userMessage);
    };

    /*const handleClick = () => {
        setMessages((pr) => [...pr, { content: text, isUser: true, timeStamp: new Date() }]);
        getReply(text);
        setIsChatbotTyping(true);
        setText('');
    };*/

    return (
        <>
            <div style={{ height: '100vh', width: '100%' }}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            style={{ overflow: 'auto' }}
                            typingIndicator={isChatbotTyping ? <TypingIndicator content="ChatGPT is thinking" /> : null}
                        >
                            {messages &&
                                messages.map((message, i) => {
                                    return (
                                        <Message
                                            key={i}
                                            model={message}
                                            style={message.sender === 'BOT' ? { textAlign: 'left' } : {}}
                                        />
                                    );
                                })}
                        </MessageList>
                        <MessageInput placeholder="Type Message here" onSend={handleUserMessage} attachButton={false} />
                    </ChatContainer>
                </MainContainer>
            </div>
        </>
    );
}

const TextInput = ({ onSetText }) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handelOnBlur = () => {
        if (inputValue !== '') onSetText(inputValue);
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            console.log('Enter key was pressed');
            if (inputValue !== '') onSetText(inputValue);
        }
    };
    return (
        <InputBase
            sx={{ width: '100%' }}
            multiline
            value={inputValue}
            onChange={handleChange}
            onBlur={handelOnBlur}
            autoFocus
            required
            placeholder="Message chat ....."
            onKeyDown={handleKeyDown}
        />
    );
};

export default Chat;
/* <div className=" min-h-screen flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="flex flex-col flex-grow p-4 overflow-auto">
                    {messages &&
                        messages.map((message, idx) => (
                            <div
                                className={`flex w-full mt-2 space-x-3 max-w-xs ${
                                    message?.isUser ? 'ml-auto justify-end' : ''
                                }`}
                                key={uuidv4()}
                            >
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                                <div>
                                    <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                        <p className="text-sm">{message?.content}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 leading-none">
                                        {moment(message?.timeStamp).fromNow()}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="p-4 w-full flex">
                    <div className="flex items-center  w-[90%] rounded px-3 text-sm mr-2 border-slate-400 border-2 min-h-fit max-h-fit">
                        <TextInput onSetText={onSetText} />
                    </div>

                    <div className="flex-grow items-end flex">
                        <button
                            onClick={handleClick}
                            className=" flex items-center  bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-3 py-1 flex-shrink-0"
                        >
                            <span>Send</span>
                            <SendIcon sx={{ marginLeft: '4px' }} />
                        </button>
                    </div>
                </div>
            </div> */
