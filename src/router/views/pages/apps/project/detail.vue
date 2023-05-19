<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import { authComputed, TaskComputed, TasksMethods } from '@/src/state/helpers'
import { widgetData, projectActivity } from './data-projectdetail'
import StatChart from '@components/widget-stat-chart'
import axios from 'axios'
import Demo from '@components/timer.vue'
export default {
  page: {
    title: 'Basic Tables',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, StatChart, Demo },
  data() {
    return {
      statuses: {
        'accepted': '采纳',
        'unaccepted': '未采纳',
        'ok': '最终可视意见'
      },
      errorModal:false,
      widgetData: widgetData,
      task: '',
      projectActivity: projectActivity,

      task_id: this.$route.query.task_id,
      ideas_long: 5,
      records_long: 5,
      ideaEdit: {
        selectedPage: null,
        overIdea: null,
        idea_id: null
      },

      salesDonutChart: {
        chartOptions: {
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
              },
              expandOnClick: false,
            },
          },
          colors: ['#43d39e', '#ffbe0b', '#ff5c75'],
          legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            itemMargin: {
              horizontal: 6,
              vertical: 3,
            },
          },
          labels: ['低风险', '中风险', '高风险'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
          tooltip: {
            y: {
              formatter: (value) => {
                return value + '条'
              },
            },
          },
        },
        series1: [],
      },
      salesDonutChart1: {
        chartOptions: {
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
              },
              expandOnClick: false,
            },
          },
          colors: ['#5369f8', '#f75971'],
          legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            itemMargin: {
              horizontal: 6,
              vertical: 3,
            },
          },
          labels: ['完成', '未完成'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
          tooltip: {
            y: {
              formatter: (value) => {
                return value + '%'
              },
            },
          },
        },
        series2: [],
      },
      salesDonutChart2: {
        chartOptions: {
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
              },
              expandOnClick: false,
            },
          },

          legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            itemMargin: {
              horizontal: 6,
              vertical: 3,
            },
          },
          labels: ['开发人员', '一级', '二级', '三级', '四级', '五级'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
          tooltip: {
            y: {
              formatter: (value) => {
                return value + ''
              },
            },
          },
        },
        series3: [],
      }
    }

  },
  computed: {
    ...authComputed,
    ...TaskComputed,


    // 根据选中的页面找到其对应 Iead，并返回描述信息
    currentPageIdea() {
      if (this.ideaEdit.selectedPage) {
        const idea = this.task.ideas.find(idea => idea.paper_id === this.ideaEdit.selectedPage && idea.status === 'ok');
        if (idea) {

          return idea.description;
        }
        else return '';
      } else {
        return '';
      }
    }

  },
  async mounted() {
    console.log(this.task_id)
    await this.getTasksDetail({ id: this.task_id })
    this.task = this.DetailTask
    this.salesDonutChart.series1[0] = this.task.records.filter(record => record.leak_level === 'LOW').length
    this.salesDonutChart.series1[1] = this.task.records.filter(record => record.leak_level === 'MEDIUM').length
    this.salesDonutChart.series1[2] = this.task.records.filter(record => record.leak_level === 'HIGH').length
    this.salesDonutChart1.series2[0] = this.task.progress
    this.salesDonutChart1.series2[1] = 100 - this.task.progress
    this.salesDonutChart2.series3[0] = this.task.users.filter(user => user.role_id === 0).length
    this.salesDonutChart2.series3[1] = this.task.users.filter(user => user.role_id === 1).length
    this.salesDonutChart2.series3[2] = this.task.users.filter(user => user.role_id === 2).length
    this.salesDonutChart2.series3[3] = this.task.users.filter(user => user.role_id === 3).length
    this.salesDonutChart2.series3[4] = this.task.users.filter(user => user.role_id === 4).length
    this.salesDonutChart2.series3[5] = this.task.users.filter(user => user.role_id === 5).length
  },
  methods: {
    ...TasksMethods,
    loadAll() {
      this.ideas_long = this.task.ideas.length
    },
    recordAll() {
      this.records_long = this.task.records.length
    },
    handleClick(idea_id) {
      // 处理表单数据...

      // 发送请求至后端...
      const formData = new FormData();
      formData.append('beforeIdea', this.currentPageIdea);
      formData.append('selectedPage', this.ideaEdit.selectedPage);
      formData.append('idea_id', idea_id);
      formData.append('overIdea', this.ideaEdit.overIdea);

      axios.post('/api/document/updateIdea', formData).then(response => {
        console.log(response.data);//接收返回结果
        const index = this.task.ideas.findIndex(idea => idea.id == idea_id)
        if (index !== -1) {
          this.task.ideas[index].status = 'accepted'


        }
        this.makeToast('意见修改成功！')
      }).catch(error => {
        console.error(error);
      });
    },
    paragraphs(text) {
      // 将输入的文本字符串以 \n 进行分割为数组
      return text.split('\n')
    },
    async deleteTask() {

      
      await axios.get('/api/documentTask/deleteTask', { params: { id: this.task.id } }).then(response => {
        this.makeToast('删除成功')
      })
      this.errorModal=false
      this.task=null
    },
    makeToast(variant = null) {
      this.$bvToast.toast(variant, {
        title: ` ${variant || 'default'}`,
        variant: "success",
        toaster: 'b-toaster-top-center',
        solid: true
      })
    },
  }
}
</script>

<template>
  <Layout>
    <div class="row page-title">
      <div class="col-sm-8 col-xl-6">
        <h4 class="mb-1 mt-0 ">
          文档项目: {{ task.title }}
          <div class="badge badge-success font-size-13 font-weight-normal">{{ task.status }}</div>
        </h4>

        <div class="badge badge-soft-primary font-size-13 font-weight-normal ml-1" v-for="type in task.type">
          {{ type.name }}</div>
      </div>
      <div class="col-sm-4 col-xl-6 text-sm-right">
        <div class="btn-group ml-2 d-none d-sm-inline-block">
          <button type="button" class="btn btn-soft-primary btn-sm">
            <i class="uil uil-edit mr-1"></i>编辑
          </button>
        </div>
        <div class="btn-group d-none d-sm-inline-block ml-1">
          <button type="button" class="btn btn-soft-danger btn-sm" @click="errorModal = true">
            <i class="uil uil-trash-alt mr-1"></i>删除
          </button>
        </div>
      </div>
      <b-modal v-model="errorModal" centered hide-footer title="警告" title-class="font-18">
        <div class="text-center">
          <i class="uil-no-entry text-warning display-3"></i>
          <h4 class="text-danger mt-4">删除预警</h4>
          <p class="w-75 mx-auto text-muted">请注意，你的行为可能会导致问题，请谨慎选择</p>
          <div class="mt-4">
            <a class="btn btn-outline-primary btn-rounded width-md" href="javascript: void(0);"
              @click="deleteTask">
              <i class="uil uil-arrow-right mr-1"></i>同意<i class="uil uil-arrow-left mr-1"></i>
            </a>
          </div>
        </div>
      </b-modal>
    </div>

    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body p-0">
            <h6 class="card-title border-bottom p-3 mb-0 header-title">任务总览</h6>
            <div class="row py-1">
              <!-- Widget -->

              <div class="col-xl-3 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="grid" class="align-self-center icon-dual icon-lg mr-4 icon-dual-dark"></feather>
                  <div class="media-body">
                    <h4 class="mt-0 mb-0">{{ task.ideas.length }}</h4>
                    <span class="text-muted"> 文档意见条数 </span>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="check-square" class="align-self-center icon-dual icon-lg mr-4 icon-dual-dark"></feather>
                  <div class="media-body">
                    <h4 class="mt-0 mb-0">{{ task.records.length }}</h4>
                    <span class="text-muted"> 文档阅读记录条数 </span>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="users" class="align-self-center icon-dual icon-lg mr-4 icon-dual-dark"></feather>
                  <div class="media-body">
                    <h4 class="mt-0 mb-0">{{ task.users.length }}</h4>
                    <span class="text-muted"> 参与人员数量 </span>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="clock" class="align-self-center icon-dual icon-lg mr-4 icon-dual-dark"></feather>
                  <div class="media-body">
                    <h4 class="mt-0 mb-0">{{ task.progress }}/100</h4>
                    <span class="text-muted"> 文档任务进度 </span>
                  </div>

                </div>


              </div>

              <div class="col-xl-3 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="eye" class="align-self-center icon-dual icon-lg mr-4 icon-dual-primary"></feather>
                  <div class="media-body">
                    <h4 class="mt-0 mb-0">{{ task.records.reduce((prev, current) => prev.id > current.id ? prev :
                      current).create_time.substr(0, 11) }}</h4>
                    <span class="text-muted"> 最新一次访问 </span>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="alert-circle" class="align-self-center icon-dual icon-lg mr-4 icon-dual-success">
                  </feather>
                  <div class="media-body">
                    <h4 class="mt-0 mb-0">{{ task.records.filter(record => record.leak_level === 'LOW').length }}</h4>
                    <span class="text-muted"> 低泄密风险 </span>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="alert-octagon" class="align-self-center icon-dual icon-lg mr-4 icon-dual-warning">
                  </feather>
                  <div class="media-body">
                    <h4 class="mt-0 mb-0">{{ task.records.filter(record => record.leak_level === 'MEDIUM').length }}</h4>
                    <span class="text-muted"> 中泄密风险 </span>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="alert-triangle" class="align-self-center icon-dual icon-lg mr-4 icon-dual-danger">
                  </feather>
                  <div class="media-body">
                    <h4 class="mt-0 mb-0">{{ task.records.filter(record => record.leak_level === 'HIGH').length }}</h4>
                    <span class="text-muted"> 高泄密风险 </span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- details-->
    <div class="row">
      <div class="col-xl-8">
        <div class="card">
          <div class="card-body">
            <h6 class="mt-0 header-title">关于项目</h6>

            <div class="text-muted mt-3" style="height: 790px;">
              <p><strong>
                  <span>{{ task.text }}</span></strong>
              </p>
              <p>本项目规定：</p>
              <p v-for="(paragraph, index) in paragraphs(this.task.notes)" :key="index"><span> （{{ index + 1 }}）</span> {{
                paragraph }}</p>

              <p>阅读秘密文件基本规定：</p>

              <p>（1）阅读、传达国家秘密文件、资料，要严格限制在规定的范围内，不得擅自扩大范围;</p>

              <p>（2）阅读国家秘密文件、资料，必须在办公室或阅文室等有保密保障的场所进行;</p>

              <p>（3）阅读国家秘密文件、资料，应当进行登记，不得由阅件人直接传给他人;</p>

              <p>（4）不得擅自存留传阅的国家秘密文件、资料;</p>

              <p>（5）传达国家秘密文件时，不得使用无线话筒等无保密保障的设备;</p>

              <p>（6）听传达的人员应当遵守保密纪律，需要录音、录像的，应当经过批准。</p>

              <div class="tags">
                <h6 class="font-weight-bold">Tags</h6>
                <div class="text-uppercase">
                  <a href="javascript: void(0);" class="badge  mr-2" :class="{

                    'bg-soft-warning text-warning':
                      `${index % 3}` == 0,
                    'bg-soft-success text-success':
                      `${index % 3}` == 1,
                    'bg-soft-danger text-danger':
                      `${index % 3}` == 2,
                  }" v-for="type, index in task.type">{{ type.name }}</a>

              </div>
              </div>

              <div class="row">
                <div class="col-lg-3 col-md-6">
                  <div class="mt-4">
                    <p class="mb-2">
                      <i class="uil-calender text-danger"></i> 开始时间
                    </p>
                    <h5 class="font-size-16">{{ task.create_time.substr(0, 11) }}</h5>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="mt-4">
                    <p class="mb-2">
                      <i class="uil-calendar-slash text-danger"></i> 截止时间
                    </p>
                    <h5 class="font-size-16">{{ task.deadline_time.substr(0, 11) }}</h5>
                  </div>
                </div>


                <div class="col-lg-3 col-md-6">
                  <div class="mt-4">
                    <p class="mb-2">
                      <i class="uil-user text-danger"></i> 创建者
                    </p>
                    <h5 class="font-size-16">{{ currentUser.username }}</h5>
                  </div>
                </div>
              </div>

              <div class="assign team mt-4">
                <h6 class="font-weight-bold">执行任务人员</h6>
                <a href="javascript: void(0);" v-for="user in task.users">
                  <img :src="user.icon" alt class="avatar-sm m-1 rounded-circle" />
                </a>
              </div>

              <div class="mt-4">
                <h6 class="font-weight-bold">相关文件</h6>

                <div class="row">
                  <div class="col-xl-4 col-md-6">
                    <div class="p-2 border rounded mb-2">
                      <div class="media">
                        <div class="avatar-sm font-weight-bold mr-3">
                          <span class="avatar-title rounded bg-soft-primary text-primary">
                            <i class="uil-file-plus-alt font-size-18"></i>
                          </span>
                        </div>
                        <div class="media-body">
                          <a href="javascript: void(0);" class="d-inline-block mt-2">违反纪律严重后果批示.pdf</a>
                        </div>
                        <div class="float-right mt-1">
                          <a href="javascript: void(0);" class="p-2">
                            <i class="uil-download-alt font-size-18"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-4 col-md-6">
                    <div class="p-2 border rounded mb-2">
                      <div class="media">
                        <div class="avatar-sm font-weight-bold mr-3">
                          <span class="avatar-title rounded bg-soft-primary text-primary">
                            <i class="uil-file-plus-alt font-size-18"></i>
                          </span>
                        </div>
                        <div class="media-body">
                          <a href="javascript: void(0);" class="d-inline-block mt-2">机密文件办公规则.pdf</a>
                        </div>
                        <div class="float-right mt-1">
                          <a href="javascript: void(0);" class="p-2">
                            <i class="uil-download-alt font-size-18"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end card -->
        <!-- end card -->
        <div class="card">
          <div class="card-body">
            <b-tabs pills class="navtab-bg">
              <b-tab title="意见" active>
                <h5 class="mb-4 pb-1 header-title">全部意见 ({{ task.ideas.length }})</h5>
                <div style="overflow-y: scroll;height: 400px;">
                  <div class="media mb-4 font-size-14" v-for="idea in task.ideas.slice(0, ideas_long).reverse() "
                    v-if="idea.status != 'ok'">
                    <div class="mr-3">
                      <a href="#">
                        <img class="media-object rounded-circle avatar-sm" alt :src="idea.icon" />
                      </a>
                    </div>
                    <div class="media-body">
                      <h5 class="mt-0 font-size-15">{{ idea.user_name }}<span>{{ }}</span>
                        <div class="float-right font-size-15" :class="{

                          'bg-soft-warning text-warning':
                            `${idea.status}` === 'unaccepted',
                          'bg-soft-success text-success':
                            `${idea.status}` === 'accepted',
                          'bg-soft-danger text-danger':
                            `${idea.status}` === 'ok',
                          'my-div':
                            `${idea.status}` == 'ok',
                        }"> {{ statuses[idea.status] }} </div>
                      </h5>
                      <p class="text-muted mb-1">
                        <a href class="text-danger"></a>
                        {{ idea.description }}
                      </p>
                      <b-dropdown variant="outline-dark" class="ml-1" v-model="idea.status" :class="{
                        'my-div':
                          `${idea.status}` == 'ok',
                      }">
                        <template slot="button-content">
                          <div class=" font-size-15 ">决定采纳</div>
                        </template>
                        <b-dropdown-text style="width: 320px;">

                          <div class="form-group">
                            <label for="exampleDropdownFormEmail2">意见</label>
                            <input id="exampleDropdownFormEmail2" type="text" class="form-control"
                              :value="idea.description" />
                          </div>
                          <div class="form-group">
                            <label for="页数">选择修改的对应页</label>
                            <input id="页数" type="number" class="form-control" v-model.number="ideaEdit.selectedPage" />
                          </div>
                          <div class="form-group">
                            <label for="exampleDropdownFormPassword2">对应页已有的意见</label>
                            <input id="exampleDropdownFormPassword2" type="text" class="form-control"
                              :value="currentPageIdea" />
                          </div>
                          <div class="form-group">
                            <label for="exampleDropdownFormPassword2">修改后的意见</label>
                            <input id="exampleDropdownFormPassword2" type="text" class="form-control"
                              placeholder="修改后的意见内容" v-model="ideaEdit.overIdea" />
                          </div>

                          <button type="submit" class="btn btn-primary"
                            @click.prevent="handleClick(idea.id)">提交修改</button>
                        </b-dropdown-text>
                      </b-dropdown>

                    </div>
                  </div>
                </div>

                <div class="text-center">
                  <a href="javascript:void(0);" class="btn btn-sm border btn-white" @click="loadAll">
                    <feather type="loader" class="icon-dual icon-xs mr-2 "></feather>加载更多
                  </a>
                </div>
                <hr />
                <div style="overflow-y: scroll;height: 300px;" class="border-bottom">
                  <h5 class="mb-4 pb-1 header-title">文档最终意见</h5>
                  <div class="media mb-4 font-size-14" v-for="idea in task.ideas" v-if="idea.status == 'ok'">
                    <div class="mr-3">
                      <a href="#">
                        <img class="media-object rounded-circle avatar-sm" alt :src="idea.icon" />
                      </a>
                    </div>
                    <div class="media-body">
                      <h5 class="mt-0 font-size-15">第{{ idea.paper_id }}页<div class="float-right font-size-15" :class="{

                        'bg-soft-warning text-warning':
                          `${idea.status}` === 'unaccepted',
                        'bg-soft-success text-success':
                          `${idea.status}` === 'accepted',
                        'bg-soft-danger text-danger':
                          `${idea.status}` === 'ok',

                      }"> {{ statuses[idea.status] }} </div>
                      </h5>
                      <p class="text-muted mb-1">
                        <a href class="text-danger"></a>
                        {{ idea.description }}
                      </p>
                    </div>
                  </div>
                </div>
                <h5 class="mb-4 pb-1 header-title">提出意见</h5>
                <div class="media">
                  <div class="d-flex mr-3">
                    <a href="#">
                      <img class="media-object rounded-circle avatar-sm" alt :src="this.currentUser.icon" />
                    </a>
                  </div>
                  <div class="media-body">
                    <input type="text" class="form-control input-sm" placeholder="Some text value..." />
                  </div>
                </div>
              </b-tab>
              <b-tab title="人员知识图谱">
                <div>
                  <Demo :task="task" :createUser="this.currentUser" />
                </div>

              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <h6 class="mt-0 header-title">统计信息</h6>

            <div class="list-unstyled activity-widget" style="overflow-y: scroll;height: 800px;">
              <!-- Sales donut chart -->
              <div class="border">
                <p class="card-title mt-0 pb-2 header-title">文档行为统计数据</p>
                <apexchart type="donut" height="304" :series="salesDonutChart.series1"
                  :options="salesDonutChart.chartOptions"></apexchart>
              </div>
              <div class="border">
                <p class="card-title mt-0 pb-2 header-title">完成进度</p>
                <apexchart type="donut" height="304" :series="salesDonutChart1.series2"
                  :options="salesDonutChart1.chartOptions"></apexchart>
              </div>
              <div class="border">
                <p class="card-title mt-0 pb-2 header-title">人员角色情况</p>
                <apexchart type="donut" height="304" :series="salesDonutChart2.series3"
                  :options="salesDonutChart2.chartOptions"></apexchart>
              </div>

              <!-- end sales chart -->
            </div>
            <!-- <div class="text-center">
                                                                <a href="javascript:void(0);" class="btn btn-sm border btn-white" @click="recordAll">
                                                                  <feather type="loader" class="icon-dual icon-xs mr-2"></feather>加载更多
                                                                </a>
                                                              </div> -->
          </div>

        </div>
        <div class="card">
          <div class="card-body">
            <h6 class="mt-0 header-title">文档办公记录</h6>

            <ul class="list-unstyled activity-widget" style="overflow-y: scroll;height: 900px;">
              <li v-for="record in task.records.slice(0, records_long).reverse()" :key="record.id" class="activity-list">
                <div class="media">
                  <div class="text-center mr-3">
                    <div class="avatar-sm">
                      <span class="avatar-title rounded-circle" :class="{
                        'bg-soft-primary text-primary':
                          `${record.leak_level}` === 'primary',
                        'bg-soft-success text-success':
                          `${record.leak_level}` === 'LOW',
                        'bg-soft-warning text-warning':
                          `${record.leak_level}` === 'MEDIUM',
                        'bg-soft-danger text-danger':
                          `${record.leak_level}` === 'HIGH',
                      }">{{ record.user_name }}</span>
                    </div>
                    <p class="text-muted font-size-13 mb-0">{{ record.create_time.substr(5, 5) }}</p>
                  </div>
                  <div class="media-body overflow-hidden">
                    <h5 class="font-size-15 mt-2 mb-1">
                      <a href="javascript: void(0);" class="text-dark">{{
                        record.title
                      }}</a>
                    </h5>
                    <p class="text-muted font-size-13 text-truncate mb-0" :class="{
                      'bg-soft-primary text-primary':
                        `${record.leak_level}` === 'primary',
                      'bg-soft-success text-success':
                        `${record.leak_level}` === 'LOW',
                      'bg-soft-warning text-warning':
                        `${record.leak_level}` === 'MEDIUM',
                      'bg-soft-danger text-danger':
                        `${record.leak_level}` === 'HIGH',
                    }">{{ record.description
}}</p>
                  </div>
                </div>
              </li>
            </ul>
            <div class="text-center">
              <a href="javascript:void(0);" class="btn btn-sm border btn-white" @click="recordAll">
                <feather type="loader" class="icon-dual icon-xs mr-2"></feather>加载更多
              </a>
            </div>
          </div>

        </div>
      </div>

    </div>

  </Layout>
</template>
<style scoped>
.my-div {
  display: none;
}
</style>
