import { createStore, combineReducers } from 'redux';
import { Campsites } from './campsites';
import { Partners } from './partners';
import { Promotions } from './promotions';
import { Comments } from './comments';

export const configureStore = () => {
    const store = createStore(
        combineReducers({
            campsites: Campsites,
            comments: Comments,
            partners: Partners,
            promotions: Promotions
        })
    );

    return store;
}