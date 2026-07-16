import { Button, Dropdown, Form } from "react-bootstrap";

export default function AddCharacterForm({
    newCharName, setNewCharName, newCharClass, setNewCharClass, newCharColor, setNewCharColor, classes, handleAddCharacter, error, setError
}) {

    return (
        <table className='text-center box'>
            <thead>
                <tr>
                    <th>Class</th>
                    <th>Name</th>
                    <th>Color</th>
                    <th>awawawa</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='text-center align-middle'>
                        <Dropdown drop='up'>
                            <Dropdown.Toggle
                                variant='outline-secondary'
                                size='sm'
                            >
                                {newCharClass ? (
                                    <>
                                        <img src={`/img/classes/${newCharClass}.png`} alt='' style={{ width: '63px', height: '63px', objectFit: 'contain' }} />
                                    </>
                                ) : (
                                    'Select class'
                                )}
                            </Dropdown.Toggle>

                                <Dropdown.Menu
                                    renderOnMount
                                    popperConfig={{ strategy: 'fixed' }}
                                >
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)'}}>
                                        {classes.map(img => {
                                            const className = img.replace(/^\d+[-_]/, '')
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
                                            return (
                                                <Dropdown.Item
                                                key={img}
                                                onClick={() => {
                                                    setNewCharClass(img);
                                                    const index = classes.indexOf(img);
                                                    const groupIndex = Math.floor(index / 4) % defaultColors.length;
                                                    setNewCharColor(defaultColors[groupIndex])
                                                }}
                                                >
                                                    <img src={`/img/classes/${img}.png`} alt={className} style={{ width: '63px', height: '63px', objectFit: 'contain' }} />
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </div>
                                </Dropdown.Menu>
                        </Dropdown>
                    </td>
                    <td className='text-center align-middle'>
                        <div className='d-flex flex-column align-items-center'>
                            <Form.Control
                                autoFocus
                                type="text"
                                placeholder={error || 'Character name'}
                                minLength={2}
                                maxLength={12}
                                value={newCharName}
                                onChange={(e) => {
                                    setNewCharName(e.target.value);
                                    setError('');
                                }}
                                isInvalid={!!error}
                                style={{ width: '24rem' }}
                            />
                        </div>
                    </td>
                    <td className='text-center align-middle'>
                        <div className='d-flex justify-content-center'>
                            <Form.Control
                                type="color"
                                value={newCharColor}
                                onChange={(e) => setNewCharColor(e.target.value)}
                            />
                        </div>
                    </td>
                    <td className='text-center align-middle'>
                        <button
                        className="button-confirm"
                            onClick={handleAddCharacter}
                        >
                            Add Character
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}