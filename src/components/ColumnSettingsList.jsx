import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SimpleModal from './ui/SimpleModal';
import CreateTaskForm from './CreateTaskForm';
import { deleteList } from '../services/BoardService';

const ColumnSettingsList = ({ onClose, columnId, setColumns }) => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const handleDelete = async (id) => {
        try {
            await deleteList(id);

            // update UI state immediately
            setColumns(prevCols =>{
                console.log(prevCols[0].id)
                console.log(id)
               setColumns(prevCols => prevCols.filter(col => String(col.id) !== String(id)));
            } );

            // close the modal after success
            setIsDeleteModalOpen(false);
            onClose(); // also close the settings panel if you want
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div className="absolute right-0 z-50 mt-1 w-[300px] bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
                <div className='text-[#44546f] text-[14px] font-[600]'>List Actions</div>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 p-1"
                >
                    <CloseIcon fontSize="small" />
                </button>
            </div>
            <div className='flex flex-col gap-3'>
                <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className='hover:bg-[#091e420f] w-full text-left p-2 rounded text-[#172b4d]'
                >
                    Create New Task
                </button>
                <button className='hover:bg-[#091e420f] w-full text-left p-2 rounded text-[#172b4d]'>
                    Copy List
                </button>
                <button onClick={() => { setIsDeleteModalOpen(true) }} className='hover:bg-[#091e420f] w-full text-left p-2 rounded  text-red-600'>
                    Delete List
                </button>
            </div>

            <SimpleModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Create New Task</h2>
                <CreateTaskForm
                    setIsModalOpen={setIsTaskModalOpen}
                    columnId={columnId}
                    setColumns={setColumns}
                />
            </SimpleModal>
            <SimpleModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Are you sure you want to delete the list?</h2>
                <div className='flex items-center justify-around'>
                    <button onClick={() => { handleDelete(columnId) }} className='hover:bg-[#091e420f] w-full text-left p-2 rounded  text-red-600'>
                        Yes
                    </button>
                    <button onClick={() => { setIsDeleteModalOpen(false) }} className='hover:bg-[#091e420f] w-full text-left p-2 rounded text-[#172b4d]'>
                        No
                    </button>


                </div>


            </SimpleModal>
        </div>
    );
};

export default ColumnSettingsList;