function Toggle({ imgSrc, setImgSrc, greenIcon, greyIcon, setIsStepMode }) {
	function handleToggle(e) {
		const checked = e.target.checked;
		setImgSrc(checked ? greenIcon : greyIcon);
		setIsStepMode(checked);
	}

	return (
	<div className="flex items-center gap-2">
		<label className="switch">
		<input
			type="checkbox"
			onChange={handleToggle}
			checked={imgSrc === greenIcon} // sync with state
		/>
		<span className="slider round"></span>
		</label>
		<span>Step-by-Step</span>
	</div>
	);
}

export default Toggle;
