import {
  alpha,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Popover,
  Tooltip,
  Typography
} from '@mui/material';
import { useRef, useState } from 'react';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import NotificationImportantTwoTone from '@mui/icons-material/NotificationImportantTwoTone';
import { styled } from '@mui/material/styles';
import locale from 'date-fns/locale/es';

import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from 'src/appStore/hooks';
import { selectAlertTweets, setAlertTweets } from 'src/appSlice/appSlice';
import _ from 'lodash';

const NotificationsBadge = styled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.error.main, 0.1)};
        color: ${theme.palette.error.main};
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`
);

function HeaderNotifications() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const alertTweets = useAppSelector(selectAlertTweets);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    dispatch(setAlertTweets(_.map(alertTweets, ([tweet]) => [tweet, false])));
  };

  return (
    <>
      <Tooltip arrow title="Notifications">
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          <NotificationsBadge
            badgeContent={_.size(_.filter(alertTweets, ([, unSeen]) => unSeen))}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <NotificationsActiveTwoToneIcon />
          </NotificationsBadge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box
          sx={{ p: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">Tweets de alerta</Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {_.map(alertTweets, ([tweet, unSeen], index) => {
            return (
              <ListItem
                key={index.toString()}
                sx={{
                  p: 2,
                  minWidth: 350,
                  maxWidth: 700,
                  display: { xs: 'block', sm: 'flex' }
                }}
              >
                <Box flex="1">
                  <Box display="flex" justifyContent="space-between">
                    {unSeen && (
                      <NotificationImportantTwoTone></NotificationImportantTwoTone>
                    )}
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {tweet.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ textTransform: 'none' }}
                    >
                      Fecha{' '}
                      {format(new Date(tweet.created_at), 'P', {
                        locale: locale
                      })}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ textTransform: 'none' }}
                    >
                      Usuario {tweet.user}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ textTransform: 'none' }}
                    >
                      Ubicación {tweet.user_location || 'N.A.'}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Popover>
    </>
  );
}

export default HeaderNotifications;
