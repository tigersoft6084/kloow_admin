import React, { useEffect, useState } from 'react';
import useMain from 'hooks/useMain';
import Loader from 'components/Loader';
import {
  Box,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  IconButton,
  Typography,
  Modal,
  OutlinedInput,
  FormHelperText,
  Grid,
  Switch
} from '@mui/material';
import { LogoutOutlined } from '@ant-design/icons';
import SummaryCard from 'components/SummaryCard';
import AlertCard from 'components/AlertCard';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import FocusError from 'components/FocusError';

import useSnackbar from 'hooks/useSnackbar';
import useAuth from 'hooks/useAuth';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';

const Dashboard = () => {
  const { getAppList, serverList, createServer, updateServer, deleteServer } = useMain();
  const { logout } = useAuth();
  const { errorMessage, successMessage } = useSnackbar();

  // State to manage loading
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openStatus, setOpenStatus] = useState(false);
  const handleStatusOpen = () => setOpenStatus(true);
  const handleStatusClose = () => setOpenStatus(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleDeleteOpen = () => setOpenDelete(true);
  const handleDeleteClose = () => setOpenDelete(false);

  const [serverToEdit, setServerToEdit] = useState(null);
  const [deleteID, setDeleteID] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [loading, setLoading] = useState(true);

  const handleDeleteServer = async () => {
    if (deleteID) {
      setIsDeleting(true);
      const res = await deleteServer(deleteID);
      if (res.status) {
        successMessage(res.message);
      } else {
        errorMessage(res.message);
      }
      setDeleteID(null);
      setIsDeleting(false);
      handleDeleteClose();
    } else {
      errorMessage('No server selected for deletion');
    }
  };

  const handleUpdateServerStatus = async () => {
    if (serverToEdit) {
      setIsDeleting(true);
      const updatedServer = {
        is_active: serverToEdit.is_active === 1 ? 0 : 1
      };
      const res = await updateServer(serverToEdit.id, updatedServer);
      if (res.status) {
        successMessage(res.message);
      } else {
        errorMessage(res.message);
      }
      setServerToEdit(null);
      setIsDeleting(false);
      handleStatusClose();
    } else {
      errorMessage('No server selected for status update');
    }
  };

  useEffect(() => {
    getAppList().then(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Stack alignItems="flex-start" spacing={3} sx={{ width: '100%', minHeight: `calc(100vh - 48px)`, minWidth: 1110 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
            <Typography variant="h4">Login Server List</Typography>
            <IconButton onClick={logout}>
              <LogoutOutlined />
            </IconButton>
          </Stack>
          <Stack spacing={3} sx={{ width: '100%' }}>
            <Typography variant="subtitle1" color="textSecondary">
              Manage your login servers here. You can add, edit, or delete servers as needed.
            </Typography>
          </Stack>
          <Button
            variant="contained"
            size="large"
            disableElevation
            onClick={() => {
              handleOpen();
              setServerToEdit(null);
            }}
          >
            Add Server
          </Button>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 90px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Domain</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Membership API key</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serverList?.map((server) => (
                  <TableRow key={`server_${server.id}`}>
                    <TableCell>{server.domain}</TableCell>
                    <TableCell>{server.username}</TableCell>
                    <TableCell>{server.password}</TableCell>
                    <TableCell>{server.membership_key}</TableCell>
                    <TableCell>
                      <Switch
                        checked={server.is_active === 1}
                        onChange={() => {
                          setServerToEdit(server);
                          handleStatusOpen();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                          onClick={() => {
                            setServerToEdit(server);
                            handleOpen();
                          }}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setDeleteID(server.id);
                            handleDeleteOpen();
                          }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {serverList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="textSecondary">No servers available. Please add a server.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
      <Modal open={open} onClose={handleClose}>
        <SummaryCard title={serverToEdit ? 'Edit Server' : 'Add Server'} sx={{ width: { xs: '90%', sm: 480 } }}>
          <Formik
            enableReinitialize
            initialValues={{
              domain: serverToEdit?.domain ?? 'maserver.click',
              username: serverToEdit?.username ?? 'admin',
              password: serverToEdit?.password ?? '3@k#R4%kZ4d634',
              membership_key: serverToEdit?.membership_key ?? 'o1dWeElW6C9Ra7qY7y0Te4tg0rEp'
            }}
            validationSchema={Yup.object().shape({
              domain: Yup.string().max(255, 'Domain length should be less than 255').nullable().required('Domain is required'),
              username: Yup.string().max(255, 'Username length should be less than 255').nullable().required('Username is required'),
              password: Yup.string().max(255, 'Password length should be less than 255').nullable().required('Password is required'),
              membership_key: Yup.string()
                .max(255, 'Membership API key length should be less than 255')
                .nullable()
                .required('Membership API key is required')
            })}
            onSubmit={async (values, { setSubmitting }) => {
              const res = serverToEdit ? await updateServer(serverToEdit?.id, values) : await createServer(values);
              if (res.status) {
                successMessage(res.message);
              } else {
                errorMessage(res.message);
              }
              setSubmitting(false);
              handleClose();
            }}
          >
            {({ errors, handleSubmit, handleBlur, handleChange, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Box sx={{ width: '100%' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ width: '100%' }}>
                      <Typography>Domain*</Typography>
                      <OutlinedInput
                        fullWidth
                        minRows={3}
                        name="domain"
                        value={values.domain}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.domain && errors.domain && (
                        <FormHelperText error id="helper-text-domain">
                          {errors.domain}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} sx={{ width: '100%' }}>
                      <Typography>Username*</Typography>
                      <OutlinedInput
                        fullWidth
                        minRows={3}
                        name="username"
                        value={values.username}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.username && errors.username && (
                        <FormHelperText error id="helper-text-username">
                          {errors.username}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} sx={{ width: '100%' }}>
                      <Typography>Password*</Typography>
                      <OutlinedInput
                        fullWidth
                        minRows={3}
                        name="password"
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.password && errors.password && (
                        <FormHelperText error id="helper-text-password">
                          {errors.password}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} sx={{ width: '100%' }}>
                      <Typography>Membership API Key*</Typography>
                      <OutlinedInput
                        fullWidth
                        minRows={3}
                        name="membership_key"
                        value={values.membership_key}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.membership_key && errors.membership_key && (
                        <FormHelperText error id="helper-text-membership_key">
                          {errors.membership_key}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} sx={{ width: '100%' }}>
                      <Stack direction="row" spacing={3} justifyContent="flex-end" sx={{ width: '100%' }}>
                        <Button variant="outlined" size="large" disableElevation onClick={handleClose}>
                          Cancel
                        </Button>
                        <Button variant="contained" size="large" disableElevation onClick={handleSubmit} disabled={isSubmitting}>
                          {serverToEdit ? 'Update' : 'Save'}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
                <FocusError />
              </form>
            )}
          </Formik>
        </SummaryCard>
      </Modal>
      <Modal open={openDelete} onClose={handleDeleteClose}>
        <AlertCard title="Delete Server" sx={{ width: { xs: '90%', sm: '480px' } }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Typography gutterBottom>Do you really want to delete this server?</Typography>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button disableElevation variant="outlined" size="large" onClick={handleDeleteClose} sx={{ width: 100 }}>
                Cancel
              </Button>
              <Button
                disableElevation
                variant="contained"
                size="large"
                onClick={handleDeleteServer}
                disabled={isDeleting}
                sx={{ width: 100 }}
              >
                Yes
              </Button>
            </Stack>
          </Stack>
        </AlertCard>
      </Modal>
      <Modal open={openStatus} onClose={handleStatusClose}>
        <AlertCard title="Update Server Status" sx={{ width: { xs: '90%', sm: '480px' } }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Typography gutterBottom>
              Do you really want to update the <b>{serverToEdit?.domain}</b> server status to{' '}
              <b>{serverToEdit?.is_active === 1 ? 'Inactive' : 'Active'}</b>
            </Typography>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button disableElevation variant="outlined" size="large" onClick={handleStatusClose} sx={{ width: 100 }}>
                Cancel
              </Button>
              <Button
                disableElevation
                variant="contained"
                size="large"
                onClick={handleUpdateServerStatus}
                disabled={isDeleting}
                sx={{ width: 100 }}
              >
                Yes
              </Button>
            </Stack>
          </Stack>
        </AlertCard>
      </Modal>
    </>
  );
};

export default Dashboard;
