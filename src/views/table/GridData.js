import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'title',
        headerName: 'Title',
        width: 400,
    },
    /*{
        field: 'teacher',
        headerName: 'Taught By',
        //.valueGetter: (params) => `${params.row.teacher || ''}`,
    },*/
    {
        field: 'dateStart',
        headerName: 'Date Start',
        type: 'time',
        width: 150,
    },
    /*{
        field: 'member',
        headerName: 'N.O Member',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        // valueGetter: (params) =>
        //    `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },*/
    {
        field: 'status',
        headerName: 'Status',
    },
];
const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

function TableAllCourse({ data, onSelectCourse, courseSelect }) {
    // const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    console.log(data);
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={data?.listCourse || []}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    onSelectCourse(newRowSelectionModel);
                }}
                rowSelectionModel={courseSelect}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
export default React.memo(TableAllCourse);
