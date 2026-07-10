import { Button, Form, Table } from "react-bootstrap";

export default function AddTaskForm({
    newIcon, setNewIcon, newTitle, setNewTitle, newReset, setNewReset, newBound, setNewBound, handleAddTask
}) {
    return (
        <Table responsive striped bordered hover className='text-center'>
            <thead>
                <tr>
                    <th>Icon</th>
                    <th>Title</th>
                    <th>Reset</th>
                    <th>Bound</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='text-center align-middle'>
                        <div className='d-flex flex-column align-items-center'>
                            <Form.Control
                                autoFocus
                                type="text"
                                placeholder={'Icon filename'}
                                value={newIcon}
                                onChange={(e) => setNewIcon(e.target.value)}
                                style={{ width: '24rem' }}
                            />
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={async () => {
                                    const filePath = await window.db.selectIcon();
                                    if (filePath) {
                                        const file = filePath.split('\\').pop().split('/').pop();
                                        setNewIcon(file);
                                    }
                                }}
                            >
                                Select file
                            </Button>
                        </div>
                    </td>
                    <td className='text-center align-middle'>
                        <div className='d-flex flex-column align-items-center'>
                            <Form.Control
                                autoFocus
                                type="text"
                                placeholder={'Task title'}
                                minLength={1}
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                style={{ width: '24rem' }}
                            />
                        </div>
                    </td>
                    <td className='text-center align-middle'>
                        <div className='d-flex justify-content-center'>
                            <Form.Select
                                autoFocus
                                value={newReset}
                                onChange={(e) => setNewReset(e.target.value)}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </Form.Select>
                        </div>
                    </td>
                    <td className='text-center align-middle'>
                        <div className='d-flex justify-content-center'>
                            <Form.Select
                                autoFocus
                                value={newBound}
                                onChange={(e) => setNewBound(e.target.value)}
                            >
                                <option value="account">Account</option>
                                <option value="character">Character</option>
                            </Form.Select>
                        </div>
                    </td>
                    <td className='text-center align-middle'>
                        <Button
                            variant='primary'
                            onClick={handleAddTask}
                        >
                            Add Task
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}