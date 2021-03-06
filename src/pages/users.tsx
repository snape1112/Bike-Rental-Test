import { Box, Button, Modal, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Menu } from '../components/menu';
import {
  ISaveUserFormInputs,
  SaveUserForm
} from '../components/save-user-form';
import { UsersList } from '../components/users-list';
import { UsersWhoReservedBike } from '../components/users-who-reserved-bike';
import { useCreateUser } from '../hooks/use-create-user';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export enum EnumTab {
  ALL_USERS = 'all_users',
  RESERVED_USERS = 'reserved_users',
};

const Users: NextPage = () => {
  const [tabValue, setTabValue] = useState(EnumTab.ALL_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutateAsync, error, isLoading, reset } = useCreateUser();

  const handleTabChange = (event: React.SyntheticEvent, newValue: EnumTab) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (user: ISaveUserFormInputs) => {
    try {
      await mutateAsync(user);
      reset();
      toggleModal();
    } catch (err: any) {
      reset();
      console.log(err?.message, 'save error');
    }
  };

  const toggleModal = () => setIsModalOpen(oldValue => !oldValue);

  return (
    <div>
      <Head>
        <title>Bike Rentals - Users management</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Menu>
        <Modal
          open={isModalOpen}
          onClose={toggleModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <SaveUserForm
              title="Create new user"
              isLoading={isLoading}
              onSubmit={handleSubmit}
              error={error?.message}
            />
          </Box>
        </Modal>

        <Box>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="User Page Tabs">
                <Tab label="All Users" value={EnumTab.ALL_USERS} />
                <Tab label="Users who reserved a bike" value={EnumTab.RESERVED_USERS} />
              </TabList>
            </Box>
            <TabPanel value={EnumTab.ALL_USERS}>
              <Button onClick={toggleModal} variant="contained" size="large">
                Add new user
              </Button>
              <Box sx={{ marginTop: 2 }}>
                <UsersList />
              </Box>
            </TabPanel>
            <TabPanel value={EnumTab.RESERVED_USERS}>
              <UsersWhoReservedBike />
            </TabPanel>
          </TabContext>
        </Box>
      </Menu>
    </div>
  );
};

export default Users;
