import React, { useState } from 'react';
import SimpleModal from './ui/SimpleModal';
import CreateTaskForm from './CreateTaskForm';
import { deleteList, renameColumn } from '../services/BoardService';

const ColumnSettingsList = ({ onClose, columnId, setColumns, columnName }) => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [newColumnName, setNewColumnName] = useState(columnName || "");

    const handleTaskModalClose = () => {
        setIsTaskModalOpen(false);
        onClose(); // Close the menu after creating task
    };
    const handleDelete = async (id) => {
        try {
            await deleteList(id);
            setColumns(prevCols => prevCols.filter(col => String(col.id) !== String(id)));
            setIsDeleteModalOpen(false);
            onClose();
        } catch (err) {
            console.error("Error deleting column:", err);
            alert("Failed to delete column");
        }
    };

    const handleRename = async () => {
        if (!newColumnName.trim()) {
            alert("Column name cannot be empty");
            return;
        }

        try {
            await renameColumn(columnId, newColumnName);
            setColumns(prevCols => 
                prevCols.map(col => 
                    String(col.id) === String(columnId) 
                        ? { ...col, name: newColumnName } 
                        : col
                )
            );
            setIsRenameModalOpen(false);
            onClose();
        } catch (err) {
            console.error("Error renaming column:", err);
            alert("Failed to rename column");
        }
    };

    return (
        <div className="absolute top-full right-0 z-50 mt-2 w-[240px] bg-white rounded-lg shadow-2xl border border-gray-200 p-3">
            <div className="mb-3">
                <div className='text-[#44546f] text-sm font-semibold'>List Actions</div>
            </div>
            <div className='flex flex-col gap-2'>
                <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className='hover:bg-[#091e420f] w-full text-left px-3 py-2 rounded text-[#172b4d] text-sm cursor-pointer transition-colors'
                >
                    ✨ Create New Task
                </button>
                <button 
                    onClick={() => setIsRenameModalOpen(true)}
                    className='hover:bg-[#091e420f] w-full text-left px-3 py-2 rounded text-[#172b4d] text-sm cursor-pointer transition-colors'
                >
                    ✏️ Rename List
                </button>
                <button 
                    onClick={() => setIsDeleteModalOpen(true)} 
                    className='hover:bg-red-50 w-full text-left px-3 py-2 rounded text-red-600 text-sm cursor-pointer transition-colors border-t border-gray-200 mt-1 pt-3'
                >
                    🗑️ Delete List
                </button>
            </div>

            <SimpleModal isOpen={isTaskModalOpen} onClose={handleTaskModalClose}>
                <h2 className="text-xl font-bold mb-4">Create New Task</h2>
                <CreateTaskForm
                    setIsModalOpen={handleTaskModalClose}
                    columnId={columnId}
                    setColumns={setColumns}
                />
            </SimpleModal>
            <SimpleModal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Rename List</h2>
                <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    placeholder="Enter new list name"
                />
                <div className='flex items-center justify-end gap-2'>
                    <button 
                        onClick={() => setIsRenameModalOpen(false)} 
                        className='px-4 py-2 hover:bg-gray-200 rounded text-[#172b4d] cursor-pointer transition-colors'
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleRename} 
                        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition-colors'
                    >
                        Rename
                    </button>
                </div>
            </SimpleModal>

            <SimpleModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Are you sure you want to delete the list?</h2>
                <p className="text-gray-600 mb-6">This action cannot be undone. All tasks in this list will be permanently deleted.</p>
                <div className='flex items-center justify-end gap-3'>
                    <button 
                        onClick={() => { setIsDeleteModalOpen(false) }} 
                        className='px-6 py-2 hover:bg-gray-100 rounded text-[#172b4d] cursor-pointer transition-colors border border-gray-300'
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => { handleDelete(columnId) }} 
                        className='px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition-colors'
                    >
                        Delete
                    </button>
                </div>
            </SimpleModal>
        </div>
    );
};

export default ColumnSettingsList;