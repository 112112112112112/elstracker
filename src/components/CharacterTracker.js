import { useEffect, useState } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";
import { Check, Floppy, Pencil, Trash, X } from "react-bootstrap-icons";

export default function CharacterTracker({ characters, tasks, checklist, toggleTask, handleDeleteCharacter, handleEditCharacter, classes, validateName, currentWeek, viewMode }) {
    const allTasks = tasks.filter(t => t.bound === 'character' && t.title !== 'Challenge Mode');

    const enabledTasks = allTasks.filter(task => {
        return characters.some(c => {
            const row = checklist.find(cl => cl.character_id === c.id && cl.task_id === task.id);
            return row?.enabled === 1;
        })
    })

    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editClass, setEditClass] = useState('');
    const [editColor, setEditColor] = useState('');
    const [editError, setEditError] = useState('');

    useEffect(() => {
        console.log('checklist updated:', checklist);
    }, [checklist]);

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

    return (
        <>
        <div className="scroll-wrapper">
            <table key={checklist.length} className='text-center box box-character'>
                <thead>
                    <tr>
                        <th colSpan={2}>Action</th>
                        <th colSpan={3}>Character</th>
                        {enabledTasks.map(t => {
                            let icon = t.icon ? `img/tasks/${t.icon}` : null;
                            if (t.title === 'Challenge Mode' && currentWeek) {
                                icon = currentWeek === 'Rosso' ? '/img/tasks/rosso.webp' : '/img/tasks/berthe.webp';
                            }
                            return (
                            <th key={t.id}>
                                {(viewMode === 'both' || viewMode === 'icons') && icon && (
                                    <img src={icon} style={{ maxWidth: '80px', maxHeight: '80px'}} />
                                )}
                                {(viewMode === 'both' || viewMode === 'titles') && t.title}
                                </th>
                            )
                        })}
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
                                            <Button variant='outline-light' size='sm' onClick={() => saveEdit(c.id)}><Floppy /></Button>
                                        </td>
                                        <td>
                                            <Button variant='outline-light' size='sm' onClick={cancelEdit}><X /></Button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>
                                            <Button variant='outline-light' size='sm' onClick={() => handleDeleteCharacter(c.id)}><Trash /></Button>
                                        </td>
                                        <td>
                                            <Button variant='outline-light' size='sm' onClick={() => editChar(c)}><Pencil /></Button>
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
                                    {isEditing ? (
                                        <>
                                            <td>
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
                                                style={{ width: '12rem' }}
                                                isInvalid={!!editError}
                                            />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    autoFocus
                                                    type="color"
                                                    value={editColor}
                                                    onChange={(e) => setEditColor(e.target.value)}
                                                />
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td
                                                colSpan={2}
                                                style={{ width: '100%', textAlign: "center" }}
                                            >
                                                {c.name}
                                            </td>
                                        </>
                                    )}
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
                                        {row?.completed ? <Check /> : <X />}
                                    </td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        </>
    );
}