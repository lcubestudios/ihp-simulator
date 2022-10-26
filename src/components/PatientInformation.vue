<template>
  <div class="tabs-menu">
    <ul class="menu cf">
      <li
        v-for="(tab_menu, i) in tab_menu"
        :key="i"
        :class="{ 
					active: i === activeIndex 
				}"
        @click="class_active(i, tab_menu.content)"
      >
        <a class="top-10" v-text="tab_menu.text"></a>
      </li>
    </ul>
    <div class="content-box pa-5">
      <div class="scroll-box" :class="{'active-box':slideDown}">
        <div class="tab-content">
          <p>{{ textData }}</p>
        </div>
      </div>
      <!--/scroll-box-->
    </div>
  </div>
  <!--/tabs-menu-->
</template>

<script>
export default {
  name: "PatientInformation",
  props:['slideDown'],
  data() {
    return {
      tab_menu: [
        {
          text: "Profile",
          content: "Patient Profile",
        },
        {
          text: "History",
          content: "Medical History",
        },
        {
          text: "Physical",
          content: "Physical Exams",
        },
        {
          text: "Findings",
          content: "Key Findings",
        },
      ],
      activeIndex: 0,
      textData: "Patient Profile",
    };
  },
  methods: {
    class_active(id, val) {
      this.activeIndex = id;
      this.textData = val;
    },
  },
};
</script>


<style lang="scss" scoped>
.v-list-item--active {
  border-left: 3px solid #4e9d2d;
}
.tabs-menu {
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  border-bottom-left-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
  border-top-right-radius: 5px;
}
.menu > li:last-child {
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}
/* Clearing floats */
.cf:before,
.cf:after {
  content: " ";
  display: table;
}
.cf:after {
  clear: both;
}
.cf {
  *zoom: 1;
}
/* Mini reset, no margins, paddings or bullets */
.menu,
.submenu {
  margin: 0;
  padding: 0;
  list-style: none;
}
/* Main level */
.menu {
  margin-left: 0px;
  display: flex;
  position: relative;
  right: 5px;
}
.menu > li {
  background: #d4e3cd;
  float: left;
  position: relative;
  transform: skewX(13deg);
  border-top-right-radius: 5px;
  width: 100%;
  box-shadow: 2px 0px 4px rgb(0 0 0 / 8%);
  border-right: 1px solid #eeeeee;
  margin-right: 1px;
}
.menu > li:hover a {
  color: #ffffff;
}
.menu a {
  display: block;
  color: #909090;
  text-decoration: none;
  font-size: 10px;
  text-align: center;
}
.menu a:hover {
  color: #ffffff;
}
.menu li:hover {
  background-color: #4e9d2d;
}
.menu > li > a {
  transform: skewX(-13deg);
  padding: 10px 5px;
}
.active {
  background-color: #4e9d2d !important;
  color: #ffffff !important;
}
.active-text {
  color: #ffffff !important;
}
li.active a {
  color: #ffffff !important;
}

/*-------scroll-------*/
.tab-content {
  min-height: 1000px;
}
.scroll-box {
  max-height: 505px;
  overflow: auto;
  // @media (min-width: 500px) {
  //   max-height: 390px;
  // }
  // @media (max-width: 500px) {
  //   max-height: 520px;
  // }
}
.scroll-box::-webkit-scrollbar {
  width: 4px;
  border-radius: 10px;
}
.scroll-box::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.scroll-box::-webkit-scrollbar-thumb {
  // background: #4E9D2D;
  background: #128612;
  border-radius: 10px;
}
.scroll-box::-webkit-scrollbar-thumb:hover {
  // background: #3d891c;
  background: #e0e0e0;
  border-radius: 10px;
}
/*-------/scroll-------*/

/*--svg css2--*/
.st0 {
  fill: #4e9d2d;
}
.st1 {
  fill: #f1f2f2;
}
.st2 {
  font-family: "ArialMT";
}
.st3 {
  font-size: 36px;
}
.st4 {
  fill: #d4e3cd;
}
/*--svg css2--*/
</style>