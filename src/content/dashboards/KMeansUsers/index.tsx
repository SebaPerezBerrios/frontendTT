import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import KMeansUsers from './KMeansUsers';

function DashboardKMeansUsers() {
  return (
    <>
      <Helmet>
        <title>Tweets de usuarios representativos</title>
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
            <KMeansUsers />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardKMeansUsers;
