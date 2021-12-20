import { Grid, TextField, Button } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Box from '@mui/material/Box';

import {
  getWordList,
  selectSearchWords,
  selectWordList
} from 'src/appSlice/appSlice';
import { useAppDispatch, useAppSelector } from 'src/appStore/hooks';
import { useState } from 'react';
import _ from 'lodash';
import WordListTable from './WordListTable';

function WordList() {
  const kMeansWordList = useAppSelector(selectWordList);
  const dispatch = useAppDispatch();
  const searchWords = useAppSelector(selectSearchWords);
  const [kMeansGroups, setKmeansGroups] = useState(5);

  const available = _.size(searchWords) !== 0;

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 3 }}
      >
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={() => dispatch(getWordList(kMeansGroups))}
          disabled={!available}
        >
          {available
            ? 'Obtener nueva muestra de Tweets'
            : 'Se requiere ingresar términos de búsqueda'}
        </Button>
        <TextField
          label="Grupos seleccionados"
          size="small"
          type="number"
          variant="outlined"
          defaultValue={kMeansGroups}
          onChange={(event: any) => {
            setKmeansGroups(Number(event?.target?.value));
          }}
        ></TextField>
      </Box>
      <Grid container spacing={3}>
        {_.map(_.entries(kMeansWordList), ([cluster, wordListCluster]) => (
          <WordListTable wordList={wordListCluster as []} key={cluster} />
        ))}
      </Grid>
    </>
  );
}

export default WordList;
