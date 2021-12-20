import { FC, ChangeEvent, useState } from 'react';

import * as _ from 'lodash';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  CardContent
} from '@mui/material';

interface WordListTableProps {
  className?: string;
  wordList: any[];
  key: string;
}

const applyPagination = (
  wordList: any[],
  page: number,
  limit: number
): any[] => {
  return wordList.slice(page * limit, page * limit + limit);
};

const WordListTable: FC<WordListTableProps> = ({ wordList }) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedWordList = applyPagination(wordList, page, limit);

  return (
    <CardContent>
      <Card sx={{ minWidth: 800 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Término</TableCell>
                <TableCell>Frecuencia</TableCell>
                <TableCell>Frecuencia Acumulada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.map(paginatedWordList, (wordListItem, index) => {
                return (
                  <TableRow hover key={index}>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {wordListItem[0]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {wordListItem[1]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {wordListItem[2]}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box p={2}>
          <TablePagination
            component="div"
            count={wordList.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 30, 50]}
            labelRowsPerPage={'Filas por página'}
          />
        </Box>
      </Card>
    </CardContent>
  );
};

export default WordListTable;
