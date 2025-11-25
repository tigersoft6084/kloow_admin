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
  Switch,
  Checkbox,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { DeleteOutlined, EditOutlined, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import SummaryCard from 'components/SummaryCard';
import AlertCard from 'components/AlertCard';
import SimpleBarScroll from 'components/SimpleBar';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import FocusError from 'components/FocusError';
import { sleep } from 'utils/common';

import useSnackbar from 'hooks/useSnackbar';
import useAuth from 'hooks/useAuth';

const Dashboard = () => {
  const {
    updatePassword,
    getServerList,
    getWordpressServerList,
    serverList,
    wpMembershipList,
    createServer,
    updateServer,
    deleteServer,
    uploadImages,
    getAppListForImages,
    imageAppList,
    deleteAppForImages,
    getAppList,
    appList,
    getAllowedApps,
    updateAllowedApps
  } = useMain();
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

  const [openImage, setOpenImage] = useState(false);
  const handleOpenImage = () => setOpenImage(true);
  const handleCloseImage = () => setOpenImage(false);

  const [deleteAppID, setDeleteAppID] = useState(null);
  const [isAppDeleting, setIsAppDeleting] = useState(false);

  const [openDeleteApp, setOpenDeleteApp] = useState(false);
  const handleDeleteAppOpen = () => setOpenDeleteApp(true);
  const handleDeleteAppClose = () => setOpenDeleteApp(false);

  const [allowedApps, setAllowedApps] = useState([]);

  const [openConfirmAllowedApps, setOpenConfirmAllowedApps] = useState(false);
  const handleConfirmAllowedAppsOpen = () => setOpenConfirmAllowedApps(true);
  const handleConfirmAllowedAppsClose = () => setOpenConfirmAllowedApps(false);

  const [isUpdatingAllowedApps, setIsUpdatingAllowedApps] = useState(false);

  const [loading, setLoading] = useState(true);

  const [openSetting, setOpenSetting] = useState(false);
  const handleSettingOpen = () => setOpenSetting(true);
  const handleSettingClose = () => setOpenSetting(false);

  const [capsWarning, setCapsWarning] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

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

  const handleDeleteApp = async () => {
    if (deleteAppID) {
      setIsAppDeleting(true);
      const res = await deleteAppForImages(deleteAppID);
      if (res.status) {
        successMessage(res.message);
      } else {
        errorMessage(res.message);
      }
      setDeleteAppID(null);
      setIsAppDeleting(false);
      handleDeleteAppClose();
    } else {
      errorMessage('No application selected for deletion');
    }
  };

  const handleUpdateAllowedApps = async () => {
    setIsUpdatingAllowedApps(true);
    const res = await updateAllowedApps(allowedApps);
    if (res.status) {
      successMessage(res.message);
      setAllowedApps(res.data);
    } else {
      errorMessage(res.message);
    }
    setIsUpdatingAllowedApps(false);
    handleConfirmAllowedAppsClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([getServerList(), getWordpressServerList(), getAppListForImages(), getAppList()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchAllowedApps = async () => {
      const res = await getAllowedApps();
      if (res.status) {
        setAllowedApps(res.data);
      } else {
        errorMessage(res.message);
      }
    };
    fetchAllowedApps();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <SimpleBarScroll
          sx={{
            maxHeight: '100vh',
            overflowX: 'hidden',
            '& .simplebar-content': {
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 1110, margin: 'auto' }}>
            <Stack alignItems="flex-start" spacing={3} sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                <Typography variant="h4">Login Server Management</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton onClick={handleSettingOpen}>
                    <SettingOutlined />
                  </IconButton>
                  <IconButton onClick={logout}>
                    <LogoutOutlined />
                  </IconButton>
                </Stack>
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
              <TableContainer sx={{ width: { xs: '100%', md: '75%' } }}>
                <Table>
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
              <TableContainer sx={{ width: { xs: '100%', md: '50%' } }}>
                <Table>
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
              <Typography variant="h4">Allowed Application List</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Below is the list of applications that are allowed to be used with the wordpress login servers. You can manage the
                applications for each membership plan here. You must click the <b>UPDATE</b> button for the changes to be applied to all
                servers.
              </Typography>
              <Button variant="contained" size="large" disableElevation onClick={handleConfirmAllowedAppsOpen}>
                Update
              </Button>
              <TableContainer sx={{ width: '100%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Wordpress Server</TableCell>
                      <TableCell>Membership Plan</TableCell>
                      <TableCell>Allowed Applications</TableCell>
                      <TableCell>Screaming Frog</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wpMembershipList?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography color="textSecondary">No wordpress servers available. Please add a new one.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {wpMembershipList?.map((server, idx0) => (
                      <TableRow key={`wp_server_${idx0}`}>
                        <TableCell>{server.domain}</TableCell>
                        <TableCell>{server.membership_label}</TableCell>
                        <TableCell>
                          <Grid container spacing={1} key={`grid_${idx0}`}>
                            {appList?.map((application, idx) => (
                              <Grid key={`allowed_app_checkbox_${idx0}_${idx}`}>
                                <FormControlLabel
                                  label={application}
                                  control={
                                    <Checkbox
                                      checked={
                                        allowedApps
                                          .find((a) => a.server_name === server.domain && a.membership_id === server.membership_id)
                                          ?.allowed_apps.includes(application) || false
                                      }
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setAllowedApps((prevAllowedApps) => {
                                          const serverIndex = prevAllowedApps.findIndex(
                                            (a) => a.server_name === server.domain && a.membership_id === server.membership_id
                                          );
                                          if (serverIndex > -1) {
                                            const updatedAllowedApps = { ...prevAllowedApps[serverIndex] };
                                            if (isChecked) {
                                              updatedAllowedApps.allowed_apps.push(application);
                                            } else {
                                              updatedAllowedApps.allowed_apps = updatedAllowedApps.allowed_apps.filter(
                                                (app) => app !== application
                                              );
                                            }
                                            const newAllowedApps = [...prevAllowedApps];
                                            newAllowedApps[serverIndex] = updatedAllowedApps;
                                            return newAllowedApps;
                                          } else {
                                            return [
                                              ...prevAllowedApps,
                                              {
                                                server_name: server.domain,
                                                membership_id: server.membership_id,
                                                allowed_apps: isChecked ? [application] : [],
                                                frog: false
                                              }
                                            ];
                                          }
                                        });
                                      }}
                                    />
                                  }
                                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }, '& .MuiCheckbox-root': { p: 0.5 } }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={allowedApps.find((a) => a.server_name === server.domain && a.membership_id === server.membership_id)?.frog || false}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              setAllowedApps((prevAllowedApps) => {
                                const serverIndex = prevAllowedApps.findIndex(
                                  (a) => a.server_name === server.domain && a.membership_id === server.membership_id
                                );
                                if (serverIndex > -1) {
                                  const updatedAllowedApps = { ...prevAllowedApps[serverIndex] };
                                  updatedAllowedApps.frog = isChecked;
                                  const newAllowedApps = [...prevAllowedApps];
                                  newAllowedApps[serverIndex] = updatedAllowedApps;
                                  return newAllowedApps;
                                } else {
                                  return [
                                    ...prevAllowedApps,
                                    {
                                      server_name: server.domain,
                                      membership_id: server.membership_id,
                                      allowed_apps: [],
                                      frog: isChecked
                                    }
                                  ];
                                }
                              });
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="h4">Application Images</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Manage your application images here. You can upload, view, or delete images as needed. (Recommended sizes: Thumbnail 16:9,
                Logo 1:1)
              </Typography>
              <Button variant="contained" size="large" disableElevation onClick={handleOpenImage}>
                Add Application Image
              </Button>
              <TableContainer sx={{ width: { xs: '100%', md: '75%' } }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Application Name</TableCell>
                      <TableCell>Thumbnail Image</TableCell>
                      <TableCell>Logo Image</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {imageAppList?.map((app) => (
                      <TableRow key={`app_${app.id}`}>
                        <TableCell>{app.app_name}</TableCell>
                        <TableCell>
                          {app.thumb_path ? (
                            <img src={app.thumb_path} alt={`${app.app_name} Thumbnail`} style={{ width: 'auto', height: 60 }} />
                          ) : (
                            'No Image'
                          )}
                        </TableCell>
                        <TableCell>
                          {app.logo_path ? (
                            <img src={app.logo_path} alt={`${app.app_name} Logo`} style={{ width: 'auto', height: 32 }} />
                          ) : (
                            'No Image'
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              setDeleteAppID(app.id);
                              handleDeleteAppOpen();
                            }}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {imageAppList?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="textSecondary">No application images available. Please add a new one.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Box>
        </SimpleBarScroll>
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
                    <Grid size={{ xs: 12 }}>
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
                    <Grid size={{ xs: 12 }}>
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
                    <Grid size={{ xs: 12 }}>
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
                    <Grid size={{ xs: 12 }}>
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
                    <Grid size={{ xs: 12 }}>
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
      <Modal open={openImage} onClose={handleCloseImage}>
        <SummaryCard title="Upload Server Images" sx={{ width: { xs: '90%', sm: 480 } }}>
          <Formik
            initialValues={{
              applicationName: '',
              thumbImage: null,
              logoImage: null
            }}
            validationSchema={Yup.object().shape({
              applicationName: Yup.string().required('Server name is required'),
              thumbImage: Yup.mixed()
                .required('Thumbnail image is required')
                .test('fileType', 'Only image files are allowed', (file) => (file ? file.type.startsWith('image/') : false)),
              logoImage: Yup.mixed()
                .required('Logo image is required')
                .test('fileType', 'Only image files are allowed', (file) => (file ? file.type.startsWith('image/') : false))
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              try {
                // 🟢 Use uploadImages function from context
                const result = await uploadImages(values.applicationName, values.thumbImage, values.logoImage);

                if (result.status) {
                  successMessage(result.message);
                  resetForm();
                  handleCloseImage();
                } else {
                  errorMessage(result.message);
                }
              } catch (err) {
                console.error(err);
                errorMessage('Upload failed');
              }
              setSubmitting(false);
            }}
          >
            {({ errors, handleSubmit, handleBlur, setFieldValue, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Box sx={{ width: '100%' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Typography>Application Name*</Typography>
                      <OutlinedInput
                        fullWidth
                        name="applicationName"
                        value={values.applicationName}
                        onBlur={handleBlur}
                        onChange={(e) => setFieldValue('applicationName', e.target.value)}
                      />
                      {touched.applicationName && errors.applicationName && <FormHelperText error>{errors.applicationName}</FormHelperText>}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Typography>Thumbnail Image (Recommended 16:9)</Typography>
                      <OutlinedInput
                        fullWidth
                        type="file"
                        name="thumbImage"
                        inputProps={{ accept: 'image/*' }}
                        onChange={(e) => setFieldValue('thumbImage', e.currentTarget.files[0])}
                      />
                      {touched.thumbImage && errors.thumbImage && <FormHelperText error>{errors.thumbImage}</FormHelperText>}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Typography>Logo Image (Recommended 1:1)</Typography>
                      <OutlinedInput
                        fullWidth
                        type="file"
                        name="logoImage"
                        inputProps={{ accept: 'image/*' }}
                        onChange={(e) => setFieldValue('logoImage', e.currentTarget.files[0])}
                      />
                      {touched.logoImage && errors.logoImage && <FormHelperText error>{errors.logoImage}</FormHelperText>}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Stack direction="row" spacing={3} justifyContent="flex-end">
                        <Button disableElevation variant="outlined" size="large" onClick={handleCloseImage}>
                          Cancel
                        </Button>
                        <Button disableElevation variant="contained" size="large" type="submit" disabled={isSubmitting}>
                          Upload
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
      <Modal open={openDeleteApp} onClose={handleDeleteAppClose}>
        <AlertCard title="Delete Application Images" sx={{ width: { xs: '90%', sm: '480px' } }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Typography gutterBottom>Do you really want to delete this application images?</Typography>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button disableElevation variant="outlined" size="large" onClick={handleDeleteAppClose} sx={{ width: 100 }}>
                Cancel
              </Button>
              <Button
                disableElevation
                variant="contained"
                size="large"
                onClick={handleDeleteApp}
                disabled={isAppDeleting}
                sx={{ width: 100 }}
              >
                Yes
              </Button>
            </Stack>
          </Stack>
        </AlertCard>
      </Modal>
      <Modal open={openConfirmAllowedApps} onClose={handleConfirmAllowedAppsClose}>
        <AlertCard title="Update Allowed Application List" sx={{ width: { xs: '90%', md: '720px' } }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Typography gutterBottom>
              Do you really want to update the allowed application list for each WordPress server & membership plan?
            </Typography>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button disableElevation variant="outlined" size="large" onClick={handleConfirmAllowedAppsClose} sx={{ width: 100 }}>
                Cancel
              </Button>
              <Button
                disableElevation
                variant="contained"
                size="large"
                onClick={handleUpdateAllowedApps}
                disabled={isUpdatingAllowedApps}
                sx={{ width: 100 }}
              >
                Yes
              </Button>
            </Stack>
          </Stack>
        </AlertCard>
      </Modal>
      <Modal open={openSetting} onClose={handleSettingClose}>
        <SummaryCard title="Update Password" sx={{ width: { xs: '90%', sm: 480 } }}>
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmNewPassword: ''
            }}
            validationSchema={Yup.object().shape({
              currentPassword: Yup.string().required('Current password is required'),
              newPassword: Yup.string().min(8, 'New password must be at least 8 characters').required('New password is required'),
              confirmNewPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                .required('Confirm new password is required')
            })}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              const response = await updatePassword(values);
              setSubmitting(false);
              if (response.status) {
                handleSettingClose();
                successMessage(response.message);
                await sleep(2000);
                logout();
              } else {
                errorMessage(response.message);
              }
            }}
          >
            {({ errors, handleSubmit, handleBlur, handleChange, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Box sx={{ width: '100%' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Typography>Current Password*</Typography>
                      <OutlinedInput
                        fullWidth
                        type={showCurrentPassword ? 'text' : 'password'}
                        color={capsWarning ? 'warning' : 'primary'}
                        name="currentPassword"
                        value={values.currentPassword}
                        error={Boolean(touched.currentPassword && errors.currentPassword)}
                        onBlur={(event) => {
                          setCapsWarning(false);
                          handleBlur(event);
                        }}
                        onKeyDown={(keyEvent) => {
                          if (keyEvent.getModifierState('CapsLock')) {
                            setCapsWarning(true);
                          } else {
                            setCapsWarning(false);
                          }
                        }}
                        onChange={handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowCurrentPassword((prev) => !prev)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                            >
                              {showCurrentPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {capsWarning && (
                        <Typography variant="caption" sx={{ color: 'warning.main' }} id="warning-helper-text-password-login">
                          Caps lock on!
                        </Typography>
                      )}
                      {touched.currentPassword && errors.currentPassword && (
                        <FormHelperText error id="helper-text-currentPassword">
                          {errors.currentPassword}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography>New Password*</Typography>
                      <OutlinedInput
                        fullWidth
                        type={showNewPassword ? 'text' : 'password'}
                        color={capsWarning ? 'warning' : 'primary'}
                        name="newPassword"
                        value={values.newPassword}
                        onBlur={(event) => {
                          setCapsWarning(false);
                          handleBlur(event);
                        }}
                        onKeyDown={(keyEvent) => {
                          if (keyEvent.getModifierState('CapsLock')) {
                            setCapsWarning(true);
                          } else {
                            setCapsWarning(false);
                          }
                        }}
                        onChange={handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowNewPassword((prev) => !prev)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                            >
                              {showNewPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                        error={Boolean(touched.newPassword && errors.newPassword)}
                      />
                      {capsWarning && (
                        <Typography variant="caption" sx={{ color: 'warning.main' }} id="warning-helper-text-password-login">
                          Caps lock on!
                        </Typography>
                      )}
                      {touched.newPassword && errors.newPassword && (
                        <FormHelperText error id="helper-text-newPassword">
                          {errors.newPassword}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography>Confirm New Password*</Typography>
                      <OutlinedInput
                        fullWidth
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        color={capsWarning ? 'warning' : 'primary'}
                        name="confirmNewPassword"
                        value={values.confirmNewPassword}
                        error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
                        onBlur={(event) => {
                          setCapsWarning(false);
                          handleBlur(event);
                        }}
                        onKeyDown={(keyEvent) => {
                          if (keyEvent.getModifierState('CapsLock')) {
                            setCapsWarning(true);
                          } else {
                            setCapsWarning(false);
                          }
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                            >
                              {showConfirmNewPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                        onChange={handleChange}
                      />
                      {capsWarning && (
                        <Typography variant="caption" sx={{ color: 'warning.main' }} id="warning-helper-text-password-login">
                          Caps lock on!
                        </Typography>
                      )}
                      {touched.confirmNewPassword && errors.confirmNewPassword && (
                        <FormHelperText error id="helper-text-confirmNewPassword">
                          {errors.confirmNewPassword}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Stack direction="row" spacing={3} justifyContent="flex-end" sx={{ width: '100%' }}>
                        <Button variant="outlined" size="large" disableElevation onClick={handleSettingClose}>
                          Cancel
                        </Button>
                        <Button variant="contained" size="large" disableElevation onClick={handleSubmit} disabled={isSubmitting}>
                          Update
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </form>
            )}
          </Formik>
        </SummaryCard>
      </Modal>
    </>
  );
};

export default Dashboard;
