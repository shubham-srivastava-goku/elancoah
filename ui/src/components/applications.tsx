import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { List, ListSubheader, Collapse, ListItemButton, ListItemText, Button } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid';
import { IAPIRaw } from '../App';

interface IApplicationInfo {
  name: string,
  handleInfoClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, cellValues: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>): void,
}

function ApplicationInfo(props: IApplicationInfo) {
  const [rows, setRows] = useState([] as IAPIRaw[]);
  const { handleInfoClick } = props;
  useEffect(() => {
    (async () => {
      const response = await axios.get(`https://engineering-task.elancoapps.com/api//applications/${props.name}`);
      response.data.forEach((value: IAPIRaw) => {
        value.id = v4();
        value.Cost = parseFloat(`${value.Cost}`);
        value.ConsumedQuantity = parseFloat(`${value.ConsumedQuantity}`);
      });

      setRows(response.data as IAPIRaw[]);
    })();
  }, [props.name]);

  const columns: GridColDef[] = [
    { field: 'InstanceId', headerName: 'Instance Id', width: 370 },
    { field: 'ConsumedQuantity', headerName: 'Consumed Quantity', width: 150 },
    { field: 'Cost', headerName: 'Cost' },
    { field: 'Date', headerName: 'Date' },
    { field: 'ServiceName', headerName: 'Service Name' },
    {
      field: 'Info', renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleInfoClick(event, cellValues);
            }}
          >
            View more
          </Button>
        )
      },
      width: 180,
    }
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pagination
      autoPageSize
      style={{ height: 700, width: '100%' }}
    />
  )
}

export function Applications(props: {
  handleInfoClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, cellValues: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>): void,
}) {
  const [appList, setAppList] = useState([]);
  const [open, setOpen] = useState({} as { [key: string]: boolean });
  const [current, setCurrent] = useState("");
  const { handleInfoClick } = props;
  const handleClick = (value: string) => {
    if (value === current) {
      setOpen({
        ...open,
        [current]: !open[current],
      });
    } else {
      setOpen({
        ...open,
        [current]: false,
        [value]: true,
      });
    }

    setCurrent(value);
  };

  useEffect(() => {
    (async () => {
      const response = await axios.get('https://engineering-task.elancoapps.com/api/applications');
      response.data.forEach((value: string) => {
        createOpenCloseVar(value);
      });
      setAppList(response.data);
    })();
    // eslint-disable-next-line
  }, []);

  const createOpenCloseVar = (value: string) => {
    setOpen({
      ...open,
      [value]: false,
    })
  };

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader" style={{ fontWeight: 900, fontSize: "1.5rem" }}>
          Applications
        </ListSubheader>
      }
    >
      {
        appList.map((value) => {
          return (
            <>
              <ListItemButton onClick={() => { handleClick(value); }}>
                <ListItemText primary={value} />
                {open[value] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open[value]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary={<ApplicationInfo handleInfoClick={handleInfoClick} name={value} />} />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )
        })
      }
    </List>
  );
}