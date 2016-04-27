require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//let yeomanImage = require('../images/yeoman.png');
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数, 将图片名转换到图片路径
imageDatas = (function genImageURL(imageDataArr) {
	for (var i = 0, n = imageDataArr.length; i < n; i++) {
		var singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDataArr[i] = singleImageData;

	}
	return imageDataArr;
})(imageDatas);

class AppComponent extends React.Component {
	render() {
		return (
			<section className="stage">
				<section className="img-sec">

				</section>
				<nav className="controller-nav">

				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;