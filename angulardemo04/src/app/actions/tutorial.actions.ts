import { Action } from '@ngrx/store' 
import { Tutorial, TutorialInfo } from '../models/tutorial.model'

export const ADD_TUTORIAL = '[TUTORIAL] Add'
export const REMOVE_TUTORIAL = '[TUTORIAL] Remove'
export const MODIFY_TUTORIAL = '[TUTORIAL] Modify'

export class AddTutorial implements Action {
    readonly type = ADD_TUTORIAL

    constructor(public payload: Tutorial) { }
}

export class RemoveTutorial implements Action {
    readonly type = REMOVE_TUTORIAL

    constructor(public payload: number) { }
}

export class ModifyTutorial implements Action {
    readonly type = MODIFY_TUTORIAL
    constructor(public payload: TutorialInfo){ }
}

export type Actions = AddTutorial | RemoveTutorial | ModifyTutorial