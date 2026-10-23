import {gitCourse} from './git.js';
import {dockerCourse} from './docker.js';
import {pytestCourse} from './pytest.js';
import {mlflowCourse} from './mlflow.js';
export const COURSES=[gitCourse,dockerCourse,pytestCourse,mlflowCourse];
export const getCourse=id=>COURSES.find(c=>c.id===id);
