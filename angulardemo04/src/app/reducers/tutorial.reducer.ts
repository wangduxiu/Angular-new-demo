import { Action } from '@ngrx/store'
import { Tutorial } from '../models/tutorial.model'
import * as TutorialActions from './../actions/tutorial.actions'

const initialState: Tutorial = {
    name: 'Initial Tutorial',
    url: 'https://google.com',
}

//1.Tutorial[]是页面绑定的数组
//2.action.payload是添加的数据
export function reducer(state: Tutorial[] = [initialState], action: TutorialActions.Actions) {
    switch (action.type) {
        case TutorialActions.ADD_TUTORIAL:
            console.log(state,action.payload);
            return [...state, action.payload];

        case TutorialActions.REMOVE_TUTORIAL:
            state.splice(action.payload, 1)
            return state;

        case TutorialActions.MODIFY_TUTORIAL:
            if (action.payload.name == '') {
                alert('name不能为空');
            } else if (action.payload.url == '') {
                alert('url不能为空')
            } else {
                state[action.payload.i].name = action.payload.name;
                state[action.payload.i].url = action.payload.url;
            }
            return state;
        default:
            return state;
    }
}