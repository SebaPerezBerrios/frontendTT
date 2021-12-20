import { useAppDispatch, useAppSelector } from '../../../appStore/hooks';
import {
  getKMeansUsers,
  selectKmeansUsersTweets,
  selectSearchWords
} from '../../../appSlice/appSlice';
import * as _ from 'lodash';
import { useState } from 'react';
import { format } from 'date-fns';
import locale from 'date-fns/locale/es';

import { Card, Grid, CardContent, TextField, CardActions } from '@mui/material';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { styled } from '@mui/material/styles';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

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

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
            <Typography variant="h3">Métricas de grupo</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Total de Tweets {metrics.totalTweets}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Re Tweets
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              promedio {metrics.retweets.avg.toFixed(2)}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Seguidores
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              promedio {metrics.users.avg.toFixed(2)}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </CardContent>
  );
}

function KMeansUsers() {
  const kMeansUsersTweets = useAppSelector(selectKmeansUsersTweets);
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
          onClick={() => dispatch(getKMeansUsers(kMeansGroups))}
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
        {_.map(
          _.reverse(
            _.sortBy(kMeansUsersTweets, [
              (tweet) => tweet.metrics.alertCount,
              (tweet) => tweet.retweet_count
            ])
          ),
          (tweet, index) => {
            return <TweetCardMetrics data={tweet} key={index.toString()} />;
          }
        )}
      </Grid>
    </>
  );
}

export default KMeansUsers;
