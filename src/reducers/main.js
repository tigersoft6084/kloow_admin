// action - state management
import { SERVER_LIST, IMAGE_APP_LIST, APP_LIST, WP_MEMBERSHIP_LIST } from './actions';

// initial state
export const initialState = {
  serverList: [],
  wpMembershipList: [],
  imageAppList: [],
  appList: []
};

const main = (state = initialState, action) => {
  switch (action.type) {
    case SERVER_LIST: {
      const { serverList } = action.payload;
      return {
        ...state,
        serverList
      };
    }
    case WP_MEMBERSHIP_LIST: {
      const { wpMembershipList } = action.payload;
      return {
        ...state,
        wpMembershipList
      };
    }
    case IMAGE_APP_LIST: {
      const { imageAppList } = action.payload;
      return {
        ...state,
        imageAppList
      };
    }
    case APP_LIST: {
      const { appList } = action.payload;
      return {
        ...state,
        appList
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default main;
