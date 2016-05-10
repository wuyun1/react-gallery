require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import {
	findDOMNode
} from 'react-dom';

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

function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

function get30DegRandom() {
	return (Math.random()>0.5 ?'':'-') + Math.ceil(Math.random()*30);
}

class ImgFigure extends React.Component {

	handleClick(e) {
		if(this.props.onClick){
			this.props.onClick(this,e);
		}
	}

	render() {

		let styleObj = {};

		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		if(this.props.arrange.rotate){
			styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
		}
		return (
			<figure className="img-figure" style={styleObj} onClick={this.handleClick.bind(this)}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
}



class AppComponent extends React.Component {

	get Constants() {
		return AppComponent.Constants;
	}

	set Constants(value) {
		AppComponent.Constants = value;
	}

	constructor() {
		super(...arguments);
		// console.log(arguments);
		this.state = {
			imgsArrangeArr: [
				/*{
					pos: {
						left:'0',
						top: '0'
					},
					rotate: 0
				}*/
			]
		};

	}



	onImgFiguresAction(e){
		// window.abc=findDOMNode(e);
		// console.log(findDOMNode(e));
		this.rearrange(Array.prototype.indexOf.call(document.querySelectorAll(".img-figure"),findDOMNode(e)));

	}
	/**
	 
	 * 重新布局所以图片
	 * @param centerIndex 指定居中排布哪一个图片
	 */
	rearrange(centerIndex) {
		console.log(centerIndex);
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constants = this.Constants,
			centerPos = Constants.centerPos,
			hPosRange = Constants.hPosRange,
			vPosRange = Constants.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1),
			topImgNum = Math.ceil(Math.random() * 2),
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum)),
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		imgsArrangeCenterArr[0].pos = centerPos;
		imgsArrangeCenterArr[0].rotate = 0;





		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index] = {
				pos:{
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom()

			}
		});

		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			var hPosRangeLORX = null;

			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			}

			imgsArrangeArr[i]={
				pos:{
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom()
			}


			
		}

		// if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
		// 	imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		// }

		// imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
		let newImgsArrangeArr=[];
		Array.prototype.splice.apply(newImgsArrangeArr,[0,0].concat(imgsArrangeArr));
		Array.prototype.splice.apply(newImgsArrangeArr,[topImgSpliceIndex,0].concat(imgsArrangeTopArr));
		Array.prototype.splice.apply(newImgsArrangeArr,[centerIndex,0].concat(imgsArrangeCenterArr));
		
		this.setState({
			imgsArrangeArr: newImgsArrangeArr
		});
	}



	componentDidMount() {

		let stageDom = findDOMNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		let imgFigureDOM = findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		this.Constants.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
				// zIndex: 100
		};

		// 计算左侧,右侧图片排布范围
		this.Constants.hPosRange.leftSecX[0] = -halfImgW;
		this.Constants.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constants.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constants.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constants.hPosRange.y[0] = -halfImgH;
		this.Constants.hPosRange.y[1] = stageH - halfImgH;

		// 计算上侧,下次图片排布范围
		this.Constants.vPosRange.topY[0] = -halfImgH;
		this.Constants.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constants.vPosRange.x[0] = halfStageW - imgW;
		this.Constants.vPosRange.x[1] = halfStageW;
		// let self = this;
		// setInterval(function() {
		// 	self.rearrange(Math.ceil(15 * Math.random()) - 1);
		// }, 2000);
		// console.log(this.Constants);
		this.rearrange(Math.ceil(15 * Math.random()) - 1);

	}


	render() {

		let controllerUnits = [],
			ImgFigures = [];
		imageDatas.forEach(function(value, index) {
			if (!this.state.imgsArrangeArr[index]) {
				// console.log(this.state.imgsArrangeArr[index]);
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate:0
				}
			}


			ImgFigures.push(<ImgFigure onClick={this.onImgFiguresAction.bind(this)} data={value} key={'key_'+index} ref={'imgFigure' + index} arrange = {this.state.imgsArrangeArr[index]} />);
		}.bind(this));


		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{ImgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};


AppComponent.Constants = {
	centerPos: {
		left: 0,
		top: 0
	},
	hPosRange: { //水平方向取值范围
		leftSecX: [0, 0],
		rightSecX: [0, 0],
		y: [0, 0]
	},
	vPosRange: { //垂直方向的取值范围
		x: [0, 0],
		topY: [0, 0]
	}

};

export default AppComponent;