// action - state management
import { SERVER_LIST, IMAGE_APP_LIST, MEMBERSHIP_PLAN_LIST, APP_LIST } from './actions';

// initial state
export const initialState = {
  serverList: [],
  imageAppList: [],
  membershipPlanList: [],
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
    case IMAGE_APP_LIST: {
      const { imageAppList } = action.payload;
      return {
        ...state,
        imageAppList
      };
    }
    case MEMBERSHIP_PLAN_LIST: {
      const { membershipPlanList } = action.payload;
      return {
        ...state,
        membershipPlanList
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
