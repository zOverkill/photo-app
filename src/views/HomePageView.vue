<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle class="home-title">Fotos</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent :fullscreen="true">
      <div v-if="!appReady" class="loading-container">
        <p>Wird geladen...</p>
      </div>

      <template v-if="appReady">
        <div v-for="(photoGroup, date) in groupedPhotos" :key="date" class="photo-group">
          <h2 class="date-header">{{ date }}</h2>
          <IonGrid :fixed="true">
            <IonRow>
              <IonCol size="4" v-for="photo in photoGroup" :key="photo.id">
                <IonImg :src="getPhotoSrc(photo.filepath)" @click="openDetail(photo.id)" />
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
        <div v-if="photos.length === 0" class="empty-gallery">
          <p>Noch keine Fotos vorhanden. Machen Sie Ihr erstes Foto!</p>
        </div>
      </template>

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton @click="takePhoto">
          <IonIcon :icon="camera" />
        </IonFabButton>
      </IonFab>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineExpose } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonImg, IonFab, IonFabButton, IonIcon, isPlatform, onIonViewWillEnter
} from '@ionic/vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { v4 as uuidv4 } from 'uuid';
import { camera } from 'ionicons/icons';

const router = useRouter();
const appReady = ref(false);
const photos = ref<Photo[]>([]);

// ANPASSUNG: Die 'photos' Variable wird für Tests verfügbar gemacht
defineExpose({ photos });

interface Photo {
  id: string;
  filepath: string;
  createdAt: number;
}

const groupedPhotos = computed(() => {
  const groups: { [key: string]: Photo[] } = {};
  const sortedPhotos = [...photos.value].sort((a, b) => b.createdAt - a.createdAt);

  sortedPhotos.forEach(photo => {
    const date = new Date(photo.createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let dayKey = '';

    if (date.toDateString() === today.toDateString()) {
      dayKey = `Heute - ${date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      dayKey = `Gestern - ${date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    } else {
      dayKey = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(photo);
  });

  return groups;
});

function getPhotoSrc(filepath: string): string {
  return Capacitor.convertFileSrc(filepath);
}

function savePhotosState() {
  localStorage.setItem('photos', JSON.stringify(photos.value));
}

async function loadPhotos() {
  try {
    const raw = localStorage.getItem('photos');
    if (raw) {
      photos.value = JSON.parse(raw);
    }
  } catch (e) {
    console.error("Fehler beim Laden der Fotos aus localStorage", e);
    photos.value = [];
  }
}

async function takePhoto() {
  try {
    const permissions = await Camera.requestPermissions({
      permissions: ['camera', 'photos']
    });

    if (permissions.camera !== 'granted' || permissions.photos !== 'granted') {
      console.error('Kamera- oder Speicherberechtigung verweigert.');
      return;
    }

    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90,
    });

    if (!image.webPath || !image.path) return;

    const fileName = `${uuidv4()}.jpeg`;
    const savedFile = await Filesystem.copy({
      from: image.path,
      to: fileName,
      toDirectory: Directory.Data,
    });

    photos.value.unshift({
      id: uuidv4(),
      filepath: savedFile.uri,
      createdAt: Date.now()
    });

    savePhotosState();
  } catch (error) {
    console.error("Fehler bei der Fotoaufnahme:", error);
  }
}

function openDetail(photoId: string) {
  router.push(`/detail/${photoId}`);
}

onIonViewWillEnter(() => {
  loadPhotos();
});

onMounted(() => {
  loadPhotos().then(() => {
    appReady.value = true;
  });
});
</script>

<style scoped>
.home-title {
  font-size: 22px;
  font-weight: bold;
}

ion-fab-button {
  --width: 70px;
  --height: 70px;
  margin: 16px;
}

ion-fab-button ion-icon {
  font-size: 36px;
}

ion-grid {
  --ion-grid-padding: 0;
  --ion-grid-column-padding: 1px;
}

ion-img {
  width: 100%;
  height: 33vw;
  object-fit: cover;
  cursor: pointer;
  border-radius: 12px;
}

.loading-container, .empty-gallery {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: #666;
  text-align: center;
  padding: 20px;
}

.date-header {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 24px 0 12px 16px;
}
</style>