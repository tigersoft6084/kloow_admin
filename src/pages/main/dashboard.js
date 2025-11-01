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
  FormControlLabel
} from '@mui/material';
import { LogoutOutlined } from '@ant-design/icons';
import SummaryCard from 'components/SummaryCard';
import AlertCard from 'components/AlertCard';
import SimpleBarScroll from 'components/SimpleBar';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import FocusError from 'components/FocusError';

import useSnackbar from 'hooks/useSnackbar';
import useAuth from 'hooks/useAuth';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';

const Dashboard = () => {
  const {
    getServerList,
    serverList,
    createServer,
    updateServer,
    deleteServer,
    uploadImages,
    getAppListForImages,
    imageAppList,
    deleteAppForImages,
    getMembershipPlanList,
    membershipPlanList,
    createMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan,
    getAppList,
    appList,
    getWpServerMembershipPlanMatching,
    updatetWpServerMembershipPlanMatching,
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

  const [membershipPlanToEdit, setMembershipPlanToEdit] = useState(null);
  const [deleteMembershipPlanID, setDeleteMembershipPlanID] = useState(null);
  const [isMembershipPlanDeleting, setIsMembershipPlanDeleting] = useState(false);

  const [openDeleteMembershipPlan, setOpenDeleteMembershipPlan] = useState(false);
  const handleDeleteMembershipPlanOpen = () => setOpenDeleteMembershipPlan(true);
  const handleDeleteMembershipPlanClose = () => setOpenDeleteMembershipPlan(false);

  const [openMembershipPlan, setOpenMembershipPlan] = useState(false);
  const handleOpenMembershipPlan = () => setOpenMembershipPlan(true);
  const handleCloseMembershipPlan = () => setOpenMembershipPlan(false);

  const [matchings, setMatchings] = useState([]);

  const [openConfirmMatching, setOpenConfirmMatching] = useState(false);
  const handleConfirmMatchingOpen = () => setOpenConfirmMatching(true);
  const handleConfirmMatchingClose = () => setOpenConfirmMatching(false);

  const [allowedApps, setAllowedApps] = useState([]);

  const [openConfirmAllowedApps, setOpenConfirmAllowedApps] = useState(false);
  const handleConfirmAllowedAppsOpen = () => setOpenConfirmAllowedApps(true);
  const handleConfirmAllowedAppsClose = () => setOpenConfirmAllowedApps(false);

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

  const handleDeleteMembershipPlan = async () => {
    if (deleteMembershipPlanID) {
      setIsMembershipPlanDeleting(true);
      const res = await deleteMembershipPlan(deleteMembershipPlanID);
      if (res.status) {
        successMessage(res.message);
      } else {
        errorMessage(res.message);
      }
      setDeleteMembershipPlanID(null);
      setIsMembershipPlanDeleting(false);
      handleDeleteMembershipPlanClose();
    } else {
      errorMessage('No role selected for deletion');
    }
  };

  const handleUpdateMatchings = async () => {
    const res = await updatetWpServerMembershipPlanMatching(matchings);
    if (res.status) {
      const allowed_app_res = await getAllowedApps();
      if (allowed_app_res.status) {
        setAllowedApps(allowed_app_res.data);
      }
      successMessage(res.message);
      setMatchings(res.data);
    } else {
      errorMessage(res.message);
    }
    handleConfirmMatchingClose();
  };

  const handleUpdateAllowedApps = async () => {
    const res = await updateAllowedApps(allowedApps);
    if (res.status) {
      successMessage(res.message);
      setAllowedApps(res.data);
    } else {
      errorMessage(res.message);
    }
    handleConfirmAllowedAppsClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([getServerList(), getAppListForImages(), getMembershipPlanList(), getAppList()]);
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
    const fetchMatchingData = async () => {
      const res = await getWpServerMembershipPlanMatching();
      if (res.status) {
        setMatchings(res.data);
      } else {
        errorMessage(res.message);
      }
    };
    fetchMatchingData();
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
              <Typography variant="h4">Membership Plan Management</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Manage your membership plans here. You can create, edit, or delete membership plans as needed.
              </Typography>
              <Button
                variant="contained"
                size="large"
                disableElevation
                onClick={() => {
                  handleOpenMembershipPlan();
                  setMembershipPlanToEdit(null);
                }}
              >
                Add Membership Plan
              </Button>
              <TableContainer sx={{ width: { xs: '100%', md: '75%' } }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>WP Server</TableCell>
                      <TableCell>Membership Plan</TableCell>
                      <TableCell>Allowed Applications</TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              <TableContainer sx={{ width: { xs: '100%', md: '50%' } }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Membership Plan Name</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {membershipPlanList?.map((role) => (
                      <TableRow key={`role_${role.id}`}>
                        <TableCell>{role.plan_name}</TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <IconButton
                              onClick={() => {
                                setMembershipPlanToEdit(role);
                                handleOpenMembershipPlan();
                              }}
                            >
                              <EditOutlined />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setDeleteMembershipPlanID(role.id);
                                handleDeleteMembershipPlanOpen();
                              }}
                            >
                              <DeleteOutlined />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {membershipPlanList?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="textSecondary">No membership plans available. Please add a new one.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="h4">WordPress Server & Membership Plan Matchings</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Below is a table that matches each WordPress server with its corresponding membership plan for easy reference. The
                membership plan name must match the plan name registered on the WordPress server. You must click the <b>UPDATE</b> button
                for the changes to be applied to all servers.
              </Typography>
              <Button variant="contained" size="large" disableElevation onClick={handleConfirmMatchingOpen}>
                Update
              </Button>
              <TableContainer sx={{ width: { xs: '100%', md: '100%' } }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <b>WordPress Server \ Membership Plan</b>
                      </TableCell>
                      {membershipPlanList?.map((plan) => (
                        <TableCell key={`plan_mapping_${plan.id}`}>{plan.plan_name}</TableCell>
                      ))}
                    </TableRow>
                    {serverList
                      ?.filter((server) => server?.type === 'wordpress')
                      ?.map((server) => (
                        <TableRow key={`server_mapping_${server.id}`}>
                          <TableCell key={`app_mapping_${server.id}`}>{server.domain}</TableCell>
                          {membershipPlanList?.map((plan) => (
                            <TableCell key={`mapping_${server.id}_${plan.id}`}>
                              <Checkbox
                                checked={matchings.some(
                                  (matching) => matching.server_name === server.domain && matching.membership_plan === plan.plan_name
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setMatchings((prev) => [...prev, { server_name: server.domain, membership_plan: plan.plan_name }]);
                                  } else {
                                    setMatchings((prev) =>
                                      prev.filter(
                                        (matching) =>
                                          !(matching.server_name === server.domain && matching.membership_plan === plan.plan_name)
                                      )
                                    );
                                  }
                                }}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allowedApps?.map((app, idx0) => (
                      <TableRow key={`allowed_app_${idx0}`}>
                        <TableCell>{app.server_name}</TableCell>
                        <TableCell>{app.membership_plan}</TableCell>
                        <TableCell>
                          <Grid container spacing={2} key={`grid_${idx0}`}>
                            {appList?.map((application, idx) => (
                              <Grid key={`allowed_app_checkbox_${idx0}_${idx}`}>
                                <FormControlLabel
                                  label={application}
                                  control={
                                    <Checkbox
                                      checked={app.allowed_apps.includes(application)}
                                      onChange={(e) => {
                                        const updatedAllowedApps = e.target.checked
                                          ? [...app.allowed_apps, application]
                                          : app.allowed_apps.filter((name) => name !== application);
                                        setAllowedApps((prev) =>
                                          prev.map((a) =>
                                            a.server_name === app.server_name && a.membership_plan === app.membership_plan
                                              ? { ...a, allowed_apps: updatedAllowedApps }
                                              : a
                                          )
                                        );
                                      }}
                                    />
                                  }
                                />
                              </Grid>
                            ))}
                          </Grid>
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
      <Modal open={openMembershipPlan} onClose={handleCloseMembershipPlan}>
        <SummaryCard title={membershipPlanToEdit ? 'Edit Membership Plan' : 'Add Membership Plan'} sx={{ width: { xs: '90%', sm: 480 } }}>
          <Formik
            enableReinitialize
            initialValues={{
              plan_name: membershipPlanToEdit?.plan_name ?? ''
            }}
            validationSchema={Yup.object().shape({
              plan_name: Yup.string()
                .max(255, 'Membership plan name length should be less than 255')
                .nullable()
                .required('Membership plan name is required')
            })}
            onSubmit={async (values, { setSubmitting }) => {
              const res = membershipPlanToEdit
                ? await updateMembershipPlan(membershipPlanToEdit?.id, values)
                : await createMembershipPlan(values);
              if (res.status) {
                successMessage(res.message);
              } else {
                errorMessage(res.message);
              }
              setSubmitting(false);
              handleCloseMembershipPlan();
            }}
          >
            {({ errors, handleSubmit, handleBlur, handleChange, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Box sx={{ width: '100%' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Typography>Membership Plan Name*</Typography>
                      <OutlinedInput
                        fullWidth
                        minRows={3}
                        name="plan_name"
                        value={values.plan_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.plan_name && errors.plan_name && (
                        <FormHelperText error id="helper-text-plan_name">
                          {errors.plan_name}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Stack direction="row" spacing={3} justifyContent="flex-end" sx={{ width: '100%' }}>
                        <Button variant="outlined" size="large" disableElevation onClick={handleCloseMembershipPlan}>
                          Cancel
                        </Button>
                        <Button variant="contained" size="large" disableElevation onClick={handleSubmit} disabled={isSubmitting}>
                          {membershipPlanToEdit ? 'Update' : 'Save'}
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
      <Modal open={openDeleteMembershipPlan} onClose={handleDeleteMembershipPlanClose}>
        <AlertCard title="Delete Membership Plan" sx={{ width: { xs: '90%', sm: '480px' } }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Typography gutterBottom>Do you really want to delete this membership plan?</Typography>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button disableElevation variant="outlined" size="large" onClick={handleDeleteMembershipPlanClose} sx={{ width: 100 }}>
                Cancel
              </Button>
              <Button
                disableElevation
                variant="contained"
                size="large"
                onClick={handleDeleteMembershipPlan}
                disabled={isMembershipPlanDeleting}
                sx={{ width: 100 }}
              >
                Yes
              </Button>
            </Stack>
          </Stack>
        </AlertCard>
      </Modal>
      <Modal open={openConfirmMatching} onClose={handleConfirmMatchingClose}>
        <AlertCard title="Update WordPress Server & Membership Plan Matchings" sx={{ width: { xs: '90%', md: '720px' } }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Typography gutterBottom>
              Do you really want to update the WordPress server & membership plan matchings?
              <br /> After updating the matching, please check the allowed application list for each wp server & membership plan.
            </Typography>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button disableElevation variant="outlined" size="large" onClick={handleConfirmMatchingClose} sx={{ width: 100 }}>
                Cancel
              </Button>
              <Button disableElevation variant="contained" size="large" onClick={handleUpdateMatchings} sx={{ width: 100 }}>
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
              <Button disableElevation variant="contained" size="large" onClick={handleUpdateAllowedApps} sx={{ width: 100 }}>
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
