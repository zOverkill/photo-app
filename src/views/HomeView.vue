<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Foto Galerie</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="gallery-grid">
        <ImageCard
            v-for="photo in photos"
            :key="photo.id"
            :imageUrl="photo.src"
            @click="openPhotoModal(photo)"
        />
      </div>
      <ion-fab horizontal="end" vertical="bottom">
        <ion-fab-button @click="navigateToCamera">
          <ion-icon name="camera-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal v-model="photoModalVisible">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ selectedPhoto.title }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closePhotoModal">
                Schließen
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <img :src="selectedPhoto.src" style="width: 100%; height: auto;">
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useStorage } from '@vueuse/core';
import ImageCard from '../components/ImageCard.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    ImageCard
  },
  setup() {
    const photos = useStorage('photos', []);
    const photoModalVisible = ref(false);
    const selectedPhoto = ref(null);

    const navigateToCamera = () => {
      this.$router.push('/camera');
    };

    const openPhotoModal = (photo) => {
      selectedPhoto.value = photo;
      photoModalVisible.value = true;
    };

    const closePhotoModal = () => {
      photoModalVisible.value = false;
    };

    // DEV-Modus: 10 Beispielbilder laden
    const devMode = ref(true); // Aktiviere oder deaktiviere den DEV-Modus
    onMounted(() => {
      if (devMode.value && photos.value.length === 0) {
        const samplePhotos = [
          { id: 1, src: 'https://picsum.photos/id/237/200/300', title: 'Bild 1' },
          { id: 2, src: 'https://picsum.photos/id/238/200/300', title: 'Bild 2' },
          { id: 3, src: 'https://picsum.photos/id/239/200/300', title: 'Bild 3' },
          { id: 4, src: 'https://picsum.photos/id/240/200/300', title: 'Bild 4' },
          { id: 5, src: 'https://picsum.photos/id/241/200/300', title: 'Bild 5' },
          { id: 6, src: 'https://picsum.photos/id/242/200/300', title: 'Bild 6' },
          { id: 7, src: 'https://picsum.photos/id/243/200/300', title: 'Bild 7' },
          { id: 8, src: 'https://picsum.photos/id/244/200/300', title: 'Bild 8' },
          { id: 9, src: 'https://picsum.photos/id/245/200/300', title: 'Bild 9' },
          { id: 10, src: 'https://picsum.photos/id/246/200/300', title: 'Bild 10' }
        ];
        photos.value = samplePhotos;
      }
    });

    return {
      photos,
      navigateToCamera,
      openPhotoModal,
      closePhotoModal,
      photoModalVisible,
      selectedPhoto,
      devMode
    };
  }
});
</script>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 Bilder pro Reihe */
  gap: 8px;
  padding: 16px;
}
</style>