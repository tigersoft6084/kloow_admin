import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import { SERVER_LIST, IMAGE_APP_LIST, APP_LIST, WP_MEMBERSHIP_LIST } from 'reducers/actions';
import MainReducer, { initialState } from 'reducers/main';
import useAuth from 'hooks/useAuth';

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MainReducer, initialState);

  const { axiosServices } = useAuth();

  const updatePassword = async (passwordData) => {
    try {
      const response = await axiosServices.post('/update_password', passwordData, { withCredentials: true });
      return { status: true, message: 'Password updated successfully. Please log in again.' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message };
    }
  };

  const getServerList = async () => {
    try {
      const response = await axiosServices.get('/servers', { withCredentials: true });
      dispatch({
        type: SERVER_LIST,
        payload: { serverList: response.data.servers }
      });
      return { status: true, message: '' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message || 'Failed to fetch server list' };
    }
  };

  const getWordpressServerList = async () => {
    try {
      const response = await axiosServices.get('/wordpress_memberships', { withCredentials: true });
      dispatch({
        type: WP_MEMBERSHIP_LIST,
        payload: { wpMembershipList: response.data.wordpress_memberships }
      });
      return { status: true, message: '' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message || 'Failed to fetch server list' };
    }
  };

  const createServer = async (serverData) => {
    try {
      const response = await axiosServices.post('/servers', serverData, { withCredentials: true });
      // Refresh the server list after creation
      dispatch({
        type: SERVER_LIST,
        payload: { serverList: response.data.servers }
      });
      return { status: true, message: response.data.message || 'Server added successfully' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message };
    }
  };

  const updateServer = async (id, serverData) => {
    try {
      const response = await axiosServices.put(`/servers/${id}`, serverData, { withCredentials: true });
      // Refresh the server list after update
      dispatch({
        type: SERVER_LIST,
        payload: { serverList: response.data.servers }
      });
      return { status: true, message: response.data.message || 'Server updated successfully' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message };
    }
  };

  const deleteServer = async (id) => {
    try {
      const response = await axiosServices.delete(`/servers/${id}`, { withCredentials: true });
      // Refresh the server list after deletion
      dispatch({
        type: SERVER_LIST,
        payload: { serverList: response.data.servers }
      });
      return { status: true, message: response.data.message || 'Server deleted successfully' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message };
    }
  };

  const uploadImages = async (applicationName, thumbImage, logoImage) => {
    try {
      const formData = new FormData();
      formData.append('applicationName', applicationName);
      formData.append('thumbImage', thumbImage);
      formData.append('logoImage', logoImage);

      const response = await axiosServices.post('/upload_images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      dispatch({
        type: IMAGE_APP_LIST,
        payload: { imageAppList: response.data.images }
      });
      return {
        status: true,
        message: response.data.message || 'Images uploaded successfully'
      };
    } catch (error) {
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Image upload failed'
      };
    }
  };

  const getAppListForImages = async () => {
    try {
      const response = await axiosServices.get('/images', { withCredentials: true });
      dispatch({
        type: IMAGE_APP_LIST,
        payload: { imageAppList: response.data.images }
      });
      return { status: true, message: '' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message || 'Failed to fetch server list' };
    }
  };

  const deleteAppForImages = async (id) => {
    try {
      const response = await axiosServices.delete(`/images/${id}`, { withCredentials: true });
      // Refresh the app list after deletion
      dispatch({
        type: IMAGE_APP_LIST,
        payload: { imageAppList: response.data.images }
      });
      return { status: true, message: response.data.message || 'Application deleted successfully' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message };
    }
  };

  const getAppList = async () => {
    try {
      const response = await axiosServices.get('/app_list', { withCredentials: true });
      dispatch({
        type: APP_LIST,
        payload: { appList: response.data.appList }
      });
      return { status: true, message: '' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message || 'Failed to fetch app list' };
    }
  };

  const getAllowedApps = async () => {
    try {
      const response = await axiosServices.get('/allowed_apps', { withCredentials: true });
      return { status: true, data: response.data.allowed_apps || [], message: '' };
    } catch (error) {
      return { status: false, data: [], message: error.response?.data?.message || error.message || 'Failed to fetch allowed apps' };
    }
  };

  const updateAllowedApps = async (allowed_apps) => {
    try {
      const response = await axiosServices.put('/allowed_apps', { allowed_apps }, { withCredentials: true });
      return {
        status: true,
        data: response.data.allowed_apps || [],
        message: response.data.message || 'Allowed apps updated successfully'
      };
    } catch (error) {
      return { status: false, data: [], message: error.response?.data?.message || error.message || 'Failed to update allowed apps' };
    }
  };

  return (
    <MainContext.Provider
      value={{
        ...state,
        updatePassword,
        getServerList,
        getWordpressServerList,
        createServer,
        updateServer,
        deleteServer,
        uploadImages,
        getAppListForImages,
        deleteAppForImages,
        getAppList,
        getAllowedApps,
        updateAllowedApps
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node
};

export default MainContext;
