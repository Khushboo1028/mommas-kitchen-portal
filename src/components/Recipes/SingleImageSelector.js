import React, { useState, useEffect, useReducer } from 'react';
import './add-recipes.css';

const SingleImageSelector = (props) => {
	const [ file, setFile ] = useState(props.imageFile);
	const [ , forceUpdate ] = useReducer((x) => x + 1, 0);

	const uploadSingleFile = (e) => {
		setFile(URL.createObjectURL(e.target.files[0]));
		props.sendImage(e.target.files[0]);
	};
	useEffect(() => {
		return () => {
			forceUpdate();
		};
	}, []);
	return (
		<div>
			<div className="form-group preview">{file ? <img className="img-border" src={file} alt="" /> : ''}</div>

			<div className="form-group">
				<input type="file" className="form-control" onChange={uploadSingleFile} />
			</div>
		</div>
	);
};

export default SingleImageSelector;
