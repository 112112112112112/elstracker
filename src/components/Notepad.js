import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

export default function Notepad() {
    const [notes, setNotes] = useState('');

    useEffect(() => {
        async function loadNotes() {
            const saved = await window.db.loadNotes();
            setNotes(saved || '');
        }

        loadNotes();
    }, []);

    const saveNotes = async (text) => {
        await window.db.saveNotes(text);
    };

    return (
        <Form.Control
            as="textarea"
            rows={10}
            value={notes}
            onChange={(e) => {
                setNotes(e.target.value);
                saveNotes(e.target.value);
            }}
        />
    )
}