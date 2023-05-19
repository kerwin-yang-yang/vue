<template>
  <div>
    <div style="height:calc(100vh - 50px);">
      <RelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick"
        :on-line-click="onLineClick" />
    </div>
  </div>
</template>

<script>
// relation-graph也支持在main.js文件中使用Vue.use(RelationGraph);这样，你就不需要下面这一行代码来引入了。
import RelationGraph from 'relation-graph'
export default {
  name: 'Demo',
  components: { RelationGraph },
  data() {
    return {
      graphOptions: {
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultJunctionPoint: 'border'
        // 这里可以参考"Graph 图谱"中的参数进行设置
      }
    }
  },
  mounted() {
    this.showSeeksGraph()
  },
  methods: {
    showSeeksGraph() {
      const __graph_json_data = {
        rootId: 'a',
        nodes: [
          { id: 'a', text: '边框颜色', borderColor: 'yellow' },
          { id: 'a1', text: '无边框', borderWidth: -1, color: '#ff8c00' },
          { id: 'a1-1', html: '<span style="color:#ff8c00">纯文字节点</span>' },
          { id: 'a1-2', html: '<img src="https://camo.githubusercontent.com/ede1654f055903cdc39044129d15d5b158f4f3b33ba5b7c21c7407792a506dea/687474703a2f2f72656c6174696f6e2d67726170682e636f6d2f776562736974652f6c6f676f" width="200" style="border:#ff8c00 solid 2px;" />', nodeShape: 1 },
          { id: 'a1-3', html: '<img src="https://camo.githubusercontent.com/ede1654f055903cdc39044129d15d5b158f4f3b33ba5b7c21c7407792a506dea/687474703a2f2f72656c6174696f6e2d67726170682e636f6d2f776562736974652f6c6f676f" width="100" style="border:#ff8c00 solid 2px;border-radius: 60px;" />', nodeShape: 0 },
          { id: 'a1-4', html: '<div style="border:#ff8c00 solid 2px;height:80px;width:80px;border-radius: 40px;background-image: url(https://camo.githubusercontent.com/ede1654f055903cdc39044129d15d5b158f4f3b33ba5b7c21c7407792a506dea/687474703a2f2f72656c6174696f6e2d67726170682e636f6d2f776562736974652f6c6f676f);background-position: center center;" />', nodeShape: 0 },
          { id: 'b', text: '字体颜色', borderWidth: 1, color: '#43a2f1' },
          { id: 'c', text: '文字颜色', fontColor: 'yellow' },
          { id: 'd', text: '节点大小', width: 150, height: 150, color: '#ffd700', borderWidth: 1 },
          { id: 'e', text: '矩形节点', nodeShape: 1 },
          { id: 'f', text: '矩形节点-固定大小', borderWidth: 1, nodeShape: 1, width: 300, height: 60 },
          { id: 'f1', text: '固定位置', fixed: true, x: 20, y: 20 },
          { id: 'g', text: '自定义class实现闪烁', styleClass: 'my-node-style' }
        ],
        lines: [
          { from: 'a', to: 'b' },
          { from: 'a', to: 'c' },
          { from: 'a', to: 'a1' },
          { from: 'a1', to: 'a1-1' },
          { from: 'a1', to: 'a1-2' },
          { from: 'a1', to: 'a1-3' },
          { from: 'a1', to: 'a1-4' },
          { from: 'a', to: 'f1' },
          { from: 'a', to: 'd' },
          { from: 'd', to: 'f' },
          { from: 'a', to: 'g' },
          { from: 'a', to: 'e' },
          { from: 'b', to: 'e' }
        ]};

      // 以上数据中的node和link可以参考"Node节点"和"Link关系"中的参数进行配置 
      this.$refs.seeksRelationGraph.setJsonData(__graph_json_data, (seeksRGGraph) => {
        // Called when the relation-graph is completed 
      })
    },

    onLineClick(lineObject, $event) {
      console.log('onLineClick:', lineObject)
    },
    onNodeClick(nodeObject, $event) {
      console.log('onNodeClick:', nodeObject);
      const allLinks = this.$refs.seeksRelationGraph.getLinks();
      allLinks.forEach(link => { // 还原所有样式
        link.relations.forEach(line => {
          if (line.data.orignColor) {
            line.color = line.data.orignColor;
          }
          if (line.data.orignFontColor) {
            line.fontColor = line.data.orignColor;
          }
          if (line.data.orignLineWidth) {
            line.lineWidth = line.data.orignLineWidth;
          }
        });
      });
      // 让与{nodeObject}相关的所有连线高亮
      allLinks.filter(link => (link.fromNode === nodeObject || link.toNode === nodeObject)).forEach(link => {
        link.relations.forEach(line => {
          // console.log('line:', line);
          line.data.orignColor = line.color;
          line.data.orignFontColor = line.fontColor || line.color;
          line.data.orignLineWidth = line.lineWidth || 1;
          line.color = '#ff0000';
          line.fontColor = '#ff0000';
          line.lineWidth = 3;
        });
      });
      // 有时候更改一些属性后，并不能马上同步到视图，这需要以下方法让视图强制根据数据同步到最新
      this.$refs.seeksRelationGraph.getInstance().dataUpdated();
    },
    

  }
}
</script>