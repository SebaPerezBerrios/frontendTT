import { useAppDispatch, useAppSelector } from '../../../appStore/hooks';
import {
  getKMeansAdvanced,
  selectKmeansAdvancedTweets,
  selectSearchWords,
  setKMeansAdvancedConfig,
  stemmers,
  vectorizers
} from '../../../appSlice/appSlice';
import * as _ from 'lodash';
import { useState } from 'react';
import { format } from 'date-fns';
import locale from 'date-fns/locale/es';

import {
  Card,
  Grid,
  CardContent,
  TextField,
  CardActions,
  Divider,
  MenuItem,
  Switch
} from '@mui/material';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { styled } from '@mui/material/styles';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { subDays } from 'date-fns/esm';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));

function TweetCardMetrics(props) {
  const tweet = props.data;
  const { metrics } = tweet;

  const [expanded, setExpanded] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandAlertClick = () => {
    setExpandedAlert(!expandedAlert);
  };

  return (
    <CardContent>
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography variant="h3">Tweet</Typography>
          <Typography paragraph>{tweet.text}</Typography>
          <Typography variant="h3">Metadatos</Typography>
          <Typography variant="subtitle2" gutterBottom noWrap>
            Fecha{' '}
            {format(new Date(tweet.created_at), 'P', {
              locale: locale
            })}
          </Typography>
          <Typography variant="subtitle2" gutterBottom noWrap>
            Usuario {tweet.user}
          </Typography>
          <Typography variant="subtitle2" gutterBottom noWrap>
            Retweets {tweet.retweet_count}
          </Typography>
          <Typography variant="subtitle2" gutterBottom noWrap>
            Seguidores {tweet.user_followers}
          </Typography>
          <Typography variant="subtitle2" gutterBottom noWrap>
            Ubicación {tweet.user_location || 'N.A.'}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="Mostrar Métricas"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="h3">Métricas</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Total de Tweets {metrics.totalTweets}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Total de Terminos de alerta {metrics.alertCount}
            </Typography>

            <Typography variant="h4" gutterBottom>
              Re Tweets
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              promedio {metrics.retweets.avg.toFixed(2)}
            </Typography>
          </CardContent>
          {tweet.sentiment !== undefined && (
            <CardContent>
              <Typography variant="h3">Analisis de Sentimientos</Typography>
              <Typography variant="h4" gutterBottom>
                Resultados totales
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Muy malo {metrics.summary[0]}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Malo {metrics.summary[1]}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Neutro {metrics.summary[2]}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Bueno {metrics.summary[3]}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Muy bueno {metrics.summary[4]}
              </Typography>
              <Typography variant="h4" gutterBottom>
                Mejores resultados
              </Typography>
              {_.map(
                metrics.best,
                ({ text, created_at, user, user_location }) => {
                  return (
                    <Typography variant="subtitle2" gutterBottom>
                      {user} ({user_location || 'N.A'}
                      {', '}
                      {format(new Date(created_at), 'P', {
                        locale: locale
                      })}
                      ): {text}
                    </Typography>
                  );
                }
              )}{' '}
              <Typography variant="h4" gutterBottom>
                Peores resultados
              </Typography>
              {_.map(
                metrics.worst,
                ({ text, created_at, user, user_location }) => {
                  return (
                    <Typography variant="subtitle2" gutterBottom>
                      {user} ({user_location || 'N.A'}
                      {', '}
                      {format(new Date(created_at), 'P', {
                        locale: locale
                      })}
                      ): {text}
                    </Typography>
                  );
                }
              )}{' '}
            </CardContent>
          )}
          {metrics.alertCount !== 0 && (
            <CardActions disableSpacing>
              <ExpandMore
                expand={expandedAlert}
                onClick={handleExpandAlertClick}
                aria-expanded={expandedAlert}
                aria-label="Mostrar Tweets de alerta"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
          )}
          <Collapse in={expandedAlert} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography variant="h3">Tweets de alerta</Typography>
              {_.map(
                metrics.alertTweets,
                ({ text, user, created_at, user_location }) => {
                  return (
                    <Typography variant="subtitle2" gutterBottom>
                      {user} ({user_location || 'N.A'}
                      {', '}
                      {format(new Date(created_at), 'P', {
                        locale: locale
                      })}
                      ): {text}
                    </Typography>
                  );
                }
              )}
            </CardContent>
          </Collapse>
        </Collapse>
      </Card>
    </CardContent>
  );
}

function KMeans() {
  const kMeansTweets = useAppSelector(selectKmeansAdvancedTweets);
  const dispatch = useAppDispatch();
  const searchWords = useAppSelector(selectSearchWords);
  const [kMeansGroups, setKmeansGroups] = useState(5);
  const [vector, setVector] = useState('TFIDF');
  const [stemmer, setStemmer] = useState('porter');
  const [sentimentAnalysis, setSentimentAnalysis] = useState(false);
  const [dateStart, setDateStart] = useState(subDays(new Date(), 7));
  const [dateEnd, setDateEnd] = useState(new Date());
  const [reTweets, setReTweets] = useState(20);
  const [followers, setFollowers] = useState(50);

  const available = _.size(searchWords) !== 0;

  return (
    <>
      <CardContent sx={{ p: 1 }}>
        <Grid container spacing={9}>
          <Grid item>
            <Box sx={{ minWidth: 200, minHeight: 100 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={() => {
                  dispatch(
                    setKMeansAdvancedConfig({
                      stemmer,
                      vector,
                      sentimentAnalysis,
                      created_at: [dateStart.getTime(), dateEnd.getTime()],
                      reTweetCount: reTweets,
                      userFollowers: followers
                    })
                  );
                  dispatch(getKMeansAdvanced(kMeansGroups));
                }}
                disabled={!available}
              >
                {available
                  ? 'Obtener nueva muestra de Tweets'
                  : 'Se requiere ingresar términos de búsqueda'}
              </Button>
            </Box>
          </Grid>
          <Grid item>
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
          </Grid>
          <Grid item>
            <TextField
              label="Fecha inicio"
              size="small"
              type="date"
              variant="outlined"
              defaultValue={format(dateStart, 'yyyy-MM-dd')}
              onChange={(event: any) => {
                setDateStart(new Date(event?.target?.value));
              }}
            ></TextField>
          </Grid>
          <Grid item>
            <TextField
              label="Fecha termino"
              size="small"
              type="date"
              variant="outlined"
              defaultValue={format(dateEnd, 'yyyy-MM-dd')}
              onChange={(event: any) => {
                setDateEnd(new Date(event?.target?.value));
              }}
            ></TextField>
          </Grid>
          <Grid item>
            <TextField
              label="Re Tweets mínimos"
              size="small"
              type="number"
              variant="outlined"
              defaultValue={reTweets}
              onChange={(event: any) => {
                setReTweets(Number(event?.target?.value));
              }}
            ></TextField>
          </Grid>
          <Grid item>
            <TextField
              label="Seguidores de usuario"
              size="small"
              type="number"
              variant="outlined"
              defaultValue={followers}
              onChange={(event: any) => {
                setFollowers(Number(event?.target?.value));
              }}
            ></TextField>
          </Grid>
          <Grid item>
            <TextField
              id="stemmer"
              select
              label="Stemmer"
              value={stemmer}
              onChange={(e) => {
                setStemmer(e.target.value);
              }}
            >
              {_.map(stemmers, (stemmer, index) => (
                <MenuItem key={index} value={stemmer.type}>
                  {stemmer.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              id="vector"
              select
              label="Vector"
              value={vector}
              onChange={(e) => {
                setVector(e.target.value);
              }}
            >
              {_.map(vectorizers, (vectorizer, index) => (
                <MenuItem key={index} value={vectorizer.type}>
                  {vectorizer.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Grid container wrap="nowrap" spacing={3}>
          <Grid item>
            <Switch
              checked={sentimentAnalysis}
              onChange={(e) => {
                setSentimentAnalysis(e.target.checked);
              }}
              name="Procesamiento incluye analisis de sentimientos"
            ></Switch>
          </Grid>
          <Grid item>
            <Typography paragraph>
              Obtener métricas de analisis de sentimientos, precaución, este
              proceso ralentiza en grán medida el rendimiento
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {_.map(
            _.reverse(
              _.sortBy(kMeansTweets, [
                (tweet) => tweet.metrics.alertCount,
                (tweet) => tweet.retweet_count
              ])
            ),
            (tweet, index) => {
              return <TweetCardMetrics data={tweet} key={index.toString()} />;
            }
          )}
        </Grid>
      </CardContent>
    </>
  );
}

export default KMeans;
