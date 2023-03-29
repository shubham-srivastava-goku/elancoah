import { useState } from 'react';
import './App.css';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { Tab, Tabs, Dialog, DialogTitle, IconButton, DialogContent, Typography } from '@mui/material';
import { TabPanel } from './components/tabPanel';
import { Applications } from './components/applications';
import { Resources } from './components/resources';
import { GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

export interface IAPIRaw {
  id: string,
  ConsumedQuantity: number | string,
  Cost: number | string,
  Date: Date | string,
  InstanceId: string,
  MeterCategory: string,
  ResourceGroup: string,
  ResourceLocation: string,
  Tags: {
    [key: string]: string,
  },
  UnitOfMeasure: string,
  Location: string,
  ServiceName: string,
}

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function App() {
  const [value, setValue] = useState(0);
  const [currentData, setCurrentData] = useState({} as IAPIRaw);
  const [openDialog, setOpenDialog] = useState(false);
  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleInfoClick = (event: React.MouseEvent, value: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
    setCurrentData(value.row as IAPIRaw);
    setOpenDialog(true);
  }

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }


  return (
    <div className="App">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} component="div">
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Application" {...a11yProps(0)} />
          <Tab label="Resources" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Applications handleInfoClick={handleInfoClick} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Resources handleInfoClick={handleInfoClick}/>
        </TabPanel>
        <BootstrapDialog open={openDialog}>
          <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { setOpenDialog(false); }}>
            {currentData.InstanceId}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              <table>
                {
                  Object.entries(currentData).map((value, key) => (
                    <tr key={key}>
                      <td>
                        {`${value[0]}: `}
                      </td>
                      <td>
                        {typeof value[1] === "object" ? JSON.stringify(value[1]) : value[1]}
                      </td>
                    </tr>
                  ))
                }
              </table>
            </Typography>
          </DialogContent>
        </BootstrapDialog>
      </Box>
    </div >
  );
}

export default App;
