import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import AddNoteImage from '../assets/add.json';
import '../Styles/AddNote.scss';

const AddNote = () =>{
    return (
        <div className='addnote'>
            <Player
                autoplay
                // loop={false}
                src={AddNoteImage}
                style={{ height: '20rem', width: '20rem' }}
                speed={1}
            />
            <h2>Start adding notes</h2>
        </div>
    );
}

export default AddNote;