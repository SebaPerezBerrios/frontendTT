import {
  Box,
  Typography,
  Card,
  Divider,
  Button,
  CardContent,
  Grid,
  TextField
} from '@mui/material';

import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import { useState } from 'react';
import * as _ from 'lodash';
import { RemoveDoneTwoTone } from '@mui/icons-material';
import {
  recreateData,
  selectAlertWords,
  selectSearchWords,
  selectTotalPool,
  setAlertWords,
  setConfig,
  setSearchWords,
  setTotalPool
} from 'src/appSlice/appSlice';
import { useAppDispatch, useAppSelector } from 'src/appStore/hooks';

function WordInput(props) {
  const { word, index, handle } = props;

  return (
    <Box textAlign="center">
      <TextField
        defaultValue={word}
        onChange={(e) => handle(e.target.value, index)}
      ></TextField>
    </Box>
  );
}

function NumberInput(props) {
  const { value, handle } = props;

  return (
    <Box textAlign="center">
      <TextField
        type="number"
        defaultValue={value}
        onChange={(e) => handle(Number(e.target.value))}
      ></TextField>
    </Box>
  );
}

function AddButton(props) {
  const { handleChange, text, iconState } = props;
  return (
    <Box textAlign="center">
      <Button
        startIcon={iconState ? <DoneTwoToneIcon /> : <RemoveDoneTwoTone />}
        onClick={() => handleChange()}
      >
        {text}
      </Button>
    </Box>
  );
}

function SearchWordsTab() {
  const [searchWordsState, setSearchWordsState] = useState([
    ...useAppSelector(selectSearchWords)
  ]);

  const dispatch = useAppDispatch();

  const handle = (word, index) => {
    searchWordsState[index] = word;
    setSearchWordsState(searchWordsState);
  };

  return (
    <Grid item xs={12}>
      <Card>
        <Box
          p={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Terminos de búsqueda para Twitter
            </Typography>
          </Box>
          <Button
            startIcon={<DoneTwoToneIcon />}
            onClick={() => {
              dispatch(
                setSearchWords(
                  _.filter(searchWordsState, (word) => !_.isEmpty(word))
                )
              );
              dispatch(setConfig());
              dispatch(recreateData());
            }}
          >
            OK
          </Button>
        </Box>
        <Divider />

        <CardContent sx={{ p: 4 }}>
          <Typography variant="subtitle2">
            <Grid>
              {_.map(searchWordsState, (word, index) => {
                return (
                  <WordInput
                    word={word}
                    key={index.toString()}
                    index={index}
                    handle={handle}
                  />
                );
              })}
              <AddButton
                text={'Agregar Término'}
                iconState={true}
                handleChange={() => {
                  setSearchWordsState(_.concat(searchWordsState, ''));
                }}
              />
              <AddButton
                text={'Eliminar Término'}
                iconState={false}
                handleChange={() => {
                  setSearchWordsState(_.initial(searchWordsState));
                }}
              />
            </Grid>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function AlertWordsTab() {
  const [alertWordsState, setAlertWordsState] = useState([
    ...useAppSelector(selectAlertWords)
  ]);

  const dispatch = useAppDispatch();

  const handle = (word, index) => {
    alertWordsState[index] = word;
    setAlertWordsState(alertWordsState);
  };

  return (
    <Grid item xs={12}>
      <Card>
        <Box
          p={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Terminos de alerta para Twitter
            </Typography>
          </Box>
          <Button
            startIcon={<DoneTwoToneIcon />}
            onClick={() => {
              dispatch(
                setAlertWords(
                  _.filter(alertWordsState, (word) => !_.isEmpty(word))
                )
              );
              dispatch(setConfig());
            }}
          >
            OK
          </Button>
        </Box>
        <Divider />
        <CardContent sx={{ p: 4 }}>
          <Typography variant="subtitle2">
            <Grid>
              {_.map(alertWordsState, (word, index) => {
                return (
                  <WordInput
                    word={word}
                    key={index.toString()}
                    index={index}
                    handle={handle}
                  />
                );
              })}
              <AddButton
                text={'Agregar Término'}
                iconState={true}
                handleChange={() => {
                  setAlertWordsState(_.concat(alertWordsState, ''));
                }}
              />
              <AddButton
                text={'Eliminar Término'}
                iconState={false}
                handleChange={() => {
                  setAlertWordsState(_.initial(alertWordsState));
                }}
              />
            </Grid>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function TweetPoolTab() {
  const [totalPoolState, setTotalPoolState] = useState(
    useAppSelector(selectTotalPool)
  );

  const dispatch = useAppDispatch();

  const handle = (value: number) => {
    setTotalPoolState(value);
  };
  return (
    <Grid item xs={12}>
      <Card>
        <Box
          p={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Cantidad de Tweets por petición
            </Typography>
          </Box>
          <Button
            startIcon={<DoneTwoToneIcon />}
            onClick={() => {
              dispatch(setTotalPool(totalPoolState));
              dispatch(setConfig());
            }}
          >
            OK
          </Button>
        </Box>
        <Divider />
        <CardContent sx={{ p: 4 }}>
          <Typography variant="subtitle2">
            <Grid>
              <NumberInput value={totalPoolState} handle={handle}></NumberInput>
            </Grid>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function ConfigTextTab() {
  return (
    <Grid container spacing={3}>
      <SearchWordsTab></SearchWordsTab>
      <AlertWordsTab></AlertWordsTab>
      <TweetPoolTab></TweetPoolTab>
    </Grid>
  );
}

export default ConfigTextTab;
