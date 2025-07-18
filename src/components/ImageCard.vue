<template>
  <div class="image-card">
    <img :src="imageUrl" alt="Foto" @click="onClick">
  </div>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String,
      required: true
    }
  },
  methods: {
    onClick() {
      this.$emit('click', this.imageUrl);
    }
  }
};
</script>

<style scoped>
.image-card {
  width: 100%;
  height: auto;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 8px;
}

.image-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
  cursor: pointer;
}
</style>