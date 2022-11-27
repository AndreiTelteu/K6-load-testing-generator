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

export type StepHeader = {
  name: string;
  value: string;
  enabled: boolean;
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
  headers: StepHeader[];
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

const DefaultHeader: StepHeader = {
  name: '',
  value: '',
  enabled: false,
};
const DefaultStep: Step = {
  name: '',
  type: StepType.PageVisit,
  loadStaticAssets: false,
  method: StepMethod.GET,
  url: '',
  headers: [DefaultHeader],
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
  actions: (state: GeneratorState, set) => ({
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
    addHeader: (index, stepIndex, header: StepHeader = null) => {
      set(
        produce((state: GeneratorState) => {
          if (!header) header = DefaultHeader;
          state.stages[index].steps[stepIndex].headers.push({
            ...DefaultHeader,
            ...header,
          });
          return state;
        }),
      );
    },
    move: (index, moveBy) => {
      set(
        produce((state: GeneratorState) => {
          const toIndex = index + moveBy;
          state.stages.splice(toIndex, 0, state.stages.splice(index, 1)[0]);
          return state;
        }),
      );
    },
    moveStep: (index, stepIndex, moveBy) => {
      set(
        produce((state: GeneratorState) => {
          const toIndex = stepIndex + moveBy;
          const steps = [...state.stages[index].steps];
          steps.splice(toIndex, 0, steps.splice(stepIndex, 1)[0]);
          state.stages[index].steps = steps;
          return state;
        }),
      );
    },
    editStep: (index, stepIndex, ...attrs) => {
      set('stages', index, 'steps', stepIndex, ...attrs);
    },
    editHeader: (index, stepIndex, headerIndex, key, value) => {
      set(
        produce((state: GeneratorState) => {
          const headers = [...state.stages[index].steps[stepIndex].headers];
          headers[headerIndex][key] = value;
          if (key == 'name' || key == 'value') {
            if (String(value).length > 0) {
              if (headerIndex == headers.length - 1) {
                // when you start writing on the last item
                headers.push(DefaultHeader);
              }
            } else {
              if (
                headerIndex == headers.length - 2 &&
                String(headers[headerIndex][key == 'name' ? 'value' : 'name'])
                  .length == 0
              ) {
                // when you erase text, remove extra header
                headers.splice(headers.length - 1, 1);
              }
            }
          }
          state.stages[index].steps[stepIndex].headers = headers;
          return state;
        }),
      );
    },
    set: (...attrs) => {
      set(...attrs);
    },
  }),
});
