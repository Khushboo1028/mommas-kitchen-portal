import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { Button, Grid } from '@material-ui/core';

import * as ROUTES from '../../constants/routes';
import * as CONSTANTS from '../../constants/constants';
import RecipesTable from './RecipesTable';

var db = FirebaseApp.firestore();

const RecipesPage = (props) => {
	const [ isLoading, setLoading ] = useState(true);

	useEffect(
		() => {
			console.log('In use effect');
			getData();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ isLoading ]
	);

	const columns = [
		{ field: 'name', title: 'Recipe Name' },
		{ field: 'prep_time', title: 'Prep Time' },
		{ field: 'ingredients', title: 'Ingredients' },
		{ field: 'directions', title: 'Directions' },
		{ field: 'category_id', title: 'Category ID' },
		{ field: 'doc_id', title: 'Document ID' }
	];

	const [ rows, setRows ] = useState([]);

	function createData(name, prep_time, ingredients, directions, category_id, doc_id) {
		return {
			name,
			prep_time,
			ingredients,
			directions,
			category_id,
			doc_id
		};
	}

	const getData = () => {
		var unsubscribe = db.collection(CONSTANTS.RECIPES).orderBy('date_created', 'desc').onSnapshot(
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
			var name = checkForNullorUndefined(data.recipe_name);
			var prep_time = checkForNullorUndefined(data.prep_time);
			var ingredients = checkForNullorUndefined(data.ingredients);
			var directions = checkForNullorUndefined(data.directions);
			var category_id = checkForNullorUndefined(data.category_id);
			var date_created = checkForNullorUndefined(data.date_created);
			var doc_id = doc.id;

			var ingredients_str = '';
			for (var i = 0; i < Object.keys(ingredients).length; i++) {
				if (i != 0) {
					ingredients_str = ingredients_str + ', ' + Object.keys(ingredients)[i];
				} else {
					ingredients_str = Object.keys(ingredients)[i];
				}

				var quantity = Object.values(ingredients)[0];
				console.log('Ingredient:  ' + Object.keys(ingredients)[i] + ' is ' + Object.values(ingredients)[0]);
				console.log('Units ' + Object.values(quantity)[0]);
				console.log('Qty ' + Object.values(quantity)[1]);
			}

			//console.log('Unit are ' + Object.values(Object.values(ingredients)[0])[1]);

			if (date_created !== '') {
				var dc_date = doc.data().date_created.toDate().toLocaleDateString('en-IN');
			}
			rows1.push(createData(name, prep_time, ingredients_str, directions, category_id, doc_id));
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
				onClick={() => props.history.push(ROUTES.RECIPES_ADD)}>
				Add New Recipe
			</Button>

			<Grid item xs={12}>
				<RecipesTable columns={columns} rows={rows} />
			</Grid>
		</NavigationDrawer>
	);
};

export default RecipesPage;
