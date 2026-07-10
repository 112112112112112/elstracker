import { Button, Table } from "react-bootstrap";

export default function Settings({ tasks, checklist, characters, toggleTaskEnabled, handleDeleteTask }) {
    const accTasks = tasks.filter(t => t.bound === 'account');
    const charTasks = tasks.filter(t => t.bound === 'character' && t.title !== 'Challenge Mode');

    return (
        <details className="mt-4">
            <summary className="h4" style={{ cursor: 'pointer' }}>
                Enable, disable and delete tasks
            </summary>

            <details className="bg-secondary p-3 rounded mt-2">
                <summary className="h4" style={{ cursor: 'pointer' }}>
                Delete tasks
                </summary>
                    <Table responsive striped className='text-center'>
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
                    </Table>
            </details>

            <details className="bg-secondary p-3 rounded mt-2">
                <summary className="h4" style={{ cursor: 'pointer' }}>
                Account settings
                </summary>
                <div className="bg-secondary p-3 rounded mt-2">
                    <Table responsive striped className='text-center'>
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
                                            {row.enabled ? '✅' : '❌'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </details>
            <details className="bg-secondary p-3 rounded mt-2">
                <summary className="h4" style={{ cursor: 'pointer' }}>
                Character settings
                </summary>
                <div className="bg-secondary p-3 rounded mt-2 overflow-auto">
                    <Table responsive striped className='text-center'>
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
                                                    {row.enabled ? '✅' : '❌'}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </details>
        </details>
    );
}