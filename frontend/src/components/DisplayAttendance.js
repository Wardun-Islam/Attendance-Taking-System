import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';




export default function DataGridDemo() {
    const [rows, setRows] = React.useState([]);
    const [columns, setColumns] = React.useState([]);

    React.useEffect(() => {
        fetch(`/attendance/api/get-attendance/?labClass=CSE231L.07`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('token'),
            },
        }).then((response) => {
            if (response.status === 403) {
                alert('You are not authorized to view this page');
            } else {
                response.json().then((data) => {
                    console.log(data);
                    if (data.length > 0) {
                        const firstItem = data[0];
                        const keys = Object.keys(firstItem);
                        const newColumns = keys.map((key) => ({
                            field: key,
                            headerName: key,
                            width: key === 'Student Name' || key === 'Email' ? 250 : 150,
                            sorted: key === 'Student Name' || key === 'ID' ? true : false,
                        }));
                        setColumns(newColumns);
                    }
                    setRows(data);
                });
            }
        }).catch((err) => {
            alert(err);
        });
    }, []);

    return (
        <Box sx={{ height: "100vh", width: '100%' }}>
            <DataGrid
                getRowId={(row) => row.ID}
                rows={rows}
                columns={columns}
            />
        </Box>
    );
}