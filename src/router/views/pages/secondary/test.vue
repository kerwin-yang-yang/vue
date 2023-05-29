<template>
	<div>
		<div ref="vantaRef" style="width:100%;height:100vh"></div>
		<div class="my_title">Hello,World</div>
	</div>
</template>
	
<script>
import * as THREE from 'three'
import WAVES from 'vanta/src/vanta.waves'
export default {
	name: "hello",
	data() {
		return {

		};
	},
	mounted() {
		this.vantaEffect = WAVES({
			el: this.$refs.vantaRef,
			THREE: THREE
		})
		VANTA.WAVES({
  el: this.$refs.vantaRef,
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  shininess: 142.00,
  waveHeight: 35.00,
  waveSpeed: 1.65
})

	},
	beforeDestroy() {
		if (this.vantaEffect) {
			this.vantaEffect.destroy()
		}
	},
	methods: {

	},

};
</script>
	
<style>
.my_title {
	z-index: 999;
	position: fixed;
	top: 40%;
	left: 10%;
	color: aquamarine;
	font-size: 100px;
	font-weight: bolder;
}
</style>
	