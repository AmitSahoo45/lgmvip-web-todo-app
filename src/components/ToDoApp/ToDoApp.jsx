import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ReactCanvasConfetti from "react-canvas-confetti";
import { BsPencilSquare } from 'react-icons/bs'
import { MdOutlineDelete } from 'react-icons/md'
import NotFoundMessage from '../Error/NotFoundMessage';
import './ToDoApp.css'

const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: -100,
    left: 0
};

const ToDoApp = () => {
    const [tasks, setTasks] = useState(() => {
        const local__storage = localStorage.getItem("todoapptasks");
        if (local__storage)
            return JSON.parse(local__storage);
        else
            return [];
    });
    const [message, setmessage] = useState('')
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [checkIfUpdating, setcheckIfUpdating] = useState({ currentState: false, updateId: '' });
    const refAnimationInstance = useRef(null);

    const getInstance = useCallback((instance) => {
        refAnimationInstance.current = instance;
    }, []);

    const makeShot = useCallback((particleRatio, opts) => {
        refAnimationInstance.current &&
            refAnimationInstance.current({
                ...opts,
                origin: { y: 0.7 },
                particleCount: Math.floor(200 * particleRatio)
            });
    }, []);

    const fire = useCallback(() => {
        makeShot(0.25, {
            spread: 26,
            startVelocity: 55
        });

        makeShot(0.2, {
            spread: 60
        });

        makeShot(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });

        makeShot(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });

        makeShot(0.1, {
            spread: 120,
            startVelocity: 45
        });
    }, [makeShot]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const Addtask = (e) => {
        e.preventDefault();
        const { updateId, currentState } = checkIfUpdating
        if (currentState) {
            const updatedTask = tasks.map(task => {
                if (task.id === updateId) {
                    task.text = input
                }
                return task;
            })
            setTasks(updatedTask)
            setmessage('Task Updated')
            setOpen(true)
            setcheckIfUpdating({ currentState: false, updateId: '' })
            setInput('')
        } else {
            if (input !== '') {
                setTasks([...tasks, { id: tasks.length + 1, text: input }]);
                setInput('');
                setmessage('Task added successfully');
                setOpen(true);
                fire();
            }
        }
    }

    const deleteTask = (id) => {
        const itemAfterRemoving = tasks.filter((task) => {
            return task.id !== id;
        })
        setTasks(itemAfterRemoving);
        if (checkIfUpdating.currentState) {
            setcheckIfUpdating({ currentState: false, updateId: '' })
        }
        setmessage('Task deleted successfully');
        setOpen(true);
    }

    const updateTask = (id) => {
        const getdata = tasks.find(task => task.id === id);
        setInput(getdata.text);
        setcheckIfUpdating({ currentState: true, updateId: id });
    }

    useEffect(() => {
        localStorage.setItem('todoapptasks', JSON.stringify(tasks));
    }, [tasks]);

    return (
        <>
            <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
            <div className="todoapp-box">
                <h1>ToDoApp</h1>
                <form
                    className="todoapp-inputarea"
                    onSubmit={Addtask}
                >
                    <input
                        type="text"
                        name='task'
                        value={input}
                        onChange={(e) => { setInput(e.target.value) }}
                        placeholder='Add a task'
                        className='todoapp-inputtask'
                        autoComplete='off'
                    />
                    <button className='todoapp-addtask'>
                        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor"></path></svg>
                        <span>{checkIfUpdating.currentState ? 'Update' : 'Add Task'}</span>
                    </button>
                </form>
                <div className='todoapp-todolistbox'>
                    {
                        tasks.length > 0 ? (
                            tasks.map(task => {
                                return (
                                    <div key={task.id} className='todo'>
                                        <p>{task.text.replace(/\s+/g, ' ').trim()}</p>
                                        <div className='todo-buttons'>
                                            <BsPencilSquare
                                                onClick={() => updateTask(task.id)}
                                            />
                                            <MdOutlineDelete
                                                onClick={() => { deleteTask(task.id) }}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <NotFoundMessage />
                        )
                    }
                </div>
            </div>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default ToDoApp