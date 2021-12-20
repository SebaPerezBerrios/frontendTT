import { Box, List, ListItem, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  selectAlertWords,
  selectSearchWords,
  selectTweetSize
} from 'src/appSlice/appSlice';
import * as _ from 'lodash';
import { useAppSelector } from 'src/appStore/hooks';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

function Status() {
  const tweetSize = useAppSelector(selectTweetSize);
  const searchWords = useAppSelector(selectSearchWords);
  const alertWords = useAppSelector(selectAlertWords);

  return (
    <ListWrapper>
      <List disablePadding component={Box} display="flex">
        <ListItem
          classes={{ root: 'MuiListItem-indicators' }}
          button
          component={NavLink}
          to="/settings/app"
        >
          <ListItemText
            primaryTypographyProps={{ noWrap: true }}
            primary="Términos de Búsqueda"
            secondary={_.join(searchWords, ' ')}
          />
        </ListItem>
        <ListItem
          classes={{ root: 'MuiListItem-indicators' }}
          button
          component={NavLink}
          to="/settings/app"
        >
          <ListItemText
            primaryTypographyProps={{ noWrap: true }}
            primary="Términos de Alerta"
            secondary={_.join(alertWords, ' ')}
          />
        </ListItem>
        <ListItem
          classes={{ root: 'MuiListItem-indicators' }}
          button
          component={NavLink}
          to="/settings/app"
        >
          <ListItemText
            primaryTypographyProps={{ noWrap: true }}
            primary="Total de Tweets"
            secondary={tweetSize ? tweetSize.prevTotal.toString() : ''}
          />
        </ListItem>
        <ListItem
          classes={{ root: 'MuiListItem-indicators' }}
          button
          component={NavLink}
          to="/settings/app"
        >
          <ListItemText
            primaryTypographyProps={{ noWrap: true }}
            primary="Total de Tweets nuevos"
            secondary={tweetSize ? tweetSize.new.toString() : ''}
          />
        </ListItem>
      </List>
    </ListWrapper>
  );
}

export default Status;
