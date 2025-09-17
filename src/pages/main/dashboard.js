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
  const { getServerList, serverList, createServer, updateServer, deleteServer } = useMain();
  const { logout } = useAuth();
  const { errorMessage, successMessage } = useSnackbar();

  // State to manage loading
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // State to manage loading
  const [openNext, setOpenNext] = useState(false);
  const handleOpenNext = () => setOpenNext(true);
  const handleCloseNext = () => setOpenNext(false);

  const [openStatus, setOpenStatus] = useState(false);
  const handleStatusOpen = () => setOpenStatus(true);
  const handleStatusClose = () => setOpenStatus(false);

  const [openNextStatus, setOpenNextStatus] = useState(false);
  const handleNextStatusOpen = () => setOpenNextStatus(true);
  const handleNextStatusClose = () => setOpenNextStatus(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleDeleteOpen = () => setOpenDelete(true);
  const handleDeleteClose = () => setOpenDelete(false);

  const [openNextDelete, setOpenNextDelete] = useState(false);
  const handleNextDeleteOpen = () => setOpenNextDelete(true);
  const handleNextDeleteClose = () => setOpenNextDelete(false);

  const [serverToEdit, setServerToEdit] = useState(null);
  const [deleteID, setDeleteID] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [serverNextToEdit, setServerNextToEdit] = useState(null);
  const [deleteNextID, setDeleteNextID] = useState(null);
  const [isNextDeleting, setIsNextDeleting] = useState(false);

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

  const handleNextDeleteServer = async () => {
    if (deleteNextID) {
      setIsNextDeleting(true);
      const res = await deleteServer(deleteNextID);
      if (res.status) {
        successMessage(res.message);
      } else {
        errorMessage(res.message);
      }
      setDeleteNextID(null);
      setIsNextDeleting(false);
      handleNextDeleteClose();
    } else {
      errorMessage('No server selected for deletion');
    }
  };

  const handleUpdateNextServerStatus = async () => {
    if (serverNextToEdit) {
      setIsNextDeleting(true);
      const updatedServer = {
        is_active: serverNextToEdit.is_active === 1 ? 0 : 1
      };
      const res = await updateServer(serverNextToEdit.id, updatedServer);
      if (res.status) {
        successMessage(res.message);
      } else {
        errorMessage(res.message);
      }
      setServerNextToEdit(null);
      setIsNextDeleting(false);
      handleNextStatusClose();
    } else {
      errorMessage('No server selected for status update');
    }
  };

  useEffect(() => {
    getServerList().then(() => setLoading(false));
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
          <Typography variant="subtitle1" color="textSecondary">
            Manage your login servers here. You can add, edit, or delete servers as needed.
          </Typography>
          <Button
            variant="contained"
            size="large"
            disableElevation
            onClick={() => {
              handleOpen();
              setServerToEdit(null);
            }}
          >
            Add Wordpress Server
          </Button>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 90px)', width: { xs: '100%', md: '75%' } }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Domain</TableCell>
                  <TableCell>Membership API key</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serverList
                  ?.filter((server) => server?.type === 'wordpress')
                  ?.map((server) => (
                    <TableRow key={`server_${server.id}`}>
                      <TableCell>{server.domain}</TableCell>
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
                {serverList?.filter((server) => server?.type === 'wordpress').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="textSecondary">No wordpress servers available. Please add a new one.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            size="large"
            disableElevation
            onClick={() => {
              handleOpenNext();
              setServerNextToEdit(null);
            }}
          >
            Add Nextjs Server
          </Button>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 90px)', width: { xs: '100%', md: '50%' } }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Domain</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serverList
                  ?.filter((server) => server?.type === 'nextjs')
                  ?.map((server) => (
                    <TableRow key={`server_${server.id}`}>
                      <TableCell>{server.domain}</TableCell>
                      <TableCell>
                        <Switch
                          checked={server.is_active === 1}
                          onChange={() => {
                            setServerNextToEdit(server);
                            handleNextStatusOpen();
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconButton
                            onClick={() => {
                              setServerNextToEdit(server);
                              handleOpenNext();
                            }}
                          >
                            <EditOutlined />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setDeleteNextID(server.id);
                              handleNextDeleteOpen();
                            }}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                {serverList?.filter((server) => server?.type === 'nextjs').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="textSecondary">No nextjs servers available. Please add a new one.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
      <Modal open={open} onClose={handleClose}>
        <SummaryCard title={serverToEdit ? 'Edit Wordpress Server' : 'Add Wordpress Server'} sx={{ width: { xs: '90%', sm: 480 } }}>
          <Formik
            enableReinitialize
            initialValues={{
              domain: serverToEdit?.domain ?? 'maserver.click',
              membership_key: serverToEdit?.membership_key ?? 'o1dWeElW6C9Ra7qY7y0Te4tg0rEp',
              type: 'wordpress'
            }}
            validationSchema={Yup.object().shape({
              domain: Yup.string().max(255, 'Domain length should be less than 255').nullable().required('Domain is required'),
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
      <Modal open={openNext} onClose={handleCloseNext}>
        <SummaryCard title={serverNextToEdit ? 'Edit Nextjs Server' : 'Add Nextjs Server'} sx={{ width: { xs: '90%', sm: 480 } }}>
          <Formik
            enableReinitialize
            initialValues={{
              domain: serverNextToEdit?.domain ?? 'debicaserver.click',
              membership_key: 'membership_key',
              type: 'nextjs'
            }}
            validationSchema={Yup.object().shape({
              domain: Yup.string().max(255, 'Domain length should be less than 255').nullable().required('Domain is required')
            })}
            onSubmit={async (values, { setSubmitting }) => {
              const res = serverNextToEdit ? await updateServer(serverNextToEdit?.id, values) : await createServer(values);
              if (res.status) {
                successMessage(res.message);
              } else {
                errorMessage(res.message);
              }
              setSubmitting(false);
              handleCloseNext();
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
                      <Stack direction="row" spacing={3} justifyContent="flex-end" sx={{ width: '100%' }}>
                        <Button variant="outlined" size="large" disableElevation onClick={handleCloseNext}>
                          Cancel
                        </Button>
                        <Button variant="contained" size="large" disableElevation onClick={handleSubmit} disabled={isSubmitting}>
                          {serverNextToEdit ? 'Update' : 'Save'}
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
        <AlertCard title="Delete Wordpress Server" sx={{ width: { xs: '90%', sm: '480px' } }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Typography gutterBottom>Do you really want to delete this wordpress server?</Typography>
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
        <AlertCard title="Update Wordpress Server Status" sx={{ width: { xs: '90%', sm: '480px' } }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Typography gutterBottom>
              Do you really want to update the <b>{serverToEdit?.domain}</b> wordpress server status to{' '}
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
      <Modal open={openNextDelete} onClose={handleNextDeleteClose}>
        <AlertCard title="Delete Nextjs Server" sx={{ width: { xs: '90%', sm: '480px' } }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Typography gutterBottom>Do you really want to delete this nextjs server?</Typography>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button disableElevation variant="outlined" size="large" onClick={handleNextDeleteClose} sx={{ width: 100 }}>
                Cancel
              </Button>
              <Button
                disableElevation
                variant="contained"
                size="large"
                onClick={handleNextDeleteServer}
                disabled={isNextDeleting}
                sx={{ width: 100 }}
              >
                Yes
              </Button>
            </Stack>
          </Stack>
        </AlertCard>
      </Modal>
      <Modal open={openNextStatus} onClose={handleNextStatusClose}>
        <AlertCard title="Update Nextjs Server Status" sx={{ width: { xs: '90%', sm: '480px' } }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Typography gutterBottom>
              Do you really want to update the <b>{serverNextToEdit?.domain}</b> nextjs server status to{' '}
              <b>{serverNextToEdit?.is_active === 1 ? 'Inactive' : 'Active'}</b>
            </Typography>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button disableElevation variant="outlined" size="large" onClick={handleNextStatusClose} sx={{ width: 100 }}>
                Cancel
              </Button>
              <Button
                disableElevation
                variant="contained"
                size="large"
                onClick={handleUpdateNextServerStatus}
                disabled={isNextDeleting}
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
