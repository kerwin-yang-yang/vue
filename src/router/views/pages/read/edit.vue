
<template>
    <div id="app">
        <div>
            <VueDragResize :isActive="true" :w="200" :h="200" v-on:resizing="resize" v-on:dragging="resize">
                <h3>Hello World!</h3>
                <p>{{ top }} х {{ left }} </p>
                <p>{{ width }} х {{ height }}</p>
            </VueDragResize>
        </div>
<div>
    
</div>
    </div>
</template>

<script>
import VueDragResize from 'vue-drag-resize';
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
export default {
    page: {
        title: 'Edit Document',
        meta: [{ name: 'description', content: appConfig.description }],
    },
    components: {
        VueDragResize, Layout
    },
    data() {
        return {
            width: 0,
            height: 0,
            top: 300,
            left: 300
        }
    },
    methods: {
        resize(newRect) {
            this.width = newRect.width;
            this.height = newRect.height;
            this.top = newRect.top;
            this.left = newRect.left;
        }
    }
}
</script>