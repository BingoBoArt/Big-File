<template>
  <div>
    <div>用户中心</div>
    <div>
      <input type="file" name="flie" @change="handlerFileChange" />
    </div>
    <div>
      <el-button @click="uploadFile">上传</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
    };
  },
  async mounted() {
    const ret = await this.$http.get("/user/info");
    console.log("user/info", ret);
  },
  methods: {
    async uploadFile() {
      const form = new FormData();
      form.append("name", "file");
      form.append("file", this.file);
      console.log("form", form);
      const ret = await this.$http.post("uploadfile", form);
      console.log("uploadFile-ret", ret);
    },
    handlerFileChange(e) {
      const [file] = e.target.files;
      console.log(file);
      if (!file) return;
      this.file = file;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>