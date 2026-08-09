import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function ChallengeTracker({characters, checklist, setChecklist, tasks}) {
    const [challengeData, setChallengeData] = useState(null);
    const [currentWeek, setCurrentWeek] = useState('');
    const challengeTask = tasks.find(t => t.title === 'Challenge Mode');

    useEffect(() => {
        async function load() {
            const data = await window.db.getChallengeData();
            setChallengeData(data);

            const week = await window.db.getCurrentWeek();
            setCurrentWeek(week);
        }
        
        load();
    }, []);

    return (
        <>
            <h2><img src={`/img/tasks/${currentWeek.toLowerCase()}.webp`} alt={currentWeek} /> Challenge Tracker</h2>
            <table className='text-center box'>
                <thead>
                    <tr>
                        <th colSpan={2}>Character</th>
                        <th><img src={`img/items/${currentWeek.toLowerCase()}-aura.webp`} alt={`${currentWeek} Aura`} /></th>
                        <th><img src={`img/items/${currentWeek.toLowerCase()}-reset.webp`} alt={`${currentWeek} Reset Tickets`} /></th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {characters.map(c => {
                        const data = challengeData?.characters?.[c.id] || {rossoAura: 0, bertheAura: 0, resetTicketUsed: 0};
                        const aura = currentWeek === 'Rosso' ? data.rossoAura : data.bertheAura;
                        const isCleared = checklist.some(cl => cl.character_id === c.id && cl.task_id === challengeTask?.id && cl.completed === 1);

                        return (
                            <tr key={c.id} className='character-row' style={{ backgroundColor: `${c.color}33`, outline: `2px solid ${c.color}` }}>
                                <td>
                                    <img src={`/img/classes/${c.class}.png`} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                </td>
                                <td>
                                    {c.name}
                                </td>
                                <td>{aura}</td>
                                <td>{data.resetTicketUsed}/2</td>
                                <td>
                                    <div className="button-box d-flex justify-content-center">
                                        {!isCleared ? (
                                            <Button
                                                size="sm"
                                                className="mx-2"
                                                variant="outline-light"
                                                onClick={async () => {
                                                    await window.db.updateAura(c.id, currentWeek, 30);
                                                    const data = await window.db.getChallengeData();
                                                    setChallengeData(data);

                                                    const updatedChecklist = await window.db.getChecklist();
                                                    setChecklist(updatedChecklist);
                                                }}
                                            >
                                                Clear (+30 Aura)
                                                </Button>
                                        ) : (
                                            <></>
                                        )}
                                        <Button
                                            size="sm"
                                            className="mx-2"
                                            variant="outline-light"
                                            disabled={aura < 90}
                                            onClick={async () => {
                                                if (confirm('Are you sure you want to exchange 90 Aura for CM Suit?')) {
                                                    await window.db.setAura(c.id, currentWeek, aura -90);
                                                    const data = await window.db.getChallengeData();
                                                    setChallengeData(data);
                                                }
                                            }}
                                        >
                                            Exchange Suit (-90 Aura)
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="mx-2"
                                            variant="outline-light"
                                            disabled = {aura < 240}
                                            onClick={async () => {
                                                if (confirm('Are you sure you want to exchange 240 Aura for CM Force?')) {
                                                    await window.db.setAura(c.id, currentWeek, aura -240);
                                                    const data = await window.db.getChallengeData();
                                                    setChallengeData(data);
                                                }
                                            }}
                                        >
                                            Exchange Force (-240 Aura)
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="mx-2"
                                            variant="outline-light"
                                            onClick={async () => {
                                                if (confirm('Are you sure you want to reset your Aura amount to 0?')) {
                                                    await window.db.resetAura(c.id, currentWeek);
                                                    const data = await window.db.getChallengeData();
                                                    setChallengeData(data);
                                                }
                                            }}
                                        >
                                            Reset Aura
                                        </Button>
                                        {isCleared && (
                                            <Button
                                                size="sm"
                                                className="mx-2"
                                                variant="outline-light"
                                                disabled={data.resetTicketUsed >= 2}
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to use a Reset Ticket?')) {
                                                        await window.db.useResetTicket(c.id);
                                                        const data = await window.db.getChallengeData();
                                                        setChallengeData(data);

                                                        const updatedChecklist = await window.db.getChecklist();
                                                        setChecklist(updatedChecklist);
                                                    }
                                                }}
                                            >
                                                Reset Ticket ({data.resetTicketUsed}/2)
                                            </Button>
                                        )}


                                        <div className="d-flex align-items-center">
                                            <Form.Control
                                                autoFocus
                                                type="number"
                                                size="sm"
                                                className="mx-2"
                                                placeholder="Set aura amount"
                                                style={{ width: '9rem' }}
                                                onKeyDown={async (e) => {
                                                    if (e.key === 'Enter') {
                                                        const value = parseInt(e.target.value);
                                                        if (!isNaN(value) && value >= 0) {
                                                            await window.db.setAura(c.id, currentWeek, value);
                                                            const data = await window.db.getChallengeData();
                                                            setChallengeData(data);
                                                            e.target.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}