module.exports = class isVR {

	constructor(config) {
		this.any = {};
        this.reportDisplays();
	}
	reportDisplays() {
		navigator.getVRDisplays().then( (displays) => {
            console.groupCollapsed("VR Information");
			for (let i = 0; i < displays.length; i++) {
                console.group("VR Display");
                let disp = displays[i];
				let cap = disp.capabilities;
                console.log(`VR Display ID: ${disp.displayId}`);
                console.log(`VR Display Name: ${disp.displayName}`);
                console.log(`Display can present content: ${cap.canPresent}`);
                console.log(`Display is separate from the computer\'s main display: ${cap.hasExternalDisplay}`);
                console.log(`Display can return position info: ${cap.hasPosition}`);
                console.log(`Display can return orientation info: ${cap.hasOrientation}`);
                console.log(`Display max layers: ${cap.maxLayers}`);
                console.groupEnd();

			}
            console.groupEnd();
			setTimeout(this.reportGamepads, 1000);
			// For VR, controllers will only be active after their corresponding headset is active
		});
	}

    reportGamepads() {
		let gamepads = navigator.getGamepads();
        console.groupCollapsed("Gamepad Info");
		console.log(gamepads.length + ' controllers');
		for (let i = 0; i < gamepads.length; ++i) {
			let gp = gamepads[i];
            console.log(gp);
            // console.log(`Gamepad: ${i}`);
            // console.log(`Associated with VR Display ID: ${gp.displayId}`);
            // console.log(`Gamepad associated with which hand: ${gp.hand}`);
            // console.log(`Available haptic actuators: ${gp.hapticActuators.length}`);
            // console.log(`Gamepad can return position info: ${gp.pose.hasPosition}`);
            // console.log(`Gamepad can return orientation info: ${gp.pose.hasOrientation}`);
		}
        console.groupEnd();
	}
}
