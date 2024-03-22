
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Cell from './Cell';

function Grid() {
    const [columns, setColumns] = useState(0);
    const [rows, setRows] = useState(0);

    // determine rows and columns
    useEffect(() => {
        const calculateGrid = () => {
            const columnCount = Math.ceil(window.innerWidth / 64);
            setColumns(columnCount);
            const rowCount = Math.ceil(window.innerHeight / 64);
            setRows(rowCount);
        };
        // calculate the grid on load
        calculateGrid();
        // recalculate grid on resize
        window.addEventListener('resize', calculateGrid);
        // cleanup
        return () => {
            window.removeEventListener('resize', calculateGrid);
        };
    }, []);

    return (
        <motion.div className='absolute top-0 left-0 w-screen h-screen grid overflow-hidden grid-cols-12'>
            {Array.from({ length: columns * rows }).map((_, i) => (
                <Cell key={i} />
            ))}
        </motion.div>
    );
}

export default Grid;