import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import NoNoteFound from '../assets/not found.json';
import '../Styles/NotFound.scss';
const NotFound = () =>{
    return (
    <div className='searchError'>
        <Player
            autoplay
            src={NoNoteFound}
            loop
            style={{height:'20rem', width: '20rem'}}
        />
        <h2>Oops! No notes found.</h2>
    </div>
    )
}

export default NotFound;