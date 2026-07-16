import { useEffect, useState } from "react";
import { Button, Dropdown, Form, Table } from "react-bootstrap";

export default function CharacterTracker({ characters, tasks, checklist, toggleTask, handleDeleteCharacter, handleEditCharacter, classes, validateName }) {
    const allTasks = tasks.filter(t => t.bound === 'character' && t.title !== 'Challenge Mode');

    const enabledTasks = allTasks.filter(task => {
        return characters.some(c => {
            const row = checklist.find(cl => cl.character_id === c.id && cl.task_id === task.id);
            return row?.enabled === 1;
        })
    })

    const defaultColors = [
        'red',
        'violet',
        'lightgreen',
        'slategray',
        'lightpink',
        'cyan',
        'orange',
        'red',
        'mediumpurple',
        'blue',
        'yellow',
        'lightseagreen',
        'magenta',
        'cornflowerblue',
        'seagreen'
    ]

    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editClass, setEditClass] = useState('');
    const [editColor, setEditColor] = useState('red');
    const [editError, setEditError] = useState('');

    const editChar = (c) => {
        setEditId(c.id);
        setEditName(c.name);
        setEditClass(c.class);
        setEditColor(c.color);
    }
    
    const cancelEdit = () => {
        setEditId(null);
    }
    
    const saveEdit = async(characterId) => {
        const errorMsg = validateName(editName);
        if (errorMsg) {
            setEditError(errorMsg)
            return;
        }

        setEditError('');
        await handleEditCharacter(characterId, editName, editClass, editColor);
        setEditId(null);
    }

    const [currentWeek, setCurrentWeek] = useState('');
    
    useEffect(() => {
        async function load() {

            const week = await window.db.getCurrentWeek();
            setCurrentWeek(week);
        }

        load();
    }, []);

    return (
        <div className="scroll-wrapper">
            <table className='text-center box box-character'>
                <thead>
                    <tr>
                        <th colSpan={2}>Action</th>
                        <th colSpan={2}>Character</th>
                        {enabledTasks.map(t => 
                            <th key={t.id}>
                                {t.icon && (
                                    <img src={`/img/tasks/${t.icon}`} style={{ maxWidth: '80px', maxHeight: '80px'}} />
                                )}
                                {t.title}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {characters.map(c => {
                        const isEditing = editId === c.id;

                        return (
                            <tr key={c.id} className='character-row' style={{ backgroundColor: `${c.color}33`, outline: `2px solid ${c.color}` }}>
                                {isEditing ? (
                                    <>
                                        <td>
                                            <Button variant='outline-success' size='sm' onClick={() => saveEdit(c.id)}>💾</Button>
                                        </td>
                                        <td>
                                            <Button variant='outline-secondary' size='sm' onClick={cancelEdit}>✖️</Button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>
                                            <Button variant='outline-danger' size='sm' onClick={() => handleDeleteCharacter(c.id)}>🗑️</Button>
                                        </td>
                                        <td>
                                            <Button variant='outline-warning' size='sm' onClick={() => editChar(c)}>✏️</Button>
                                        </td>
                                    </>
                                )}
                                <td>
                                    {isEditing ? (
                                        <Dropdown>
                                            <Dropdown.Toggle variant='outline-secondary' size='sm'>
                                                <img src={`/img/classes/${editClass || c.class}.png`} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', padding: '8px' }}>
                                                    {classes.map(img => (
                                                        <Dropdown.Item key={img} onClick={() => setEditClass(img)} style={{ padding: '2px' }}>
                                                            <img src={`/img/classes/${img}.png`} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                                        </Dropdown.Item>
                                                    ))}
                                                </div>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    ) : (
                                        <img src={`/img/classes/${c.class}.png`} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                    )}
                                </td>
                                <td>
                                    {isEditing ? (
                                        <div className="d-flex flex-column align-items-center">
                                            <Form.Control
                                                autoFocus
                                                type="text"
                                                size="sm"
                                                value={editName}
                                                minLength={2}
                                                maxLength={12}
                                                onChange={(e) => {
                                                    setEditName(e.target.value);
                                                    setEditError('');
                                                }}
                                                isInvalid={!!editError}
                                            />
                                            <Form.Control
                                                autoFocus
                                                type="color"
                                                value={editColor}
                                                onChange={(e) => setEditColor(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        c.name
                                    )}
                                </td>
                                {enabledTasks.map(task => {
                                    const row = checklist.find(cl => cl.character_id === c.id && cl.task_id === task.id) || {completed: 0};
                                    if (row.enabled === 0) {
                                        return (
                                            <td key={task.id} className='text-muted cell-disabled'
                                            >
                                                N/A
                                            </td>
                                        )
                                    }
                                    return <td
                                        key={task.id}
                                        onClick={() => toggleTask(c.id, task.id, row.completed)}
                                        role='button'
                                    >
                                        {row?.completed ? '✅' : '❌'}
                                    </td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}