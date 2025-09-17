import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import { SERVER_LIST } from 'reducers/actions';
import MainReducer, { initialState } from 'reducers/main';
import useAuth from 'hooks/useAuth';

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MainReducer, initialState);

  const { axiosServices } = useAuth();

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

  return (
    <MainContext.Provider
      value={{
        ...state,
        getServerList,
        createServer,
        updateServer,
        deleteServer
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
