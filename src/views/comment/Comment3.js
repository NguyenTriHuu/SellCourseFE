import React, { useState, useEffect } from 'react';
import InputEmoji from 'react-input-emoji';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Collapse from '@mui/material/Collapse';
import ClearIcon from '@mui/icons-material/Clear';
import { array } from 'prop-types';
function Comment3({ idblog, onChangeNumOfComment }) {
    const [data, setData] = useState([]);
    const [text, setText] = useState('');
    const [textReply, setTextReply] = useState('');
    const [open, setOpen] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [stompClient, setStompClient] = useState();
    const [isConnect, setIsConnect] = useState(false);
    const token = jwtDecode(localStorage.getItem('AccessToken'));
    const [openReplies, setOpenReplies] = useState([]);
    const [children, setChildren] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [messageReceived, setMessageReceived] = useState({});
    // const timeAgo = moment(comment.createdAt).fromNow();
    useEffect(() => {
        axiosPrivate
            .get(`/api/blog/${idblog}/comment`)
            .then((res) => {
                setData(res?.data);
                onChangeNumOfComment(res?.data?.length);
            })
            .catch((error) => console.log(error));
    }, [idblog, messageReceived]);

    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, [idblog]);

    const connect = () => {
        const headers = {
            Authorization: localStorage.getItem('AccessToken'),
            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
        };
        //const socket = new SockJS('http://localhost:8080/websocket');
        var client = Stomp.over(function () {
            return new SockJS('http://localhost:8080/websocket');
        });
        setStompClient(client);
        if (client) {
            client.connect(headers, onConnected, onError);
        } else {
            console.log('Cannot connect because stompClient is not initialized');
        }
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    };

    console.log(data);
    const onConnected = () => {
        setIsConnect(true);
    };

    useEffect(() => {
        if (isConnect && stompClient && stompClient.connected) {
            if (subscription) {
                subscription.unsubscribe();
            }
            const newSubscription = stompClient.subscribe(`/topic/comments/blog/${idblog}`, onMessageReceived);
            setSubscription(newSubscription);
        }
    }, [idblog, isConnect, stompClient]);

    const onMessageReceived = (payload) => {
        const comment = JSON.parse(payload.body);
        setMessageReceived({ ...comment });
    };

    const onError = (error) => {
        console.log(`Could not connect to the WebSocket server. Error: ${error}`);
    };

    const disconnect = () => {
        setIsConnect(false);
        if (stompClient) {
            stompClient.deactivate();
        }
    };

    const sendComment = (comment) => {
        if (stompClient && stompClient.connected) {
            stompClient?.send(`/app/comment/blog/${idblog}`, {}, JSON.stringify(comment));
        } else {
            console.log('Cannot send comment because stompClient is not connected');
        }
    };

    const sendReply = (reply, id) => {
        if (stompClient && stompClient.connected) {
            stompClient?.send(`/app/comment/reply/blog/${id}/${idblog}`, {}, JSON.stringify(reply));
        } else {
            console.log('Cannot send comment because stompClient is not connected');
        }
    };

    const handleOnEnter = (text) => {
        let comment = {
            content: text,
            userName: token?.sub,
        };
        sendComment(comment);
    };

    const handleOnEnterReply = (text, id) => {
        let reply = {
            content: text,
            userName: token?.sub,
        };
        sendReply(reply, id);
    };
    const handleReply = (e, idx) => {
        e.stopPropagation();
        if (!open.includes(idx)) {
            setOpen([...open, idx]);
        }
    };
    const handleClickReplies = (e, id) => {
        e.stopPropagation();
        if (openReplies.includes(id)) {
            setOpenReplies(openReplies.filter((existingId) => existingId !== id));
        } else {
            setOpenReplies([...openReplies, id]);
        }
    };

    const handleDeleteComment = (e, idComment) => {
        e.stopPropagation();
        if (stompClient && stompClient.connected) {
            stompClient?.send(`/app/comment/blog/${idComment}/${idblog}/delete`, {});
        } else {
            console.log('Cannot send comment because stompClient is not connected');
        }
    };

    const handleDeleteCommentReply = (e, idReply) => {
        e.stopPropagation();
        if (stompClient && stompClient.connected) {
            stompClient?.send(`/app/comment/reply/blog/${idReply}/${idblog}/delete`, {});
        } else {
            console.log('Cannot send comment because stompClient is not connected');
        }
    };

    return (
        <>
            <p className="text-2xl font-sans text-black">{`Comment (${data?.length})`}</p>
            <div className="w-full min-h-full max-h-[500px] overflow-y-auto bg-slate-100 p-3">
                <div>
                    <InputEmoji
                        value={text}
                        onChange={setText}
                        cleanOnEnter
                        onEnter={handleOnEnter}
                        placeholder="Comment here ....."
                    />
                </div>
                {data &&
                    data.map((comment, idx) => (
                        <div key={idx} className="mb-6 border rounded-lg bg-white shadow-lg">
                            <div className="relative grid grid-cols-1 gap-2 p-4 border rounded-lg bg-white shadow-lg">
                                <div className="relative flex gap-4">
                                    <img
                                        src="https://icons.iconarchive.com/icons/diversity-avatars/avatars/256/charlie-chaplin-icon.png"
                                        className="relative rounded-lg -top-8 -mb-4 bg-white border h-20 w-20"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <div className="flex flex-col w-full">
                                        <div className="flex flex-row justify-between">
                                            <p className="relative text-xl font-semibold whitespace-nowrap truncate overflow-hidden">
                                                {comment?.fullNameUser}
                                            </p>
                                            {comment?.userName && comment?.userName === token?.sub && (
                                                <button
                                                    className="text-gray-500 text-xl"
                                                    onClick={(e) => handleDeleteComment(e, comment?.idComment)}
                                                >
                                                    <ClearIcon />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-sm">{`${moment(comment?.createdTime).format(
                                            'DD MMMM YYYY, [at] hh:mm A',
                                        )}`}</p>
                                    </div>
                                </div>
                                <div className="flex-col">
                                    <p className="text-gray-500">{comment?.content}</p>

                                    <button className="inline-flex items-center px-1 ml-3 flex-column">
                                        <svg
                                            className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-700"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                            ></path>
                                        </svg>
                                    </button>
                                    <button
                                        className="inline-flex items-center px-1  ml-1 flex-column"
                                        onClick={(e) => handleReply(e, idx)}
                                    >
                                        <svg
                                            className="w-5 h-5 ml-2 text-gray-600 cursor-pointer fill-current hover:text-gray-900"
                                            viewBox="0 0 95 78"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M29.58 0c1.53.064 2.88 1.47 2.879 3v11.31c19.841.769 34.384 8.902 41.247 20.464 7.212 12.15 5.505 27.83-6.384 40.273-.987 1.088-2.82 1.274-4.005.405-1.186-.868-1.559-2.67-.814-3.936 4.986-9.075 2.985-18.092-3.13-24.214-5.775-5.78-15.377-8.782-26.914-5.53V53.99c-.01 1.167-.769 2.294-1.848 2.744-1.08.45-2.416.195-3.253-.62L.85 30.119c-1.146-1.124-1.131-3.205.032-4.312L27.389.812c.703-.579 1.49-.703 2.19-.812zm-3.13 9.935L7.297 27.994l19.153 18.84v-7.342c-.002-1.244.856-2.442 2.034-2.844 14.307-4.882 27.323-1.394 35.145 6.437 3.985 3.989 6.581 9.143 7.355 14.715 2.14-6.959 1.157-13.902-2.441-19.964-5.89-9.92-19.251-17.684-39.089-17.684-1.573 0-3.004-1.429-3.004-3V9.936z"
                                                fillRule="nonzero"
                                            />
                                        </svg>
                                    </button>
                                    <div
                                        className=" inline-flex text-sm text-gray-500 font-semibold ml-2"
                                        onClick={(e) => handleClickReplies(e, comment?.idComment)}
                                    >
                                        {comment?.children && comment?.children.length > 0
                                            ? `${comment?.children.length} Replies`
                                            : 'Replies'}
                                    </div>
                                </div>
                            </div>
                            <Collapse
                                in={openReplies && openReplies.includes(comment?.idComment)}
                                timeout="auto"
                                unmountOnExit
                            >
                                {comment?.children &&
                                    comment?.children.map((reply, idxRep) => (
                                        <div
                                            key={`${idx}${idxRep}`}
                                            className="ml-10 mb-6 border rounded-lg bg-white shadow-lg"
                                        >
                                            <div className="relative grid grid-cols-1 gap-2 p-4 border rounded-lg bg-white shadow-lg">
                                                <div className="relative flex gap-4">
                                                    <img
                                                        src="https://icons.iconarchive.com/icons/diversity-avatars/avatars/256/charlie-chaplin-icon.png"
                                                        className="relative rounded-lg -top-8 -mb-4 bg-white border h-20 w-20"
                                                        alt=""
                                                        loading="lazy"
                                                    />
                                                    <div className="flex flex-col w-full">
                                                        <div className="flex flex-row justify-between">
                                                            <p className="relative text-xl font-semibold whitespace-nowrap truncate overflow-hidden">
                                                                {reply?.fullNameUser}
                                                            </p>
                                                            {reply?.userName && reply?.userName === token?.sub && (
                                                                <button
                                                                    className="text-gray-500 text-xl"
                                                                    onClick={(e) =>
                                                                        handleDeleteCommentReply(e, reply?.replyId)
                                                                    }
                                                                >
                                                                    <ClearIcon />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-400 text-sm">{`${moment(
                                                            reply?.createdTime,
                                                        ).format('DD MMMM YYYY, [at] hh:mm A')}`}</p>
                                                    </div>
                                                </div>
                                                <div className="flex-col">
                                                    <p className="text-gray-500">{reply?.content}</p>

                                                    <button className="inline-flex items-center px-1 ml-3 flex-column">
                                                        <svg
                                                            className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-700"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center px-1  ml-1 flex-column"
                                                        onClick={(e) => handleReply(e, idx)}
                                                    >
                                                        <svg
                                                            className="w-5 h-5 ml-2 text-gray-600 cursor-pointer fill-current hover:text-gray-900"
                                                            viewBox="0 0 95 78"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M29.58 0c1.53.064 2.88 1.47 2.879 3v11.31c19.841.769 34.384 8.902 41.247 20.464 7.212 12.15 5.505 27.83-6.384 40.273-.987 1.088-2.82 1.274-4.005.405-1.186-.868-1.559-2.67-.814-3.936 4.986-9.075 2.985-18.092-3.13-24.214-5.775-5.78-15.377-8.782-26.914-5.53V53.99c-.01 1.167-.769 2.294-1.848 2.744-1.08.45-2.416.195-3.253-.62L.85 30.119c-1.146-1.124-1.131-3.205.032-4.312L27.389.812c.703-.579 1.49-.703 2.19-.812zm-3.13 9.935L7.297 27.994l19.153 18.84v-7.342c-.002-1.244.856-2.442 2.034-2.844 14.307-4.882 27.323-1.394 35.145 6.437 3.985 3.989 6.581 9.143 7.355 14.715 2.14-6.959 1.157-13.902-2.441-19.964-5.89-9.92-19.251-17.684-39.089-17.684-1.573 0-3.004-1.429-3.004-3V9.936z"
                                                                fillRule="nonzero"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                <InputEmoji
                                    value={textReply}
                                    onChange={setTextReply}
                                    cleanOnEnter
                                    onEnter={(text) => handleOnEnterReply(text, comment?.idComment)}
                                    placeholder="Comment here ....."
                                />
                            </Collapse>
                        </div>
                    ))}
            </div>
        </>
    );
}

export default Comment3;
