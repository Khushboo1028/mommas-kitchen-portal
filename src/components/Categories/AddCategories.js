import React from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { TextField, RadioGroup, Radio } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import * as CONSTANTS from '../../constants/constants';

const db = FirebaseApp.firestore();
const storage = FirebaseApp.storage();
var storageRef = storage.ref();

const useStyles = makeStyles((theme) => ({
	root  : {
		'& > *' : {
			margin : theme.spacing(1)
		}
	},
	input : {
		display : 'none'
	}
}));

const AddCategoryPage = (props) => {
	const classes = useStyles();
	const [ value, setValue ] = React.useState('Yes');
	const [ image, setImage ] = React.useState(null);
	const [ image_url, setImageUrl ] = React.useState('');
	const [ category_name, setCategoryName ] = React.useState('');
	const [ isLoading, setLoading ] = React.useState(false);

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	const addImage = (event) => {
		setImage(event.target.files[0]);
		console.log('Selected Image', event.target.files[0]);
	};

	function guid() {
		function _p8(s) {
			var p = (Math.random().toString(16) + '000000000').substr(2, 8);
			return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
		}
		return _p8() + _p8(true) + _p8(true) + _p8();
	}

	const handleFormSubmit = (event) => {
		event.preventDefault();

		if (category_name !== '') {
			if (image === null && image_url === '') {
				alert('Either image or image url is required..!');
			} else {
				setLoading(true);

				if (image !== null) {
					storageRef
						.child('categories/' + guid())
						.put(image)
						.then(function(snapshot) {
							snapshot.ref.getDownloadURL().then(function(downloadURL) {
								var docref = db.collection(CONSTANTS.CATEGORIES).doc();
								docref
									.set({
										name         : category_name,
										date_created : new Date(),
										image_url    : downloadURL
									})
									.then(function() {
										setLoading(false);
										alert('Successfully Added!');
										props.history.goBack();
									})
									.catch(function(error) {
										setLoading(false);
										alert('Error Adding document: ', error);
										props.history.goBack();
									});
							});
						})
						.catch((error) => {
							setLoading(false);
							alert('Error Uploading Image!', error);
						});
				} else {
					var docref = db.collection(CONSTANTS.CATEGORIES).doc();
					docref
						.set({
							name         : category_name,
							date_created : new Date(),
							image_url    : image_url
						})
						.then(function() {
							setLoading(false);
							alert('Successfully Added!');
							props.history.goBack();
						})
						.catch(function(error) {
							setLoading(false);
							alert('Error Adding document: ', error);
							props.history.goBack();
						});
				}
			}
		} else {
			alert('Category Name Required..!');
		}
	};

	const nameChanged = (e) => {
		setCategoryName(e.target.value);
	};
	const urlChanged = (e) => {
		setImageUrl(e.target.value);
	};

	return (
		<NavigationDrawer>
			{isLoading ? (
				<h5>Adding Data..</h5>
			) : (
				<div className="text-center">
					<form onSubmit={handleFormSubmit}>
						<div style={{ marginBottom: '2rem' }}>
							<TextField
								id="outlined-basic"
								label="Category Name"
								variant="outlined"
								placeholder="Ex. Baking"
								value={category_name}
								onChange={nameChanged}
							/>
						</div>

						<div style={{ marginBottom: '2rem' }}>
							<input
								accept="image/*"
								className={classes.input}
								id="contained-button-file"
								type="file"
								onChange={addImage}
							/>
							<label htmlFor="contained-button-file">
								<Button variant="contained" color="secondary" component="span">
									Upload Category Image
								</Button>
							</label>
							{image ? (
								<h5>Selected Image</h5>
							) : (
								<div>
									<h5>OR</h5>
									<TextField
										id="outlined-basic"
										label="Image URL"
										variant="outlined"
										value={image_url}
										onChange={urlChanged}
									/>
								</div>
							)}
						</div>
						<div>
							<Button type="submit" variant="contained" color="primary">
								Add Category
							</Button>
						</div>
					</form>
				</div>
			)}
		</NavigationDrawer>
	);
};

export default AddCategoryPage;
