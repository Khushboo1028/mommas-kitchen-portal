import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { Button, Grid } from '@material-ui/core';

import * as ROUTES from '../../constants/routes';
import * as CONSTANTS from '../../constants/constants';
import CategoryTable from './CategoryTable';

import { withRouter } from 'react-router-dom';

var db = FirebaseApp.firestore();

const CategoriesPage = (props) => {
	const [ isLoading, setLoading ] = useState(true);

	useEffect(
		() => {
			getData();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[ isLoading ]
	);

	const columns = [
		{ field: 'name', title: 'Category Name', minWidth: 120, align: 'center' },
		{ field: 'image_url', title: 'Icon', minWidth: 120, align: 'center' },
		{ field: 'date_created', title: 'Date Created', minWidth: 120, align: 'center' },
		{ field: 'doc_id', title: 'Document ID', minWidth: 120, align: 'center' }
	];

	const [ rows, setRows ] = useState([]);

	function createData(name, image_url, date_created, doc_id) {
		return { name, image_url, date_created, doc_id };
	}

	const getData = () => {
		var unsubscribe = db.collection(CONSTANTS.CATEGORIES).orderBy(CONSTANTS.ADMIN_DATE_CREATED, 'desc').onSnapshot(
			(querySnapshot) => {
				handleQuery(querySnapshot);
			},
			(error) => {
				alert(error);
			}
		);

		return () => unsubscribe();
	};

	const handleQuery = (querySnapshot) => {
		setLoading(false);
		const rows1 = [];

		querySnapshot.forEach(function(doc) {
			var data = doc.data();
			var name = checkForNullorUndefined(data.name);

			var image_url = checkForNullorUndefined(data.image_url);
			var date_created = checkForNullorUndefined(data.date_created);
			var doc_id = doc.id;

			if (date_created !== '') {
				var dc_date = doc.data().date_created.toDate().toLocaleDateString('en-IN');
			}
			rows1.push(createData(name, image_url, dc_date, doc_id));
		});
		setRows(rows1);
	};

	const checkForNullorUndefined = (value) => {
		if (value !== undefined && value !== null) {
			return value;
		} else {
			return '';
		}
	};

	return (
		<NavigationDrawer>
			<Button
				variant="contained"
				color="primary"
				style={{ marginBottom: '2rem' }}
				onClick={() => props.history.push(ROUTES.CATEGORIES_ADD)}>
				Add Category
			</Button>

			<Grid item xs={12}>
				<CategoryTable columns={columns} rows={rows} />
			</Grid>
		</NavigationDrawer>
	);
};

export default CategoriesPage;
