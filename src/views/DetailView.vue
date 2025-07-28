<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/"></IonBackButton>
        </IonButtons>
        <IonTitle>
          <div class="header-title">
            <span class="date">{{ formattedDate }}</span>
            <span class="time">{{ formattedTime }}</span>
          </div>
        </IonTitle>
        <IonButtons slot="end">
          <IonButton @click="editPhoto">Bearbeiten</IonButton>
          <IonButton color="danger" @click="deletePhoto">Löschen</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent :fullscreen="true" :scroll-y="false">
      <swiper
          v-if="photos.length > 0"
          :modules="[Zoom]"
          :zoom="true"
          :initial-slide="initialPhotoIndex"
          @slidechange="onSlideChange"
          class="swiper-container"
      >
        <swiper-slide v-for="photo in photos" :key="photo.id">
          <div class="swiper-zoom-container">
            <img v-if="photo.filepath" :src="Capacitor.convertFileSrc(photo.filepath)" class="detail-image" alt="Detailbild" />
          </div>
        </swiper-slide>
      </swiper>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonBackButton
} from '@ionic/vue';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { PhotoEditor } from '@capawesome/capacitor-photo-editor';
import { v4 as uuidv4 } from 'uuid';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/zoom';
import '@ionic/vue/css/ionic-swiper.css';

interface Photo {
  id: string;
  filepath: string;
  createdAt: number;
}

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const photos = ref<Photo[]>([]);
const currentPhotoIndex = ref(0);
const initialPhotoIndex = ref(0);

const currentPhoto = computed(() => photos.value[currentPhotoIndex.value]);

const formattedDate = computed(() => {
  if (!currentPhoto.value) return '';
  const date = new Date(currentPhoto.value.createdAt);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
});

const formattedTime = computed(() => {
  if (!currentPhoto.value) return '';
  const date = new Date(currentPhoto.value.createdAt);
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
});

const onSlideChange = (swiper: any) => {
  currentPhotoIndex.value = swiper.activeIndex;
};

async function loadPhotos() {
  const list: Photo[] = JSON.parse(localStorage.getItem('photos') || '[]');
  photos.value = list.sort((a, b) => b.createdAt - a.createdAt);

  const photoIndex = photos.value.findIndex(p => p.id === id);
  if (photoIndex !== -1) {
    initialPhotoIndex.value = photoIndex;
    currentPhotoIndex.value = photoIndex;
  } else {
    console.error('Foto nicht gefunden!');
    router.push('/');
  }
}

async function deletePhoto() {
  if (!currentPhoto.value) return;
  const photoToDelete = currentPhoto.value;
  const fileName = photoToDelete.filepath.substring(photoToDelete.filepath.lastIndexOf('/') + 1);

  try {
    await Filesystem.deleteFile({
      path: fileName,
      directory: Directory.Data,
    });

    const newList = photos.value.filter(p => p.id !== photoToDelete.id);
    localStorage.setItem('photos', JSON.stringify(newList));
    router.push('/');
  } catch (error) {
    console.error("Fehler beim Löschen des Fotos:", error);
  }
}

async function editPhoto() {
  if (!currentPhoto.value) return;

  const originalPhoto = currentPhoto.value;
  const originalPath = originalPhoto.filepath;
  const newFileName = `${uuidv4()}.jpeg`;

  try {
    // 1. Copy the original file
    const copiedFile = await Filesystem.copy({
      from: originalPath,
      to: newFileName,
      toDirectory: Directory.Data,
    });

    // 2. Edit the copy
    await PhotoEditor.editPhoto({
      path: copiedFile.uri,
    });

    // 3. Create a new photo entry for the edited version
    const newPhoto: Photo = {
      id: uuidv4(),
      filepath: copiedFile.uri,
      createdAt: Date.now(),
    };

    // 4. Load the current photo list, add the new photo, and save
    const currentPhotos: Photo[] = JSON.parse(localStorage.getItem('photos') || '[]');
    currentPhotos.unshift(newPhoto); // Add the new image at the beginning of the list
    localStorage.setItem('photos', JSON.stringify(currentPhotos));

    // 5. Navigate back to the gallery to see the update
    router.push('/');

  } catch (error) {
    console.error("Error editing photo:", error);
    // Optional: Delete the created copy if the editing fails
    try {
      await Filesystem.deleteFile({
        path: newFileName,
        directory: Directory.Data,
      });
    } catch (deleteError) {
      console.error("Error deleting temporary copy:", deleteError);
    }
  }
}


onMounted(loadPhotos);
</script>

<style scoped>
.header-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  padding-left: 0;
}

.header-title .date {
  font-weight: bold;
  font-size: 16px;
  line-height: 1.2;
}

.header-title .time {
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.2;
}

.swiper-container {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
}

.detail-image {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
}
</style>