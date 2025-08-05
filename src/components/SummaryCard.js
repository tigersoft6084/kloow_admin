import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader } from '@mui/material';

// ==============================|| CUSTOM - MAIN CARD ||============================== //

const SummaryCard = forwardRef(({ children, content = true, title, secondary, sx = {}, ...others }, ref) => {
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
          maxHeight: `calc(100vh - 100px)`
        },
        ...sx
      }}
    >
      {/* card header and action */}
      {title && (
        <CardHeader
          sx={{
            px: 3,
            py: 2,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}
          title={title}
          titleTypographyProps={{ variant: 'h6', color: 'inherit' }}
          action={secondary}
        />
      )}
      {content ? <CardContent sx={{ p: 3 }}>{children}</CardContent> : children}
    </Card>
  );
});

SummaryCard.propTypes = {
  children: PropTypes.node,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  content: PropTypes.bool
};

export default SummaryCard;
