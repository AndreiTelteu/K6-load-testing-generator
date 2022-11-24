import { produce } from 'solid-js/store';
import { defineStore } from 'solidjs-storex';

export enum StepType {
  PageVisit = 'visit',
  AJAX = 'ajax',
}
export enum StepMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'del',
  HEAD = 'head',
  OPTIONS = 'options',
}

export type StepHeaders = {
  [key: string]: string;
};
export type StepQuery = {
  [key: string]: string;
};
export enum StepBodyType {
  JSON = 'json',
  FormData = 'formdata',
}
export type StepBody =
  | string
  | {
      [key: string]: string;
    };

export interface Step {
  name: string;
  type: StepType;
  loadStaticAssets: boolean;
  method: StepMethod;
  url: string;
  headers: StepHeaders;
  query: StepQuery;
  bodyType: StepBodyType;
  body: StepBody;
}
export interface Stage {
  title: string;
  steps: Step[];
}

export type Stages = Stage[];

export interface GeneratorState {
  stages: Stages;
}

const DefaultStep: Step = {
  name: '',
  type: StepType.PageVisit,
  loadStaticAssets: false,
  method: StepMethod.GET,
  url: '',
  headers: {},
  query: {},
  bodyType: StepBodyType.JSON,
  body: '',
};
const DefaultStage: Stage = {
  title: '',
  steps: [DefaultStep],
};

export default defineStore({
  state: {
    stages: [],
  } as GeneratorState,
  options: {
    persistent: true,
    storageKey: 'solid-k6-load-generator',
  },
  actions: (state, set) => ({
    add: (item = null) => {
      set(
        produce((state: GeneratorState) => {
          if (!item) item = DefaultStage;
          state.stages.push({
            ...DefaultStage,
            ...item,
          });
          return state;
        }),
      );
    },
    remove: (index) => {
      set(
        produce((state: GeneratorState) => {
          state.stages.splice(index, 1);
          return state;
        }),
      );
    },
    removeStep: (index, stepIndex) => {
      set(
        produce((state: GeneratorState) => {
          state.stages[index].steps.splice(stepIndex, 1);
          return state;
        }),
      );
    },
    addStep: (index, step: Step = null) => {
      set(
        produce((state: GeneratorState) => {
          if (!step) step = DefaultStep;
          state.stages[index].steps.push({
            ...DefaultStep,
            ...step,
          });
          return state;
        }),
      );
    },
    set: (...attrs) => {
      set(...attrs);
    },
  }),
});
