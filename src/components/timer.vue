<template>
    <div>
        <div style="height:calc(100vh - 50px);">
            <RelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick"
                :on-line-click="onLineClick">

            </RelationGraph>
        </div>
        <b-modal size="xl" v-model="showabout" hide-footer title="结点知识图谱分析" title-class="font-18">
            <div class="card">
                <!-- <i class="uil-shield-exclamation text-danger display-3"></i>
                <h4 class="text-danger mt-4">退出警告</h4> -->

                <div class="card-body " style="border:3px solid;margin-bottom: 10px;">
                    <h4 class="header-title mt-0 mb-1">可能泄密相关人员</h4>
                    <p class="sub-header">
                        根据获取人员的相互联系记录和人员的危险异常行为记录，发现可能潜在的泄密行为
                        <!-- <code>.table-dark</code>. -->
                    </p>
                    <b-table-simple class="table table-hover table-nowrap mb-0">
                        <b-thead class="thead-white">
                            <b-tr>
                                <b-th class="text-center ">相关人员</b-th>
                                <b-th class="text-center ">是否已经确定泄密</b-th>
                                <b-th class="text-center ">高风险记录数</b-th>

                            </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr v-for="one in text">

                                <b-td class="ellipsis text-center">{{ one }}</b-td>
                                <b-td class="text-center ">
                                    <!-- variant="danger" -->
                                    <span class="badge badge-soft-success" :class="{
                                        'badge-soft-danger': clickOne === one,

                                    }">{{ clickOne === one ? '是' : '否' }} </span></b-td>
                                <b-td class="text-center ">

                                    <span class="badge badge-soft-success" :class="{
                                        'badge-soft-danger': highRiskRecords.filter(record => record.user_name
                                            === one).length != 0,

                                    }">{{ highRiskRecords.filter(record => record.user_name
    === one).length }}</span>
                                </b-td>
                            </b-tr>

                        </b-tbody>
                    </b-table-simple>
                </div>
                <div class="card-body " style="border:3px solid ;margin-bottom: 10px;">
                    <!-- <p>{{ text }}</p> -->
                    <!-- <h4>用户数：</h4>
                    <p>{{ userCount }}</p>
                    <h4>高风险记录：</h4>
                    <p>{{ highRiskCount }}</p>
                    <h4>中风险记录：</h4>
                    <p>{{ mediumRiskCount }}</p>
                    <h4>高风险记录：</h4> -->
                    <div class="row" style="background-color: #d3cccc;">

                        <div v-for="stat of cStatData" :key="stat.title" class="col-md-6 col-xl-3" v-if="showabout" style="margin-top: 20px;">
                            <Stat :title="stat.title" :value="stat.value" :icon="stat.icon" :color="stat.color" />
                        </div>
                    </div>
                </div>
                <div class="card-body " style="border:3px solid;margin-bottom: 10px;">
                    <h4 class="header-title mt-0 mb-1">相关记录</h4>
                    <p class="sub-header">
                        根据存在联系的高风险记录挖掘可能存在的泄密行为
                        <!-- <code>.table-dark</code>. -->
                    </p>
                    <b-table-simple class="table table-hover table-nowrap mb-0">
                        <b-thead class="thead-white">
                            <b-tr>
                                <b-th>编号</b-th>
                                <b-th>详情</b-th>
                                <b-th>时间</b-th>
                                <b-th>用户</b-th>

                                <b-th>泄密等级</b-th>
                            </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr v-for="record in highRiskRecords">
                                <b-td>{{ record.id }}</b-td>
                                <b-td> {{ record.title.substr(0, 32) }}</b-td>
                                <b-td class="ellipsis">{{ record.create_time }}</b-td>
                                <b-td class="ellipsis">{{ record.user_name }}</b-td>
                                <b-td>
                                    <span class="badge badge-soft-danger">HIGH</span>
                                </b-td>
                            </b-tr>

                        </b-tbody>
                    </b-table-simple>
                </div>

                <div class="mt-4 text-center">
                    <a class="btn btn-outline-dark btn-rounded width-md " href="javascript: void(0)"
                        @click="showabout = false">
                        关闭
                    </a>
                </div>
            </div>
        </b-modal>

    </div>
</template>
  
<script>
// relation-graph也支持在main.js文件中使用Vue.use(RelationGraph);这样，你就不需要下面这一行代码来引入了。
import RelationGraph from 'relation-graph'
import Stat from '@components/widget-stat'
import StatChart from '@components/widget-stat-chart'
export default {
    name: 'Demo',
    components: { RelationGraph, Stat, StatChart },
    props: ['task', 'createUser'],
    // 其他选项
    data() {
        return {
            showabout: false,
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
            text: [],
            userCount: 1,
            highRiskCount: 0,
            mediumRiskCount: 0,
            lowRiskCount: 0,
            highRiskRecords: [],
            clickOne: '',
            statData:[]
            // 定义一个空的 __graph_json_data 对象

        }
    },
    computed: {
        cStatData() {
            return [
                {
                    title: '用户数量',
                    value: this.userCount,
                    icon: 'users',
                    color: 'primary',
                },
                {
                    title: '高风险记录',
                    value: this.highRiskCount,
                    icon: 'coffee',
                    color: 'danger',
                },
                {
                    title: '中风险记录',
                    value: this.mediumRiskCount,
                    icon: 'coffee',
                    color: 'warning',
                },
                {
                    title: '低风险记录',
                    value: this.lowRiskCount,
                    icon: 'coffee',
                    color: 'info',
                },
            ]
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
                { id: 'b', text: this.createUser.username, html: '<strong style="">' + this.createUser.username + '</strong><img src="' + this.createUser.icon + '"  width="100" style="border:#ff8c00 solid 2px;border-radius: 60px;"  />', nodeShape: 1, data: { type: 'user', } },
                // ...根据需要更新节点对象...

            ];
            this.graph_json_data.rootId = taskText;
            console.log(this.task.users)
            this.task.users.forEach((user) => {
                this.graph_json_data.nodes.push({ id: 'user-' + user.id, text: user.username, html: '<strong style="">' + user.username + '</strong><img src="' + user.icon + '" width="100"  width="100" style="border:#ff8c00 solid 2px;border-radius: 60px;"  />', nodeShape: 1, data: { type: 'user', } });

            });
            this.task.records.forEach((record) => {
                if (record.leak_level == 'LOW') {
                    this.graph_json_data.nodes.push({ id: 'record-' + record.id, text: '  泄密等级：' + record.leak_level, nodeShape: 1, color: '#43d39e', data: { riskLevel: 'low', type: 'record', record: record } });
                }
                if (record.leak_level == 'MEDIUM') {
                    this.graph_json_data.nodes.push({ id: 'record-' + record.id, text: '  泄密等级：' + record.leak_level, nodeShape: 1, color: '#ffbe0b', data: { riskLevel: 'medium', type: 'record', record: record } });
                }
                if (record.leak_level == 'HIGH') {
                    this.graph_json_data.nodes.push({ id: 'record-' + record.id, text: '  泄密等级：' + record.leak_level, nodeShape: 1, color: '#ff5c75', data: { riskLevel: 'high', type: 'record', record: record } });
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
            this.text = []
            this.userCount = 1
            this.highRiskCount = 0
            this.mediumRiskCount = 0
            this.lowRiskCount = 0
            this.highRiskRecords = []
            this.text.push(nodeObject.text);
            this.clickOne = nodeObject.text
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

            const getChildNodes = (node) => {
                // this.makeToast(n)
                const links = allLinks.filter(link => (link.fromNode === node));
                links.forEach(link => {
                    const childNode = link.toNode;
                    if (childNode.data.type === 'user') {

                        if (!this.text.includes(childNode.text)) { // 判断 text 数组中是否已经包含了 childNode.text
                            this.userCount++;
                            this.text.push(childNode.text);
                        }

                        getChildNodes(childNode)
                    } else if (childNode.data.type === 'record') {
                        if (childNode.data.riskLevel === 'high') {
                            this.highRiskCount++;
                            this.highRiskRecords.push(childNode.data.record);
                        } else if (childNode.data.riskLevel === 'medium') {
                            this.mediumRiskCount++;
                        } else if (childNode.data.riskLevel === 'low') {
                            this.lowRiskCount++;
                        }
                    }
                    // getChildNodes(childNode);
                });
            };
            getChildNodes(nodeObject);
            // this.makeToast(nodeObject)

            console.log('childNodes:', this.text);
            console.log('userCount:', this.userCount);
            console.log('highRiskCount:', this.highRiskCount);
            console.log('mediumRiskCount:', this.mediumRiskCount);
            console.log('lowRiskCount:', this.lowRiskCount);
            console.log('highRiskRecords:', this.highRiskRecords);
            this.showabout = true;
            // 弹出包含所有子节点信息的提示框
            // this.makeToast(text + nodeObject.text);
            // 有时候更改一些属性后，并不能马上同步到视图，这需要以下方法让视图强制根据数据同步到最新
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
}
</style>