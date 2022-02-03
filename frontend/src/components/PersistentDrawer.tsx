import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'center'
}));

//a functional component that returns a drawer which is anchored on the left of the screen
export default function PersistentDrawer(props: {repos: string[]}){
  const theme = useTheme();
  
  return(
    <Drawer variant="persistent" anchor="left" open={true}>
      <DrawerHeader>
        <Typography variant="h6">Repositories</Typography>
      </DrawerHeader>
      <Divider />
      {props.repos.map((repo: string) => (
        <Box>
          <List>
            <ListItem button>
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary={repo} />
            </ListItem>
          </List>
          <Divider />
        </Box>
      ))}
    </Drawer>  
  );
}
  