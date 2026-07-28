import { Col, Row } from "react-bootstrap";
import Notepad from "./Notepad";

export default function AccountTracker({ tasks, checklist, toggleTask }) {
    const accTasks = tasks.filter(t => t.bound === 'account');

    const dailyTasks = accTasks.filter(t => t.reset === 'daily');
    const weeklyTasks = accTasks.filter(t => t.reset === 'weekly');

    const enabledDailies = dailyTasks.filter(task => {
        const row = checklist.find(cl => cl.character_id === 0 && cl.task_id === task.id);
        return row?.enabled !== 0;
    });
    
    const enabledWeeklies = weeklyTasks.filter(task => {
        const row = checklist.find(cl => cl.character_id === 0 && cl.task_id === task.id);
        return row?.enabled !== 0;
    });

    return (
        <Row className='my-5'>
            <Col>
                <Notepad />
            </Col>
            {enabledDailies.length > 0 && (
                <Col style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem'}}>
                    <table className='text-center box'>
                        <thead>
                            <tr>
                                <th>Dailies</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enabledDailies.map(task => {
                                const row = checklist.find(cl => cl.character_id === 0 && cl.task_id === task.id) || {completed: 0, enabled: 1};
                                return (
                                    <tr key={task.id}>
                                        <td>{task.title}</td>
                                        <td
                                            onClick={() => toggleTask(0, task.id, row.completed)}
                                            role='button'
                                        >
                                            {row?.completed ? '✅' : '❌'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                {/* </Col> */}
            {/* )} */}
            {/* {enabledWeeklies.length > 0 && ( */}
            {/* // <Col> */}
                <table className='text-center box'>
                    <thead>
                        <tr>
                            <th>Weeklies</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enabledWeeklies.map(task => {
                            const row = checklist.find(cl => cl.character_id === 0 && cl.task_id === task.id) || {completed: 0, enabled: 1};
                            return (
                                <tr key={task.id}>
                                    <td>{task.title}</td>
                                    <td
                                        onClick={() => {toggleTask(0, task.id, row.completed)}}
                                        role='button'
                                    >
                                        {row?.completed ? '✅' : '❌'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Col>
            )}
        </Row>
    )
}