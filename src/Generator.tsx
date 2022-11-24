import { Component, For, Show } from 'solid-js';
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  // NativeSelect,
  IconButton,
} from '@suid/material';
import DeleteIcon from '@suid/icons-material/Delete';
import ArrowUpwardIcon from '@suid/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@suid/icons-material/ArrowDownward';
import * as ST from '@suid/types';
import generatorStore, {
  Step,
  Stage,
  StepType,
  StepMethod,
} from './generatorStore';

function toLetters(num: number): string {
  var mod = num % 26,
    pow = (num / 26) | 0,
    out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
  return pow ? toLetters(pow) + out : out;
}

const Generator: Component = () => {
  const [store, actions] = generatorStore();
  const createStage = () => {
    actions.add();
  };

  return (
    <div>
      <For each={store.stages}>
        {(stage: Stage, index) => (
          <Card
            sx={{ mb: '10px', display: 'flex', flexDirection: 'row', width: 1 }}
          >
            <Box
              sx={{
                width: 80,
                borderRight: '1px solid #353535',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'top',
                paddingTop: '40px',
              }}
            >
              <Box sx={{ fontSize: 20 }}>#{index() + 1}</Box>
              <IconButton color="error" onClick={() => actions.remove(index())}>
                <DeleteIcon />
              </IconButton>
              <Show when={store.stages.length > 1}>
                <IconButton
                  onClick={() => actions.move(index(), -1)}
                  disabled={index() == 0}
                >
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                  onClick={() => actions.move(index(), 1)}
                  disabled={index() == store.stages.length - 1}
                >
                  <ArrowDownwardIcon />
                </IconButton>
              </Show>
            </Box>
            <Box sx={{ width: 1 }}>
              <CardContent sx={{}}>
                <TextField
                  label="Stage name"
                  variant="standard"
                  fullWidth
                  value={stage.title}
                  onChange={(event, value) => {
                    actions.set('stages', index(), 'title', value);
                  }}
                />
              </CardContent>
              <CardContent
                sx={{
                  borderTop: '1px solid #353535',
                }}
              >
                <For each={stage.steps}>
                  {(step: Step, stepIndex) => (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: 1,
                        padding: '10px 0',
                        borderBottom: '1px solid #353535',
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          borderRight: '1px solid #353535',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'top',
                          paddingTop: '10px',
                        }}
                      >
                        <Box sx={{ fontSize: 20 }}>
                          {toLetters(stepIndex() + 1)}
                        </Box>
                        <IconButton
                          color="error"
                          onClick={() =>
                            actions.removeStep(index(), stepIndex())
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Show when={stage.steps.length > 1}>
                          <IconButton
                            onClick={() =>
                              actions.moveStep(index(), stepIndex(), -1)
                            }
                            disabled={stepIndex() == 0}
                          >
                            <ArrowUpwardIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              actions.moveStep(index(), stepIndex(), 1)
                            }
                            disabled={stepIndex() == stage.steps.length - 1}
                          >
                            <ArrowDownwardIcon />
                          </IconButton>
                        </Show>
                      </Box>
                      <Box sx={{ width: 1, padding: '10px' }}>
                        <TextField
                          label="Step name"
                          variant="standard"
                          fullWidth
                          value={step.name}
                          onChange={(event, value) => {
                            actions.editStep(
                              index(),
                              stepIndex(),
                              'name',
                              value,
                            );
                          }}
                        />
                        <RadioGroup
                          value={step.type}
                          onChange={(
                            event: ST.ChangeEvent<HTMLInputElement>,
                          ) => {
                            actions.editStep(
                              index(),
                              stepIndex(),
                              'type',
                              event.target.value,
                            );
                          }}
                        >
                          <FormControlLabel
                            value={StepType.PageVisit}
                            control={() => <Radio />}
                            label="Page visit"
                          />
                          <FormControlLabel
                            value={StepType.AJAX}
                            control={() => <Radio />}
                            label="AJAX"
                          />
                        </RadioGroup>
                        <FormControlLabel
                          checked={step.loadStaticAssets}
                          onChange={(event, value) => {
                            actions.editStep(
                              index(),
                              stepIndex(),
                              'loadStaticAssets',
                              value,
                            );
                          }}
                          control={() => <Switch />}
                          label="Load static assets (CSS, JS, IMG)"
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '10px',
                          }}
                        >
                          <select
                            value={step.method || StepMethod.GET}
                            onChange={(
                              event: ST.ChangeEvent<HTMLSelectElement>,
                            ) => {
                              actions.editStep(
                                index(),
                                stepIndex(),
                                'method',
                                event.target.value,
                              );
                            }}
                          >
                            <For each={Object.entries(StepMethod)}>
                              {([label, value]) => (
                                <option value={value}>{label}</option>
                              )}
                            </For>
                          </select>
                          <TextField
                            label="URL"
                            variant="standard"
                            fullWidth
                            type="url"
                            value={step.url}
                            onChange={(event, value) => {
                              actions.editStep(
                                index(),
                                stepIndex(),
                                'url',
                                value,
                              );
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </For>
              </CardContent>
              <CardContent sx={{}}>
                <Card sx={{ display: 'flex' }}>
                  <Button
                    sx={{ width: 1 }}
                    onClick={() =>
                      actions.addStep(index(), {
                        type: 'ajax',
                      })
                    }
                  >
                    Create new Step
                  </Button>
                </Card>
              </CardContent>
            </Box>
          </Card>
        )}
      </For>
      <Card sx={{ display: 'flex' }}>
        <Button sx={{ width: 1 }} onClick={() => createStage()}>
          Create new Stage
        </Button>
      </Card>
    </div>
  );
};
export default Generator;
