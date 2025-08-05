// action - state management
import { SERVER_LIST } from './actions';

// initial state
export const initialState = {
  serverList: []
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
    default: {
      return { ...state };
    }
  }
};

export default main;
