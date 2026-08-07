import { Button, Form } from "react-bootstrap";
import ThemePicker from "./ThemePicker";
import { useEffect, useState } from "react";
import { Check, X } from "react-bootstrap-icons";

export default function Settings({ tasks, checklist, characters, toggleTaskEnabled, handleDeleteTask, viewMode, setViewMode, theme, setTheme }) {
    const [webhookUrl, setWebhookUrl] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('webhookUrl');
        if (saved) setWebhookUrl(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem('webhookUrl', webhookUrl);
    }, [webhookUrl]);

    const accTasks = tasks.filter(t => t.bound === 'account');
    const charTasks = tasks.filter(t => t.bound === 'character' && t.title !== 'Challenge Mode');

    return (
        <details className="mt-4">
            <Form.Group>
                <Form.Label>Discord Webhook URL</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                />
            </Form.Group>
            <summary className="h4" style={{ cursor: 'pointer' }}>
                Enable, disable and delete tasks
            </summary>

            <details className="p-3 rounded mt-2">
                <summary className="h4" style={{ cursor: 'pointer' }}>
                Delete tasks
                </summary>
                <span>Only tasks created by you can be deleted.</span>
                    <table className='text-center box mt-3'>
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.filter(task => !task.system).map(task => {
                                return (
                                    <tr key={task.id}>
                                        <td>
                                            {task.icon && (
                                                <img src={`/img/tasks/${task.icon}`} style={{ maxWidth: '80px', maxHeight: '80px'}} />
                                            )}
                                            {task.title}
                                        </td>
                                        <td>
                                            <Button
                                                variant='outline-danger'
                                                size='sm'
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
            </details>

            <details className="p-3 rounded mt-2">
                <summary className="h4" style={{ cursor: 'pointer' }}>
                Account settings
                </summary>
                <div className="p-3 rounded mt-2">
                    <table className='text-center box'>
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Enabled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accTasks.map(task => {
                                const row = checklist.find(cl => cl.character_id === 0 && cl.task_id === task.id) || {enabled: 1};
                                return (
                                    <tr key={task.id}>
                                        <td>
                                            {task.icon && (
                                                <img src={`/img/tasks/${task.icon}`} style={{ maxWidth: '80px', maxHeight: '80px'}} />
                                            )}
                                            {task.title}
                                        </td>
                                        <td
                                            onClick={(e) => {
                                                toggleTaskEnabled(0, task.id, row.enabled);
                                            }}
                                            role='button'
                                        >
                                            {row.enabled ? <Check /> : <X />}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </details>
            <details className="p-3 rounded mt-2">
                <summary className="h4" style={{ cursor: 'pointer' }}>
                Character settings
                </summary>
                <div className="p-3 rounded mt-2 scroll-wrapper">
                    <table className='text-center box'>
                        <thead>
                            <tr>
                                <th colSpan={2}>Character</th>
                                {charTasks.map(task => (
                                    <th key={task.id}>
                                        {task.icon && (
                                                <img src={`/img/tasks/${task.icon}`} style={{ maxWidth: '80px', maxHeight: '80px'}} />
                                            )}
                                        {task.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {characters.map(c => (
                                <tr key={c.id}>
                                    <td>
                                        <img src={`/img/classes/${c.class}.png`} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                    </td>
                                    <td>
                                        {c.name}
                                    </td>
                                    {charTasks.map(task => {
                                        const row = checklist.find(cl => cl.character_id === c.id && cl.task_id === task.id) || {enabled: 1};
                                        return (
                                            <td key={task.id}>
                                                <span onClick={() => toggleTaskEnabled(c.id, task.id, row.enabled)} role='button'>
                                                    {row.enabled ? <Check /> : <X />}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>
             <details className="p-3 rounded mt-2">
                <summary className="h4" style={{ cursor: 'pointer' }}>
                App Appearance
                </summary>
                <div className="p-3 rounded mt-2">
                    <ThemePicker theme={theme} setTheme={setTheme} />
                </div>
                <div className="p-3 rounded mt-2">
                    <h4>View Mode</h4>
                    <Form.Select
                        className="form-select"
                        size="sm"
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        style={{width: 'auto'}}
                    >
                        <option value="both">Show Icons & Titles</option>
                        <option value="titles">Show Titles Only</option>
                        <option value="icons">Show Icons Only</option>
                    </Form.Select>
                </div>
            </details>
        </details>
    );
}