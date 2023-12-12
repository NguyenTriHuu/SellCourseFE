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
        valueGetter: (params) => (params.row.status ? 'Active' : 'Block'),
    },
    {
        field: 'registerDate',
        headerName: 'Date Register',
        type: 'time',
        width: 150,
    },
    {
        field: 'approvedDate',
        headerName: 'Date Approved',
        type: 'time',
        width: 150,
    },
    {
        field: 'approved',
        headerName: 'Approved',
    },
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
