import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader } from '@mui/material';

// ==============================|| CUSTOM - MAIN CARD ||============================== //

const AlertCard = forwardRef(({ children, title = '', secondary, sx = {}, ...others }, ref) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      ref={ref}
      {...others}
      sx={{
        border: 'none',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: `calc( 100% - 50px)`, sm: 'auto' },
        '& .MuiCardContent-root': {
          overflowY: 'auto',
          minHeight: 'auto',
          maxHeight: `calc(100vh - 200px)`
        },
        backgroundColor: theme.palette.common.white,
        ...sx
      }}
    >
      <CardHeader
        sx={{
          px: 3,
          py: 2,
          backgroundColor: theme.palette.error.main,
          color: theme.palette.primary.contrastText
        }}
        title={`WARNING: ${title}`}
        titleTypographyProps={{ variant: 'h6', color: 'inherit' }}
        action={secondary}
      />
      <CardContent sx={{ p: 3, textAlign: 'center' }}>{children}</CardContent>
    </Card>
  );
});

AlertCard.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

export default AlertCard;
