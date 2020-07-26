import React, { useState, useEffect } from 'react';

import './add-recipes.css';
import { Button, InputGroup, FormControl, Form, DropdownButton, Dropdown, Container } from 'react-bootstrap';
import SingleImageSelector from './SingleImageSelector';

import * as CONSTANTS from '../../constants/constants';
import NavigationDrawer from '../Navigation';
import FirebaseApp from '../Firebase/base';

var db = FirebaseApp.firestore();
const storage = FirebaseApp.storage();
var storageRef = storage.ref();

const AddRecipe = (props) => {
	const [ isLoadingData, setisLoadingData ] = useState(false);
	const [ isLoading, setLoading ] = useState(false);
	const [ recipe_name, setRecipeName ] = useState('');
	const [ video_url, setVideoUrl ] = useState('');
	const [ category_name, setCategoryName ] = useState('Select a Category');

	const [ categoryID, setCategoryID ] = useState('');
	const [ directions, setDirections ] = useState([ '' ]);
	const [ ingredients, setIngredients ] = useState([ '' ]);
	const [ ing_quantity, setIngQuantity ] = useState([]);
	const [ ing_unit, setIngUnit ] = useState([]);
	const [ prep_time, setPrepTime ] = useState('');
	const [ portion_size, setPortionSize ] = useState('');
	const [ portion_unit, setPortionUnit ] = useState('');
	const [ recipeImage, setRecipeImage ] = useState('');
	const [ isError, setIsError ] = useState(false);
	const [ loadingCategories, setLoadingCategories ] = useState(true);
	const [ cats, setCats ] = useState([]);

	const [ ingredients_map, setIngredientsMap ] = useState({});
	const [ portion_map, setPortionMap ] = useState({});

	useEffect(
		() => {
			getData();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ loadingCategories ]
	);

	function createData(id, name) {
		return { id, name };
	}

	const getData = () => {
		setCategoryName('Loading');
		var unsubscribe = db.collection(CONSTANTS.CATEGORIES).onSnapshot(
			(querySnapshot) => {
				var rows1 = [];
				querySnapshot.forEach(function(doc) {
					var data = doc.data();
					var id = doc.id;
					var name = data.name;
					rows1.push(createData(id, name));
				});
				setLoadingCategories(false);
				setCategoryName('Select a category');
				setCats(rows1);
			},
			(error) => {
				alert(error);
			}
		);

		return () => unsubscribe();
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (recipe_name !== null && recipe_name !== undefined && recipe_name !== '') {
			if (
				category_name !== null &&
				category_name !== undefined &&
				category_name !== '' &&
				category_name !== 'Select a category' &&
				category_name !== 'Loading'
			) {
				if (prep_time !== null && prep_time !== undefined && prep_time !== '') {
					if (parseFloat(portion_size)) {
						if (portion_unit !== null && portion_unit !== undefined && portion_unit !== '') {
							portion_map['size'] = parseFloat(portion_size);
							portion_map['unit'] = portion_unit;

							if (ingredients !== null && ingredients !== undefined) {
								if (ing_quantity !== null && ing_quantity !== undefined) {
									if (ing_unit != null && ing_unit !== undefined) {
										if (ingredients.length === ing_unit.length) {
											if (ingredients.length === ing_quantity.length) {
												if (ing_quantity.length === ing_unit.length) {
													for (var i = 0; i < ingredients.length; i++) {
														if (
															ingredients[i] === '' ||
															ing_quantity[i] === '' ||
															ing_unit[i] === ''
														) {
															alert('One ore more ingredient units are missing');
														}
													}

													//all ingredients are perfect
													//Create map now

													for (var i = 0; i < ingredients.length; i++) {
														ingredients_map[ingredients[i]] = {
															qty   : parseFloat(ing_quantity[i]),
															units : ing_unit[i]
														};
													}

													console.log(ingredients_map);

													if (directions !== null && directions !== undefined) {
														for (var i = 0; i < directions.length; i++) {
															if (directions[i] === '') {
																alert(
																	'One or more direction is empty. Please remove it'
																);
															}
														}

														if (
															recipeImage !== '' &&
															recipeImage !== null &&
															recipeImage !== undefined
														) {
															//Everything is perfect. Now update
															console.log('All checks clear: Add recipe Now');
															addRecipeImage();
														} else {
															alert('Add Recipe image');
														}
													} else {
														alert('Directions cannot be empty');
													}
												} else {
													alert('One ore more ingredient units are missing');
												}
											} else {
												alert('One ore more ingredient units are missing');
											}
										} else {
											alert('One ore more ingredient units are missing');
										}
									} else {
										alert('Ingredient Units cannot be empty');
									}
								} else {
									alert('Ingredient Quantity cannot be empty');
								}
							} else {
								alert('Ingredients cannot be empty');
							}
						} else {
							alert('Portion Unit cannot be empty');
						}
					} else {
						alert('Portion Size cannot be empty');
					}
				} else {
					alert('Preperation Time cannot be empty');
				}
			} else {
				alert('Please select a category');
			}
		} else {
			alert('Recipe Name cannot be empty');
		}
	};

	const addRecipeImage = () => {
		if (typeof recipeImage === 'string' && !recipeImage.includes('blob')) {
		} else {
			setLoading(true);
			storageRef
				.child('recipes/' + guid())
				.put(recipeImage)
				.then(function(snapshot) {
					snapshot.ref
						.getDownloadURL()
						.then(function(recipeURL) {
							addRecipeData(recipeURL);
						})
						.catch((error) => {
							alert('Error Uploading Recipe Image!', error);
							props.history.goBack();
						});
				})
				.catch((error) => {
					alert('Error Uploading Image!', error);
					props.history.goBack();
				});
		}
	};

	const addRecipeData = (recipeURL) => {
		var docref = db.collection(CONSTANTS.RECIPES).doc();

		docref
			.set({
				category_id  : categoryID,
				date_created : new Date(),
				directions   : directions,
				ingredients  : ingredients_map,
				portion      : portion_map,
				prep_time    : prep_time,
				recipe_name  : recipe_name,
				video_url    : video_url,
				image_url    : recipeURL
			})
			.then(function() {
				setLoading(false);
				alert('Successfully Added!');
				props.history.goBack();
			})
			.catch(function(error) {
				setLoading(false);
				alert('Error Updating document: ', error);
				props.history.goBack();
			});
	};

	function guid() {
		function _p8(s) {
			var p = (Math.random().toString(16) + '000000000').substr(2, 8);
			return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
		}
		return _p8() + _p8(true) + _p8(true) + _p8();
	}

	const addIngredient = (i) => {
		console.log(ingredients);
		let ing = ingredients.concat([ '' ]);
		setIngredients(ing);
	};

	const removeIngredient = (i) => {
		setIngredients(ingredients);
		let ing = [ ...ingredients.slice(0, i), ...ingredients.slice(i + 1) ];
		setIngredients(ing);
		console.log(ingredients);
	};

	const addDirection = (i) => {
		console.log(directions);
		let dir = directions.concat([ '' ]);
		setDirections(dir);
	};

	const removeDirection = (i) => {
		setDirections(directions);
		let dir = [ ...directions.slice(0, i), ...directions.slice(i + 1) ];
		setDirections(dir);
		console.log(directions);
	};

	return (
		<NavigationDrawer>
			{isLoadingData ? (
				<h5>Loading Data...</h5>
			) : isError ? (
				<h5>Error Retreiving Data</h5>
			) : isLoading ? (
				<h5>Updating Place...</h5>
			) : (
				<Container>
					<form onSubmit={handleSubmit}>
						<div className="add-recipes">
							<h1 className="heading-1">Update Recipe</h1>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										Recipes Name
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Recipe Name"
									aria-describedby="inputGroup-sizing-default"
									onChange={(e) => setRecipeName(e.target.value)}
								/>
							</InputGroup>

							<DropdownButton variant="info" title={category_name} id="drop-cat">
								{cats.map((cat) => (
									<Dropdown.Item key={cat.id}>
										<div
											onClick={() => {
												setCategoryName(cat.name);
												setCategoryID(cat.id);
											}}>
											{cat.name}
										</div>
									</Dropdown.Item>
								))}
							</DropdownButton>

							<p>
								<br />
								Select Recipe Image (450x200)
							</p>
							<SingleImageSelector sendImage={setRecipeImage} />

							<br />
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										Video Url
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Video Url"
									aria-describedby="inputGroup-sizing-default"
									onChange={(e) => setVideoUrl(e.target.value)}
								/>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										Preparation Time
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Prepration Time"
									aria-describedby="inputGroup-sizing-default"
									onChange={(e) => setPrepTime(e.target.value)}
								/>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-default">Portion Size</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Portion size"
									aria-describedby="inputGroup-sizing-default"
									onChange={(e) => setPortionSize(e.target.value)}
								/>

								<FormControl
									aria-label="Portion unit"
									aria-describedby="inputGroup-sizing-default"
									onChange={(e) => setPortionUnit(e.target.value)}
								/>
							</InputGroup>

							{ingredients.map((ingredient, i) => (
								<InputGroup className="mb-3" key={i}>
									<InputGroup.Prepend>
										<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
											Ingredient {i + 1}
										</InputGroup.Text>
									</InputGroup.Prepend>

									<FormControl
										aria-label="Ingredients"
										aria-describedby="inputGroup-sizing-default"
										onChange={(e) => {
											let ing = [ ...ingredients ];
											ing[i] = e.target.value;
											setIngredients(ing);
										}}
									/>

									<FormControl
										aria-label="Qty"
										aria-describedby="inputGroup-sizing-default"
										onChange={(e) => {
											let ing = [ ...ing_quantity ];
											ing[i] = e.target.value;
											setIngQuantity(ing);
										}}
									/>

									<FormControl
										aria-label="Unit"
										aria-describedby="inputGroup-sizing-default"
										onChange={(e) => {
											let ing = [ ...ing_unit ];
											ing[i] = e.target.value;
											setIngUnit(ing);
										}}
									/>

									<InputGroup.Append>
										<Button variant="info" onClick={() => addIngredient(i)}>
											Add
										</Button>
										<Button
											variant="danger"
											className={ingredients.length <= 1 ? 'opa' : 'undefined'}
											onClick={() => removeIngredient(i)}>
											Remove
										</Button>
									</InputGroup.Append>
								</InputGroup>
							))}

							{directions.map((direction, i) => (
								<InputGroup className="mb-3" key={i}>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-default">
											Direction {i + 1}
										</InputGroup.Text>
									</InputGroup.Prepend>

									<FormControl
										aria-label="Directions"
										aria-describedby="inputGroup-sizing-default"
										onChange={(e) => {
											let dir = [ ...directions ];
											dir[i] = e.target.value;
											setDirections(dir);
										}}
									/>

									<InputGroup.Append>
										<Button variant="info" onClick={() => addDirection(i)}>
											Add
										</Button>
										<Button
											variant="danger"
											className={directions.length <= 1 ? 'opa' : 'undefined'}
											onClick={() => removeDirection(i)}>
											Remove
										</Button>
									</InputGroup.Append>
								</InputGroup>
							))}

							<Button variant="primary" className="u-margin-med" type="submit">
								Add Recipe
							</Button>
							<br />
						</div>
					</form>
				</Container>
			)}
		</NavigationDrawer>
	);
};

export default AddRecipe;
