import React, { useEffect } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import Button from '@material-ui/core/Button';
import { TextField, RadioGroup, Radio } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import * as CONSTANTS from '../../constants/constants';

const db = FirebaseApp.firestore();
const storage = FirebaseApp.storage();
var storageRef = storage.ref();

const CategoryDetails = (props) => {
	const { history } = props;

	const [ value, setValue ] = React.useState('Yes');

	const [ image_url, setImageUrl ] = React.useState('');
	const [ imageToUpload, setImageToUpload ] = React.useState(null);
	const [ imageToDelete, setImageToDelete ] = React.useState('');

	const [ category_name, setCategoryName ] = React.useState('');

	const [ isLoading, setLoading ] = React.useState(false);

	const [ isError, setError ] = React.useState(false);

	const [ isDeleting, setDeleting ] = React.useState(false);

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	function guid() {
		function _p8(s) {
			var p = (Math.random().toString(16) + '000000000').substr(2, 8);
			return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
		}
		return _p8() + _p8(true) + _p8(true) + _p8();
	}

	const addImage = (event) => {
		setImageUrl(URL.createObjectURL(event.target.files[0]));
		setImageToUpload(event.target.files[0]);
		console.log('Selected Image', event.target.files[0]);
	};

	useEffect(
		() => {
			getData();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ isLoading ]
	);

	const getData = () => {
		var docref = db.collection(CONSTANTS.CATEGORIES).doc(props.match.params.id);
		docref
			.get()
			.then(function(doc) {
				setLoading(false);
				setCategoryName(doc.data().name);

				setImageUrl(doc.data().image_url);
				setImageToDelete(doc.data().image_url);
			})
			.catch(function(error) {
				setLoading(false);
				setError(true);
			});
	};

	//Deleting Category
	const handleFormSubmit = (event) => {
		event.preventDefault();
		if (
			window.confirm(
				'Recipes associated with this category will no longer have any category. Are you sure you want to delete it?'
			)
		) {
			setDeleting(true);

			db
				.collection(CONSTANTS.RECIPES)
				.where(CONSTANTS.CATEGORIES, '==', props.match.params.id)
				.get()
				.then(function(querySnapshot) {
					querySnapshot.forEach(function(doc) {
						doc.ref
							.update({
								category_id : ''
							})
							.then(function() {})
							.catch(function(error) {
								setDeleting(false);
								alert('Error Updating Category:', error);
							});
					});
					var docref = db.collection(CONSTANTS.CATEGORIES).doc(props.match.params.id);

					docref
						.delete()
						.then(function() {
							setDeleting(false);
							history.push('/categories');
						})
						.catch(function(error) {
							setDeleting(false);
							alert('Error deleting document:', error);
						});
				})
				.catch(function(error) {
					setDeleting(false);
					alert('Error Getting Recipe to update', error);
				});
		} else {
			return;
		}
	};

	const handleUpdate = () => {
		console.log('IN HANDLE UPDATE');
		console.log(image_url);
		if (category_name === '') {
			alert('Category Name is Required!');
		} else {
			if (typeof image_url === 'string' && image_url.includes('blob')) {
				console.log('IMAGE TO UPLOAD');
				console.log(imageToUpload);
				storageRef
					.child('categories/' + guid())
					.put(imageToUpload)
					.then(function(snapshot) {
						snapshot.ref
							.getDownloadURL()
							.then(function(url) {
								db
									.collection(CONSTANTS.CATEGORIES)
									.doc(props.match.params.id)
									.update({
										name      : category_name,
										image_url : url
									})
									.then(() => {
										alert('Successfully Updated');
										props.history.goBack();
									})
									.catch((error) => {
										alert('Error Updating Category');
										props.history.goBack();
									});
							})
							.catch((error) => {
								alert('Error Uploading Category Image!', error);
								props.history.goBack();
							});
					})
					.catch((error) => {
						alert('Error Uploading Image!', error);
						props.history.goBack();
					});
			} else {
				//No Change in image upload no image
				console.log('IN NO IMAGE TO UPLOAD');
				console.log(image_url);
				db
					.collection(CONSTANTS.CATEGORIES)
					.doc(props.match.params.id)
					.update({
						name : category_name
					})
					.then(() => {
						props.history.goBack();
					})
					.catch((error) => {
						alert('Error Updating Category');
						props.history.goBack();
					});
			}
		}
	};

	return (
		<NavigationDrawer>
			{isDeleting ? (
				<h5>Deleting Category...</h5>
			) : isLoading ? (
				<h5>Loading..</h5>
			) : isError ? (
				<h5>Error.! No Document Found!</h5>
			) : (
				<div className="text-center">
					<form onSubmit={handleFormSubmit}>
						<div style={{ marginBottom: '2rem' }}>
							<TextField
								id="outlined-basic"
								label="Category Name"
								variant="outlined"
								placeholder="Ex. Apparel"
								value={category_name}
								onChange={(e) => setCategoryName(e.target.value)}
							/>
						</div>

						<input accept="image/*" id="contained-button-file" type="file" onChange={addImage} />
						<br />
						<br />
						<div style={{ marginBottom: '2rem' }}>
							<h6>Category Image</h6>
							<img src={image_url} style={{ backgroundColor: 'black' }} alt="category" />
						</div>
						<div>
							<Button variant="contained" color="primary" onClick={handleUpdate}>
								Update
							</Button>
							<br />
							<br />
							<Button type="submit" variant="contained" color="secondary">
								Delete
							</Button>
						</div>
					</form>
				</div>
			)}
		</NavigationDrawer>
	);
};

export default CategoryDetails;
