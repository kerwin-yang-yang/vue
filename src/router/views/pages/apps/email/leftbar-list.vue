<script>
export default {
  props: ['unread','else','important'],
  data() {
    return {
      emailList: [
        {
          icon: 'uil uil-envelope-alt',
          name: '未阅读',
          value: this.unread,
          text: 'danger',
        },
        {
          icon: 'uil uil-envelope-star',
          name: '重要',
          value: this.important,
          text: 'danger',
        },
        {
          icon: 'uil uil-envelope-edit',
          name: '其他',
          value: this.else,
          text: 'info',
        },
        // {
        //   icon: 'uil uil-envelope-send',
        //   name: '存在隐患',
        //   value: 8,
        //   text: 'danger',
        // },
        // {
        //   icon: 'uil uil-trash',
        //   name: 'Trash',
        //   value: 8,
        //   text: 'success',
        // },
      ],
      emailLabel: [
        {
          text: 'primary',
          name: '公告',
        },
        {
          text: 'success',
          name: '意见',
        },
        {
          text: 'warning',
          name: '通告',
        },
        {
          text: 'success',
          name: '议案',
        },
        {
          text: 'secondary',
          name: '请示',
        },
      ],
    }
  },
  // created () {
  //   this.emailList[0]
  // }
}
</script>

<template>
  <div>
    <!-- List  -->
    <div v-for="list in emailList" :key="list.icon" class="mail-list">
      <a
        href="javascript: void(0);"
        class="list-group-item border-0 font-weight-bold"

      >
              <!-- :class="{ 'text-danger font-weight-bold': `${list.text}` === 'danger','text-info font-weight-bold':`${list.text}` === 'info','text-success ':`${list.text}` === 'success'}" -->
        <i :class="`${list.icon} `"></i>
        {{ list.name }}
        <span
          class="badge bagde-danger float-right ml-2 mt-1 badge-dark"

          >{{ list.value }}</span
        >
        <!-- :class="{
            'badge-danger': `${list.text}` === 'danger',
            'badge-dark': `${list.text}` === 'info',
          }" -->
      </a>
    </div>
    <!-- End list -->

    <!-- Label -->
    <h5 class="mt-4" style="border-bottom: 1px dashed;">标签</h5>
    <div
      v-for="label in emailLabel"
      :key="label.name"
      class="list-group b-0 mail-list"
    >
      <a href="javascript: void(0);" class="list-group-item border-0">
        <span
          :class="`uil uil-circle text-${label.text} font-size-12 mr-1`"
        ></span>
        {{ label.name }}
      </a>
    </div>
    <!-- End label -->
  </div>
</template>
