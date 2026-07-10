import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountTracker from '../components/AccountTracker';
import AddCharacterForm from '../components/AddCharacterForm';
import AddTaskForm from '../components/AddTaskForm';
import ChallengeTracker from '../components/ChallengeTracker';
import CharacterTracker from '../components/CharacterTracker';
import Clock from '../components/Clock';
import Notepad from '../components/Notepad';
import PityTracker from '../components/PityTracker';
import Settings from '../components/Settings';

export default function IndexPage() {
    const [tasks, setTasks] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [classes, setClasses] = useState([]);
    const [checklist, setChecklist] = useState([]);

    const [newIcon, setNewIcon] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newReset, setNewReset] = useState('daily');
    const [newBound, setNewBound] = useState('account');

    const [error, setError] = useState('');
    
    const [newCharName, setNewCharName] = useState('');
    const [newCharClass, setNewCharClass] = useState('');
    const [newCharColor, setNewCharColor] = useState('#7a7a7a');

    const [pityRefresh, setPityRefresh] = useState(0);

    useEffect(() => {
        async function load() {
            const allTasks = await window.db.getTasks();
            setTasks(allTasks);
            
            const allCharacters = await window.db.getCharacters();
            setCharacters(allCharacters);

            const allClasses = await window.db.getClasses();
            setClasses(allClasses || []);

            if (allClasses && allClasses.length > 0) {
                setNewCharClass(allClasses[0])
            }

            const allChecklist = await window.db.getChecklist();
            setChecklist(allChecklist);
        }
        load();
    }, [])

    const validateName = (name) => {
        if (!name.trim()) {
            return "Name can't be empty";
        }
        if (!name.match(/^[a-zA-Z0-9]+$/)) {
            return 'Name contains invalid characters';
        }
        if (name.length > 12 || name.length < 2) {
            return 'Name must be between 2 and 12 characters';
        }
        return null;
    };

    const handleAddCharacter = async() => {
        const errorMsg = validateName(newCharName);

        if (errorMsg) {
            setError(errorMsg);
            setNewCharName('');
            return;
        }

        setError('')

        await window.db.addCharacter(newCharName, newCharClass, newCharColor);

        const newChar = await window.db.getCharacters();
        setCharacters(newChar);
        
        const newChecklist = await window.db.getChecklist();
        setChecklist(newChecklist);

        setNewCharName('');
        setNewCharClass(classes[0] || '');
        setNewCharColor('#7a7a7a');
    };

    const handleEditCharacter = async(characterId, editCharName, editCharClass, editCharColor) => {
        await window.db.editCharacter(characterId, editCharName, editCharClass, editCharColor);
        const updatedCharacters = await window.db.getCharacters();
        setCharacters(updatedCharacters);
    }

    const handleDeleteCharacter = async(characterId) => {
        const confirmDelete = confirm('Are you sure you want to delete this character?');
        if (confirmDelete) {
            await window.db.deleteCharacter(characterId);
            const updatedCharacters = await window.db.getCharacters();
            setCharacters(updatedCharacters);

            const updatedChecklist = await window.db.getChecklist();
            setChecklist(updatedChecklist);
        }
    }

    const handleAddTask = async() => {
        if (!newTitle.trim()) {
            alert('Title cannot be empty');
            return;
        }

        await window.db.addTask(newIcon || null, newTitle, newReset, newBound);

        const newTask = await window.db.getTasks();
        setTasks(newTask);

        const newChecklist = await window.db.getChecklist();
        setChecklist(newChecklist);

        setNewIcon('');
        setNewTitle('');
        setNewReset('daily');
        setNewBound('account');
    };

    const handleDeleteTask = async(taskId) => {
        const confirmDelete = confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            await window.db.deleteTask(taskId);
            const updatedTasks = await window.db.getTasks();
            setTasks(updatedTasks);
        }
    }

    const refreshPity = () => {
        setPityRefresh(prev => prev + 1);
    }

    const toggleTask = async(characterId, taskId, currentStatus) => {
        const newStatus = currentStatus ? 0 : 1;

        const task = tasks.find(t => t.id === taskId);
        const isPityTask = task && (task.title === 'Serpentium' || task.title === 'Doom Aporia');

        await window.db.updateChecklist(characterId, taskId, newStatus);

        if (isPityTask) {
            if (newStatus === 1) {
                await window.db.addRun(characterId, taskId);
            } else {
                await window.db.removeRun(characterId, taskId);
            }
            refreshPity();
        }

        setChecklist(checklist => checklist.map(row =>
            row.character_id === characterId && row.task_id === taskId ? {...row, completed: newStatus} : row
        ));
    }

    const toggleTaskEnabled = async(characterId, taskId, currentEnabled) => {
        const newEnabled = currentEnabled ? 0 : 1;
        await window.db.toggleTaskEnabled(characterId, taskId, newEnabled);

        setChecklist(checklist => checklist.map(row =>
            row.character_id === characterId && row.task_id === taskId ? {...row, enabled: newEnabled} : row
        ));
    }

    return (
        <div className='bg-dark min-vh-100 text-white'>
            <Container className='mx-auto pt-4 pb-4'>
                <h1 className='text-center'>ElsTracker</h1>
                <Clock />
                <h2>Notepad</h2>
                <Row>
                    <Col>
                        <Notepad />
                    </Col>
                </Row>
                <h2>📑 Checklist</h2>
                <AccountTracker
                    tasks={tasks}
                    checklist={checklist}
                    toggleTask={toggleTask}
                />

                <Row>
                    <Col>
                        <CharacterTracker 
                            characters={characters}
                            tasks={tasks}
                            checklist={checklist}
                            toggleTask={toggleTask}
                            handleDeleteCharacter={handleDeleteCharacter}
                            handleEditCharacter={handleEditCharacter}
                            classes={classes}
                            validateName={validateName}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ChallengeTracker
                            characters={characters}
                            checklist={checklist}
                            setChecklist={setChecklist}
                            tasks={tasks}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <PityTracker
                            characters={characters}
                            tasks={tasks}
                            key={pityRefresh}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Add a character</h2>
                        <AddCharacterForm 
                            newCharName={newCharName}
                            setNewCharName={setNewCharName}
                            newCharClass={newCharClass}
                            setNewCharClass={setNewCharClass}
                            newCharColor={newCharColor}
                            setNewCharColor={setNewCharColor}
                            classes={classes}
                            handleAddCharacter={handleAddCharacter}
                            error={error}
                            setError={setError}
                            />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h2>Create a task</h2>
                        <AddTaskForm
                            newIcon={newIcon}
                            setNewIcon={setNewIcon}
                            newTitle={newTitle}
                            setNewTitle={setNewTitle}
                            newReset={newReset}
                            setNewReset={setNewReset}
                            newBound={newBound}
                            setNewBound={setNewBound}
                            handleAddTask={handleAddTask}
                        />
                    </Col>
                </Row>

                <h2>⚙️ Settings</h2>
                <Settings
                    checklist={checklist}
                    tasks={tasks}
                    characters={characters}
                    toggleTaskEnabled={toggleTaskEnabled}
                    handleDeleteTask={handleDeleteTask}
                />
            </Container>
        </div>
    )
}