import { Typography, Avatar, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function PageHeader() {
  const headerData = {
    info: 'Términos relevantes de agupación de muestra',
    image: '/static/images/logo/twitter.png'
  };
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{ mr: 2, width: theme.spacing(8), height: theme.spacing(8) }}
          variant="rounded"
          alt={headerData.info}
          src={headerData.image}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {headerData.info}
        </Typography>
        <Typography variant="subtitle2">
          Seleccionar número de grupos de Tweets (Algoritmo KMeans)
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
