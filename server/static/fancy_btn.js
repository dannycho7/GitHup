class FancyButton extends React.Component {
	render() {
		// Mask id and styling
		// need unique id's for multiple buttons
		const maskId = 'mask_1';
		const maskStyle = '#fancy-masked-element_' + maskId + ' { mask: url(#' + maskId + '); -webkit-mask: url(#' + maskId + ')}';

		const buttonStyle = {
			width: this.props.width,
			height: this.props.height
		};

		const fancyFrontStyle = {
			transform: 'rotateX(0deg) translateZ(' + this.props.height / 2 + 'px )'
		};

		const fancyBackStyle = {
			transform: 'rotateX(90deg) translateZ( ' + this.props.height / 2 + 'px )'
		};

		// SVG attributes
		const textTransform = 'matrix(1 0 0 1 ' + this.props.width / 2 + ' ' + this.props.height / 1.6 + ')';
		const viewBox = '0 0 ' + this.props.width + ' ' + this.props.height;

		return React.createElement(
			'div',
			{ className: 'fancy-button',
				style: buttonStyle,
				ref: 'fancyButton' },
			React.createElement(
				'div',
				{ className: 'fancy-flipper' },
				React.createElement(
					'div',
					{ className: 'fancy-front', style: fancyFrontStyle },
					React.createElement(
						'svg',
						{
							height: this.props.height,
							width: this.props.width,
							viewBox: viewBox },
						React.createElement(
							'defs',
							null,
							React.createElement(
								'mask',
								{ id: maskId },
								React.createElement('rect', { width: '100%', height: '100%', fill: '#FFFFFF' }),
								React.createElement(
									'text',
									{ className: 'mask-text button-text', fill: '#000000', transform: textTransform, fontFamily: '\'intro_regular\'', fontSize: this.props.fontSize, width: '100%', textAnchor: 'middle', letterSpacing: '1' },
									this.props.buttonText
								)
							)
						),
						React.createElement(
							'style',
							null,
							maskStyle
						),
						React.createElement('rect', { id: 'fancy-masked-element_' + maskId, fill: this.props.color, width: '100%', height: '100%' })
					)
				),
				React.createElement(
					'div',
					{ className: 'fancy-back', style: fancyBackStyle },
					React.createElement(
						'svg',
						{
							height: this.props.height,
							width: this.props.width,
							viewBox: viewBox },
						React.createElement('rect', { stroke: this.props.color,
							strokeWidth: this.props.borderWidth,
							fill: 'transparent',
							width: '100%',
							height: '100%' }),
						React.createElement(
							'text',
							{ className: 'button-text', transform: textTransform, fill: this.props.color, fontFamily: '\'intro_regular\'', fontSize: this.props.fontSize, textAnchor: 'middle', letterSpacing: '1' },
							this.props.buttonText
						)
					)
				)
			)
		);
	}
}

FancyButton.defaultProps = {
	color: '#FFFFFF',
	width: 410,
	height: 100,
	fontSize: 40,
	borderWidth: 15,
	buttonText: 'View My Files'
};

React.render(React.createElement(FancyButton, null), document.getElementById('app'));