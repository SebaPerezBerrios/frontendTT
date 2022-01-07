import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import Advanced from './Advanced';

function DashboardKMeans() {
  return (
    <>
      <Helmet>
        <title>Búsqueda Avanzada</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item lg={8} xs={12}>
            <Advanced />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

//   <Grid item xs={12}>
//     <WatchList />
//   </Grid>

export default DashboardKMeans;
