import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function PityTracker({ characters, tasks }) {
    const serpTask = tasks.find(t => t.title === 'Serpentium');
    const doomTask = tasks.find(t => t.title === 'Doom Aporia');

    const [pityData, setPityData] = useState({});

    const getPity = (characterId, task) => {
        const data = pityData[characterId];

        if (!data) return {runs: 0, percent: 0};

        const percent = task?.id === serpTask?.id ? data.serpPercent : data.doomPercent;
        const rate = task?.id === serpTask?.id ? 12.5 : 11.12;
        const runs = Math.floor(percent / rate);

        return {runs: runs, percent};
    };

    useEffect(() => {
        async function loadPity() {
            const newData = {};
            for (const c of characters) {
                const serpPercent = await window.db.getPity(c.id, serpTask?.id);
                const doomPercent = await window.db.getPity(c.id, doomTask?.id);
                newData[c.id] = { serpPercent, doomPercent };
            }

            setPityData(newData);
        }
        if (characters.length > 0) {
            loadPity();
        }
    }, [characters, serpTask, doomTask]);

    const addRun = async(characterId, taskId) => {
        await window.db.addRun(characterId, taskId);

        const serpPercent = await window.db.getPity(characterId, serpTask?.id);
        const doomPercent = await window.db.getPity(characterId, doomTask?.id);

        setPityData(prev => ({...prev, [characterId]: {serpPercent, doomPercent}}));
    }

    const removeRun = async(characterId, taskId) => {
        await window.db.removeRun(characterId, taskId);

        const serpPercent = await window.db.getPity(characterId, serpTask?.id);
        const doomPercent = await window.db.getPity(characterId, doomTask?.id);

        setPityData(prev => ({...prev, [characterId]: {serpPercent, doomPercent}}));
    }

    const setPercent = async(characterId, taskId, percent) => {
        await window.db.setPercent(characterId, taskId, percent);

        const serpPercent = await window.db.getPity(characterId, serpTask?.id);
        const doomPercent = await window.db.getPity(characterId, doomTask?.id);

        setPityData(prev => ({...prev, [characterId]: {serpPercent, doomPercent}}));
    }
   
    return (
        <>
            <h2>Pity Tracker</h2>
            <table className='text-center box'>
                <thead>
                    <tr>
                        <th colSpan={2}>Character</th>
                        <th>Serpentium Actions</th>
                        <th>Serpentium %</th>
                        <th>Doom Actions</th>
                        <th>Doom %</th>
                    </tr>
                </thead>
                <tbody>
                    {characters.map(c => {
                        const serp = getPity(c.id, serpTask);
                        const doom = getPity(c.id, doomTask);

                        return (
                            <tr key={c.id}>
                                <td>
                                    <img src={`/img/classes/${c.class}.png`} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                </td>
                                <td>
                                    {c.name}
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <Button
                                            size="sm"
                                            className="mx-2"
                                            variant="outline-secondary"
                                            onClick={() => removeRun(c.id, serpTask?.id)}
                                        >
                                        ➖
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            className="mx-2"
                                            onClick={() => addRun(c.id, serpTask?.id)}
                                        >
                                        ➕
                                        </Button>
                                        <Form.Control
                                            autoFocus
                                            type="number"
                                            size="sm"
                                            className="mx-2"
                                            defaultValue={serp.runs}
                                            onKeyDown={async (e) => {
                                                if (e.key === 'Enter') {
                                                    const value = parseInt(e.target.value)
                                                    if (!isNaN(value) && value >= 0 && value <= 100) {
                                                        await setPercent(c.id, serpTask?.id, value);
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </td>
                                <td style={{ width: '16rem' }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div style={{ 
                                            backgroundColor: '#2d2d2d', 
                                            borderRadius: '12px', 
                                            height: '24px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            flex: 1
                                        }}>
                                            <div style={{
                                                width: `${serp.percent}%`,
                                                backgroundColor: serp.percent === 100 ? '#4fb667' : '#98e650',
                                                height: '100%',
                                                borderRadius: '6px',
                                                transition: 'width 0.3s ease'
                                            }} />
                                            <span style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                                            }}>
                                                {Math.floor(serp.percent)}%
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <Button
                                            size="sm"
                                            className="mx-2"
                                            variant="outline-secondary"
                                            onClick={() => removeRun(c.id, doomTask?.id)}
                                        >
                                        ➖
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="mx-2"
                                            variant="outline-secondary"
                                            onClick={() => addRun(c.id, doomTask?.id)}
                                        >
                                        ➕
                                        </Button>
                                        <Form.Control
                                            autoFocus
                                            type="number"
                                            size="sm"
                                            className="mx-2"
                                            defaultValue={doom.runs}
                                            onKeyDown={async (e) => {
                                                if (e.key === 'Enter') {
                                                    const value = parseInt(e.target.value)
                                                    if (!isNaN(value) && value >= 0 && value <= 100) {
                                                        await setPercent(c.id, doomTask?.id, value);
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </td>
                                <td style={{ width: '16rem' }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="pity-wrapper">
                                            <div className="pity-bar" style={{
                                                width: `${doom.percent}%`,
                                                backgroundColor: doom.percent === 100 ? '#4fb667' : '#6e56f3',
                                            }} />
                                            <span className="pity-text">
                                                {Math.floor(doom.percent)}%
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}