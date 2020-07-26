import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CategoryIcon from '@material-ui/icons/Category';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FirebaseApp from '../Firebase/base';

import Button from '@material-ui/core/Button';

import { withRouter, Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { Grid } from '@material-ui/core';

import './index.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root         : {
		display : 'flex'
	},
	appBar       : {
		transition : theme.transitions.create([ 'margin', 'width' ], {
			easing   : theme.transitions.easing.sharp,
			duration : theme.transitions.duration.leavingScreen
		})
	},
	appBarShift  : {
		width      : `calc(100% - ${drawerWidth}px)`,
		marginLeft : drawerWidth,
		transition : theme.transitions.create([ 'margin', 'width' ], {
			easing   : theme.transitions.easing.easeOut,
			duration : theme.transitions.duration.enteringScreen
		})
	},
	menuButton   : {
		marginRight : theme.spacing(2)
	},
	hide         : {
		display : 'none'
	},
	drawer       : {
		width      : drawerWidth,
		flexShrink : 0
	},
	drawerPaper  : {
		width : drawerWidth
	},
	drawerHeader : {
		display        : 'flex',
		alignItems     : 'center',
		padding        : theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent : 'flex-end'
	},
	content      : {
		flexGrow   : 1,
		padding    : theme.spacing(3),
		transition : theme.transitions.create('margin', {
			easing   : theme.transitions.easing.sharp,
			duration : theme.transitions.duration.leavingScreen
		}),
		marginLeft : -drawerWidth
	},
	contentShift : {
		transition : theme.transitions.create('margin', {
			easing   : theme.transitions.easing.easeOut,
			duration : theme.transitions.duration.enteringScreen
		}),
		marginLeft : 0
	}
}));

const NavigationDrawer = (props) => {
	const { children } = props;
	const classes = useStyles();
	const theme = useTheme();
	const [ open, setOpen ] = React.useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const setTitle = () => {
		if (props.location.pathname === ROUTES.RECIPES) {
			return 'Recipes';
		} else if (props.location.pathname === ROUTES.CATEGORIES) {
			return 'Categories';
		} else {
			return 'Recipes';
		}

		// console.log(props.location.pathname.substring(0, 11));
	};

	const checkSelected = () => {
		if (props.location.pathname === ROUTES.RECIPES) {
			return [ true, false ];
		} else if (props.location.pathname === ROUTES.CATEGORIES) {
			return [ false, true ];
		} else {
			return [ true, false ];
		}
	};

	const goToPage = (index) => {
		if (index === 0) {
			return ROUTES.RECIPES;
		} else if (index === 1) {
			return ROUTES.CATEGORIES;
		}
	};

	const iconsDrawer = (index) => {
		if (index === 0) {
			return <FastfoodIcon />;
		} else if (index === 1) {
			return <CategoryIcon />;
		}
	};

	return (
		<div className={classes.root}>
			<CssBaseline />

			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open
				})}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, open && classes.hide)}>
						<MenuIcon />
					</IconButton>
					<Grid container justify="flex-start">
						<Typography variant="h6">{setTitle()}</Typography>
					</Grid>
					<Grid container justify="flex-end">
						<Button
							color="inherit"
							component={Link}
							className="appbar-link"
							onClick={() => FirebaseApp.auth().signOut()}>
							Logout
						</Button>
					</Grid>
				</Toolbar>
			</AppBar>

			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={open}
				classes={{
					paper : classes.drawerPaper
				}}>
				<div className={classes.drawerHeader}>
					<h5 style={{ paddingTop: '7px' }}>Momma's Kitchen</h5>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</div>
				<Divider />
				<List>
					{[ 'Recipes', 'Categories' ].map((text, index) => (
						<ListItem
							button
							key={text}
							selected={checkSelected()[index]}
							to={goToPage(index)}
							component={Link}>
							<ListItemIcon>{iconsDrawer(index)}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
			</Drawer>

			<main
				className={clsx(classes.content, {
					[classes.contentShift]: open
				})}>
				<div className={classes.drawerHeader} />
				{children}
			</main>
		</div>
	);
};

export default withRouter(NavigationDrawer);
