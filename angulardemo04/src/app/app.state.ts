import { Tutorial,TutorialInfo } from './models/tutorial.model' 

export interface AppState {
    readonly tutorial: Tutorial[];
    readonly tutorialInfo: TutorialInfo[];
}