import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css'
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;
const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const ENDPOINT = `localhost:5000`;

  useEffect(() => {
    const { name, room } = queryString.parse(window.location.search);
    setName(name);
    setRoom(room);
    socket = io(ENDPOINT);

    socket.emit('join', { name, room }, ({ error }) => {
      if (error) return alert(error)
      console.log('Joining success')
    })

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPOINT, window.location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    })
  }, [message])

  useEffect(() => {
    socket.on('roomData', (data) => {
      setUsers(data.users)
    })
  }, [users])

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''))
    }
  }

  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input sendMessage={sendMessage} message={message} setMessage={setMessage} />
      </div>
      <TextContainer users={users} />
    </div>
  )
}

export default Chat