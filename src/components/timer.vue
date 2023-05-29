<template>
    <div>
        <div style="height:calc(100vh - 50px);">
            <RelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick"
                :on-line-click="onLineClick">
                <!-- <div slot="graph-plug"
                    style="top:0px;left:0px;position:absolute; color:#ffffff;font-size:12px;width:600px;border:#efefef solid 1px;z-index:1001;">
                    <div style="background-color: #fa7b7e;padding:10px;width:100%;">这里是图谱插槽 slot="graph-plug"</div>

                </div> -->
                                    <!-- <div style="background-color: #7a9ef8;padding:10px;width:100%;">可以自定义这里的内容，比如你可以放一个搜索框：<el-input
                            v-model="searchText" placeholder="你可以通过这个搜素框实现节点搜索功能" /></div>
                    <div style="background-color: #7a9ef8;padding:10px;width:100%;">
                        你需要设置这个插槽div的z-index>1000才能让这里展示在节点之上，否则它默认会被节点覆盖</div>
                    <div style="background-color: #c67ffa;padding:10px;width:100%;">
                        你可以把悬浮菜单放到这里，这样全屏后，右键菜单依然有效，点击图谱全屏按钮后再点击节点试试</div>
                    <div v-show="isShowNodeMenuPanel"
                        :style="{ left: nodeMenuPanelPosition.x + 'px', top: nodeMenuPanelPosition.y + 'px' }"
                        style="width:200px;z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
                        <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;">对这个节点进行操作：</div>
                        <div class="c-node-menu-item" @click.stop="doAction('操作1')">操作1</div>
                        <div class="c-node-menu-item" @click.stop="doAction('操作1')">操作2</div>
                        <div class="c-node-menu-item" @click.stop="doAction('操作1')">操作3</div>
                        <div class="c-node-menu-item" @click.stop="doAction('操作1')">操作4</div>
                    </div> -->
            </RelationGraph>
        </div>

    </div>
</template>
  
<script>
// relation-graph也支持在main.js文件中使用Vue.use(RelationGraph);这样，你就不需要下面这一行代码来引入了。
import RelationGraph from 'relation-graph'
export default {
    name: 'Demo',
    components: { RelationGraph },
    props: ['task', 'createUser'],
    // 其他选项
    data() {
        return {

            graph_json_data: {
                rootId: '111',
                nodes: [],
                lines: [],
            },
            graphOptions: {
                allowSwitchLineShape: true,
                allowSwitchJunctionPoint: true,
                defaultJunctionPoint: 'border',

                min_per_width: 300,
                layouts: [
                    {
                        layoutName: 'center',
                        layoutDirection: 'v',
                        from: 'top',
                        centerOffset_x: 0,
                        centerOffset_y: 0,
                        distance_coefficient: 1.5
                    }
                ]
                // 这里可以参考"Graph 图谱"中的参数进行设置
            },
            // 定义一个空的 __graph_json_data 对象

        }
    },
    mounted() {
        console.log(this.task)
        console.log(this.createUser)
        this.updateSeeksJsonData(); // 在挂载组件时更新 __graph_json_data
        this.showSeeksGraph(); // 显示图谱，并传入更新后的 json 数据


    },
    methods: {
        updateSeeksJsonData() {
            const taskText = this.task.text;
            // ...根据需要更新 __graph_json_data 的其他属性...

            // 使用任务文本作为节点名称（仅示例）
            this.graph_json_data.nodes = [
                { id: 'a', text: this.task.title, color: '#343a40', nodeShape: 1, height: 100, Width: 20 },
                { id: 'b', text: this.createUser.username, html: '<strong style="">' + this.createUser.username + '</strong><img src="' + this.createUser.icon + '"  width="100" style="border:#ff8c00 solid 2px;border-radius: 60px;"  />', nodeShape: 1 },
                // ...根据需要更新节点对象...

            ];
            this.graph_json_data.rootId = taskText;
            console.log(this.task.users)
            this.task.users.forEach((user) => {
                this.graph_json_data.nodes.push({ id: 'user-' + user.id, text: user.username, html: '<strong style="">' + user.username + '</strong><img src="' + user.icon + '" width="100"  width="100" style="border:#ff8c00 solid 2px;border-radius: 60px;"  />', nodeShape: 1 });

            });
            this.task.records.forEach((record) => {
                if (record.leak_level == 'LOW') {
                    this.graph_json_data.nodes.push({ id: 'record-' + record.id, text: '  泄密等级：' + record.leak_level, nodeShape: 1, color: '#43d39e', });
                }
                if (record.leak_level == 'MEDIUM') {
                    this.graph_json_data.nodes.push({ id: 'record-' + record.id, text: '  泄密等级：' + record.leak_level, nodeShape: 1, color: '#ffbe0b', });
                }
                if (record.leak_level == 'HIGH') {
                    this.graph_json_data.nodes.push({ id: 'record-' + record.id, text: '  泄密等级：' + record.leak_level, nodeShape: 1, color: '#ff5c75', });
                }


            });
            // this.task.ideas.forEach((idea) => {
            //     this.graph_json_data.nodes.push({ id: 'idea-' + idea.id, text: idea.description, nodeShape: 1, color: '#008ffb' });

            // });


            this.graph_json_data.lines = [
                { from: 'a', to: 'b', text: '使用文档', fontColor: 'dark', html: '<strong>使用文档 </strong>', color: '#1e1b1c' },
                // ...根据需要更新线条对象...
            ];
            this.task.users.forEach((user) => {
                this.graph_json_data.lines.push({ from: 'b', to: 'user-' + user.id, text: '下发文件给', color: '#1e1b1c' });
            });
            this.task.records.forEach((record) => {
                this.graph_json_data.lines.push({ from: 'user-' + record.user_id, to: 'record-' + record.id, text: '记录', color: '#ff5c75', });
            });

            // this.task.ideas.forEach((idea) => {
            //     this.graph_json_data.lines.push({ from: 'user-' + idea.user_id, to: 'idea-' + idea.id, text: '意见', color: '#43d39e' });
            // });
            this.task.users.forEach((userA, indexA) => {
                // 遍历其他未被遍历过的元素，避免重复连接同一个节点
                for (let i = indexA + 1; i < this.task.users.length; i++) {
                    const userB = this.task.users[i];
                    // 每个用户都有50%的概率与其他人相连
                    if (Math.random() > 0.5) {
                        const color = 'rgb(' +
                            Math.floor(Math.random() * 256) + ',' +
                            Math.floor(Math.random() * 256) + ',' +
                            Math.floor(Math.random() * 256) +
                            ')';
                        this.graph_json_data.lines.push({
                            from: 'user-' + userA.id,
                            to: 'user-' + userB.id,
                            text: '相互联系', // 连接线文本为空
                            lineWidth: 5, // 连接线宽度在0~5px之间变化
                            color: color
                        });
                    }
                }
            });
        },
        showSeeksGraph() {
            const graph_json_data = this.graph_json_data; // 获取最新的 json 数据
            // 以上数据中的node和link可以参考"Node节点"和"Link关系"中的参数进行配置 
            this.$refs.seeksRelationGraph.setJsonData(graph_json_data, (seeksRGGraph) => {
                // Called when the relation-graph is completed 
            })
        },

        onLineClick(lineObject, $event) {
            console.log('onLineClick:', lineObject)
        },
        // onNodeClick(nodeObject, $event) {
        //     console.log('onNodeClick:', nodeObject);
        //     this.makeToast('点击了节点:' + nodeObject.text);
        // },
        onNodeClick(nodeObject, $event) {
            console.log('onNodeClick:', nodeObject);
            this.makeToast(nodeObject.id + ' 内容：  ' + nodeObject.text);
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
                    line.lineWidth = 5;
                });
            });
            // 有时候更改一些属性后，并不能马上同步到视图，这需要以下方法让视图强制根据数据同步到最新
            this.$refs.seeksRelationGraph.getInstance().dataUpdated();
        },
        makeToast(variant) {
            this.$bvToast.toast(variant, {
                title: '详细信息',
                variant: 'success',
                toaster: 'b-toaster-top-center',
                solid: true
            })
        },




    }
}
</script>
<style scoped>
.c-node-menu-item {
    line-height: 30px;
    padding-left: 10px;
    cursor: pointer;
    color: #444444;
    font-size: 14px;
    border-top: #efefef solid 1px;
}

.c-node-menu-item:hover {
    background-color: rgba(66, 187, 66, 0.2);
}</style>