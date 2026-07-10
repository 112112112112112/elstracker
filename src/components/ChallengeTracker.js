import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";

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
            <h2>Challenge Mode</h2>
            <h4>Current Week: {currentWeek}</h4>
            <Table responsive striped bordered className='text-center'>
                <thead>
                    <tr>
                        <th>Character</th>
                        <th>{currentWeek} Aura</th>
                        <th>Reset Ticket Used</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {characters.map(c => {
                        const data = challengeData?.characters?.[c.id] || {rossoAura: 0, bertheAura: 0, resetTicketUsed: 0};
                        const aura = currentWeek === 'Rosso' ? data.rossoAura : data.bertheAura;
                        const isCleared = checklist.some(cl => cl.character_id === c.id && cl.task_id === challengeTask?.id && cl.completed === 1);

                        return (
                            <tr key={c.id}>
                                <td>
                                    <img src={`/img/classes/${c.class}.png`} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                    {c.name}
                                </td>
                                <td>{aura}</td>
                                <td>{data.resetTicketUsed}/2</td>
                                <td>
                                    {!isCleared ? (
                                        <Button
                                            size="sm"
                                            variant="outline-success"
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
                                        <span className="text-muted">Cleared</span>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline-success"
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
                                        variant="outline-success"
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
                                        variant="outline-warning"
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
                                    {isCleared ? (
                                        <Button
                                            size="sm"
                                            variant="outline-info"
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
                                            Use Reset Ticket ({data.resetTicketUsed}/2)
                                        </Button>
                                    ) : (
                                        <span className="text-muted">You need to clear before using a reset ticket</span>
                                    )}


                                    <div className="d-flex align-items-center">
                                        <Form.Control
                                            autoFocus
                                            type="number"
                                            size="sm"
                                            placeholder="Set aura amount"
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
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );
}