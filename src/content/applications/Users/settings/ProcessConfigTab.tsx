import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  TextField,
  MenuItem
} from '@mui/material';

import { useAppDispatch, useAppSelector } from 'src/appStore/hooks';
import {
  selectKmeansConfig,
  selectWordListConfig,
  setKMeansConfig,
  setWordListConfig,
  stemmers,
  vectorizers
} from 'src/appSlice/appSlice';
import _ from 'lodash';

function ProcessConfigTab() {
  const dispatch = useAppDispatch();
  const kMeansConfig = useAppSelector(selectKmeansConfig);
  const wordListConfig = useAppSelector(selectWordListConfig);

  return (
    <Grid container spacing={3}>
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
                Configuración de procesamiento de Tweets
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2">
              <Grid container wrap="nowrap" spacing={3}>
                <Grid item>
                  <Box sx={{ minWidth: 200, minHeight: 100 }}>
                    <TextField
                      id="stemmer"
                      select
                      label="Stemmer"
                      value={useAppSelector(selectKmeansConfig).stemmer}
                      onChange={(e) => {
                        const config = {
                          ...kMeansConfig,
                          stemmer: e.target.value
                        };
                        dispatch(setKMeansConfig(config));
                      }}
                      helperText="Seleccionar enraizador (stemmer)"
                    >
                      {_.map(stemmers, (stemmer, index) => (
                        <MenuItem key={index} value={stemmer.type}>
                          {stemmer.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <Grid item>
                  <Typography paragraph>
                    Enraizador (Stemmer) es una técnica que permite normalizar
                    palabras a su forma raíz, de forma que se eliminan, por
                    ejemplo, conjugaciónes. Porter utiliza reglas gramaticales
                    para encontrar la raíz a una palabra, Lematizador utiliza la
                    palabra y su contexto para obtener su forma raíz. La ventaja
                    de uno u otro método para el lenguaje español no esta
                    establecida.
                  </Typography>
                </Grid>
              </Grid>
              <Grid container wrap="nowrap" spacing={3}>
                <Grid item>
                  <Box sx={{ minWidth: 200, minHeight: 100 }}>
                    <TextField
                      id="vectorizer"
                      select
                      label="Vectorizador"
                      value={useAppSelector(selectKmeansConfig).vector}
                      onChange={(e) => {
                        const config = {
                          ...kMeansConfig,
                          vector: e.target.value
                        };
                        dispatch(setKMeansConfig(config));
                      }}
                      helperText="Seleccionar vectorizador"
                    >
                      {_.map(vectorizers, (vectorizer, index) => (
                        <MenuItem key={index} value={vectorizer.type}>
                          {vectorizer.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <Grid item>
                  <Typography paragraph>
                    Vectorizador a utilizar, es el algoritmo que permite
                    transformar un listado de textos es una matriz numérica para
                    ser procesada eficientemente, TFIDF entrega mejor
                    rendimiento pero Word 2 Vector (desarrollada por Google)
                    entrega mejores resultados a costa de rendimiento.
                  </Typography>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
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
                Configuración de listado de términos frecuentes
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ p: 1 }}>
            <Typography variant="subtitle2">
              <Grid container wrap="nowrap" spacing={3}>
                <Grid item>
                  <Box sx={{ minWidth: 200, minHeight: 100 }}>
                    <TextField
                      id="wordListSize"
                      label="Cantidad de términos"
                      value={useAppSelector(selectWordListConfig).total}
                      onChange={(e) => {
                        const config = {
                          ...wordListConfig,
                          total: e.target.value
                        };
                        dispatch(setWordListConfig(config));
                      }}
                      helperText="Seleccionar cantidad de términos"
                    ></TextField>
                  </Box>
                </Grid>
                <Grid item>
                  <Typography paragraph>
                    Seleccionar la cantidad de términos a mostrar en listados y
                    gráficos sobre frecuencia de palábras.
                  </Typography>
                </Grid>
              </Grid>
              <Grid container wrap="nowrap" spacing={3}>
                <Grid item>
                  <Box sx={{ minWidth: 200 }}>
                    <TextField
                      id="wordListNgram"
                      label="N-Gramas"
                      value={useAppSelector(selectWordListConfig).ngram}
                      onChange={(e) => {
                        const config = {
                          ...wordListConfig,
                          ngram: e.target.value
                        };
                        dispatch(setWordListConfig(config));
                      }}
                      helperText="Seleccionar tamaño de N-Grama"
                    ></TextField>
                  </Box>
                </Grid>
                <Grid item>
                  <Typography paragraph>
                    Seleccionar cantidad de terminos combinados que se
                    consideran una sola entidad, por ejemplo un N-Grama de 2 se
                    refiere a considerar términos de hasta dos palabras como uno
                    solo.
                  </Typography>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ProcessConfigTab;
